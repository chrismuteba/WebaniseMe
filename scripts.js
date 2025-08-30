document.addEventListener('DOMContentLoaded', function() {
    // Debug information
    console.log('Base URL:', window.location.href);
    console.log('Path:', window.location.pathname);
    console.log('Origin:', window.location.origin);
    console.log('🟢 UPDATED SCRIPTS.JS FILE - Version 2.1 - January 21, 2025');
    
    // Test Contentful API access
    const testContentfulAccess = async () => {
        try {
            const spaceId = '05xlhdzrkv93';
            const accessToken = 'YmzWsiU6I-8dCtI63Ipk9P1lTxGx1baY7tr4DkkoIOc';
            const url = `https://cdn.contentful.com/spaces/${spaceId}?access_token=${accessToken}`;
            
            console.log('Testing Contentful API access...');
            const response = await fetch(url);
            const data = await response.json();
            
            console.log('Contentful API accessible:', response.ok);
            console.log('Space name:', data.name);
            return response.ok;
        } catch (error) {
            console.error('Error accessing Contentful API:', error);
            return false;
        }
    };
    
    testContentfulAccess();
    
    // Test content types
    const testContentTypes = async () => {
        try {
            const spaceId = '05xlhdzrkv93';
            const accessToken = 'YmzWsiU6I-8dCtI63Ipk9P1lTxGx1baY7tr4DkkoIOc';
            const url = `https://cdn.contentful.com/spaces/${spaceId}/content_types?access_token=${accessToken}`;
            
            console.log('Fetching content types...');
            const response = await fetch(url);
            const data = await response.json();
            
            console.log('Content types accessible:', response.ok);
            if (response.ok && data.items) {
                console.log('Available content types:');
                data.items.forEach(type => {
                    console.log(`- ${type.sys.id}: ${type.name}`);
                });
            }
        } catch (error) {
            console.error('Error fetching content types:', error);
        }
    };
    
    testContentTypes();
    
    // Test for any entries
    const testEntries = async () => {
        try {
            const spaceId = '05xlhdzrkv93';
            const accessToken = 'YmzWsiU6I-8dCtI63Ipk9P1lTxGx1baY7tr4DkkoIOc';
            const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}`;
            
            console.log('Fetching all entries...');
            const response = await fetch(url);
            const data = await response.json();
            
            console.log('Entries accessible:', response.ok);
            if (response.ok && data.items) {
                console.log('Total entries found:', data.items.length);
                if (data.items.length > 0) {
                    console.log('First entry content type:', data.items[0].sys.contentType.sys.id);
                    console.log('First entry fields:', Object.keys(data.items[0].fields));
                }
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
        }
    };
    
    testEntries();
    // Update copyright year automatically
    const copyrightYearElement = document.getElementById('copyright-year');
    if (copyrightYearElement) {
        copyrightYearElement.textContent = new Date().getFullYear();
    }
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                // In a real application, you would send this to your server
                console.log('Newsletter subscription for:', emailInput.value);
                
                // Show success message
                const formHTML = newsletterForm.innerHTML;
                newsletterForm.innerHTML = `
                    <div class="bg-green-500 bg-opacity-20 text-white p-4 rounded-md text-center">
                        <i class="fas fa-check-circle text-2xl mb-2"></i>
                        <p>Thank you for subscribing!</p>
                    </div>
                `;
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    newsletterForm.innerHTML = formHTML;
                }, 3000);
            }
        });
    }
    
    // Add hover animations for social icons
    const socialIcons = document.querySelectorAll('.social-icon-link');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            const iconElement = this.querySelector('i');
            iconElement.classList.add('animate-bounce');
            setTimeout(() => {
                iconElement.classList.remove('animate-bounce');
            }, 1000);
        });
    });
    
    // Enhanced Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        // Ensure menu button is always visible
        menuBtn.style.display = 'flex';
        menuBtn.style.visibility = 'visible';
        menuBtn.style.opacity = '1';
        
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('visible');
            
            // Toggle icon between bars and X
            const icon = menuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            // Prevent body scrolling when menu is open
            if (mobileMenu.classList.contains('visible')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('visible');
                
                const icon = menuBtn.querySelector('i');
                if (icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                
                // Restore body scrolling
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('visible');
                
                const icon = menuBtn.querySelector('i');
                if (icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                
                // Restore body scrolling
                document.body.style.overflow = '';
            });
        });
    }
    
    // Enhanced Industries dropdown functionality - Handle BOTH desktop and mobile dropdowns
    const industriesDropdowns = document.querySelectorAll('.industries-dropdown-btn');
    const industriesDropdownMenus = document.querySelectorAll('.dropdown-menu');
    
    // Handle each dropdown separately
    industriesDropdowns.forEach((industriesDropdown, index) => {
        const industriesDropdownMenu = industriesDropdownMenus[index];
        const dropdownContainer = industriesDropdown.closest('.relative, .py-2');
        const isMobileDropdown = dropdownContainer && dropdownContainer.classList.contains('py-2');
        
        if (industriesDropdown && industriesDropdownMenu) {
            let isDropdownOpen = false;
            let hoverTimeout = null;
            
            // Set ARIA attributes
            industriesDropdown.setAttribute('aria-expanded', 'false');
            industriesDropdownMenu.setAttribute('role', 'menu');
            
            // Function to show dropdown
            function showDropdown() {
                isDropdownOpen = true;
                industriesDropdownMenu.classList.add('show');
                industriesDropdownMenu.style.display = 'block';
                industriesDropdown.setAttribute('aria-expanded', 'true');
                
                // Rotate chevron
                const chevron = industriesDropdown.querySelector('i');
                if (chevron) {
                    chevron.style.transform = 'rotate(180deg)';
                }
            }
            
            // Function to hide dropdown
            function hideDropdown() {
                isDropdownOpen = false;
                industriesDropdownMenu.classList.remove('show');
                if (isMobileDropdown) {
                    industriesDropdownMenu.style.display = 'none';
                }
                industriesDropdown.setAttribute('aria-expanded', 'false');
                
                // Reset chevron
                const chevron = industriesDropdown.querySelector('i');
                if (chevron) {
                    chevron.style.transform = 'rotate(0deg)';
                }
            }
            
            // Initialize mobile dropdown as hidden
            if (isMobileDropdown) {
                industriesDropdownMenu.style.display = 'none';
            }
            
            // Desktop hover behavior (768px and up) - only for desktop dropdown
            if (dropdownContainer && dropdownContainer.classList.contains('relative')) {
                // Mouse enter - show dropdown on desktop
                dropdownContainer.addEventListener('mouseenter', function() {
                    if (window.innerWidth >= 768) {
                        clearTimeout(hoverTimeout);
                        showDropdown();
                    }
                });
                
                // Mouse leave - hide dropdown on desktop with delay
                dropdownContainer.addEventListener('mouseleave', function() {
                    if (window.innerWidth >= 768) {
                        hoverTimeout = setTimeout(() => {
                            hideDropdown();
                        }, 150); // Small delay to prevent flickering
                    }
                });
            }
            
            // Click behavior for mobile and desktop
            industriesDropdown.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle dropdown
                if (isDropdownOpen) {
                    hideDropdown();
                } else {
                    showDropdown();
                }
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (dropdownContainer && !dropdownContainer.contains(e.target)) {
                    hideDropdown();
                }
            });
            
            // Close dropdown when clicking on dropdown links
            const dropdownLinks = industriesDropdownMenu.querySelectorAll('a');
            dropdownLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    // Don't prevent default - allow navigation
                    hideDropdown();
                    
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                        const menuBtn = document.getElementById('menu-btn');
                        if (menuBtn) {
                            const icon = menuBtn.querySelector('i');
                            if (icon) {
                                icon.classList.remove('fa-times');
                                icon.classList.add('fa-bars');
                            }
                        }
                    }
                });
                
                // Add keyboard navigation
                link.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
            
            // Close dropdown when pressing Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && isDropdownOpen) {
                    hideDropdown();
                    industriesDropdown.focus(); // Return focus to button
                }
            });
            
            // Handle window resize - close dropdown and reset behavior
            window.addEventListener('resize', function() {
                hideDropdown();
                clearTimeout(hoverTimeout);
            });
        }
    });
    
    // Close dropdown when other nav links are clicked
    const allNavLinks = document.querySelectorAll('.nav-link:not(.industries-dropdown-btn)');
    allNavLinks.forEach(navLink => {
        navLink.addEventListener('click', function() {
            // Close all dropdowns
            industriesDropdowns.forEach((dropdown, index) => {
                const menu = industriesDropdownMenus[index];
                if (menu) {
                    menu.classList.remove('show');
                    dropdown.setAttribute('aria-expanded', 'false');
                    const chevron = dropdown.querySelector('i');
                    if (chevron) {
                        chevron.style.transform = 'rotate(0deg)';
                    }
                }
            });
        });
    });
    
    // Fixed header with logo shrink on scroll - NEVER HIDE THE NAVIGATION
    const mainNav = document.getElementById('main-nav');
    const logoImg = mainNav && mainNav.querySelector('img');
    const initialLogoSize = 'h-12';
    const scrolledLogoSize = 'h-10';
    
    // Ensure the navigation bar is always fixed and visible
    if (mainNav) {
        // Force the navigation to always be visible with fixed positioning
        mainNav.style.position = 'fixed';
        mainNav.style.top = '0';
        mainNav.style.left = '0';
        mainNav.style.right = '0';
        mainNav.style.zIndex = '1000';
        mainNav.style.width = '100%';
        mainNav.style.transform = 'none';
        mainNav.style.visibility = 'visible';
        mainNav.style.opacity = '1';
        mainNav.style.display = 'block';
        mainNav.classList.add('bg-white', 'shadow-md');
    }
    
    // Track scroll direction and position
    let lastScrollTop = 0;
    let scrollingDown = false;
    
    // Add scrolling class to html element
    document.documentElement.classList.add('scrolling');
    
    window.addEventListener('scroll', function() {
        if (!mainNav || !logoImg) return;
        
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        scrollingDown = scrollTop > lastScrollTop;
        lastScrollTop = scrollTop;
        
        // NEVER hide or transform the navigation - ensure it stays visible at all times
        mainNav.style.position = 'fixed';
        mainNav.style.top = '0';
        mainNav.style.transform = 'none';
        mainNav.style.visibility = 'visible';
        mainNav.style.opacity = '1';
        mainNav.style.display = 'block';
        
        // Add scrolled class when scrolling down
        if (scrollTop > 50) {
            mainNav.classList.add('nav-scrolled');
            
            // Change logo size when scrolled
            if (logoImg.classList.contains(initialLogoSize)) {
                logoImg.classList.remove(initialLogoSize);
                logoImg.classList.add(scrolledLogoSize);
                logoImg.classList.add('transition-all', 'duration-300');
            }
        } else {
            mainNav.classList.remove('nav-scrolled');
            
            // Restore logo size when at top
            if (logoImg.classList.contains(scrolledLogoSize)) {
                logoImg.classList.remove(scrolledLogoSize);
                logoImg.classList.add(initialLogoSize);
            }
        }
    });
    
    // Force check on page load to ensure navigation is visible
    window.dispatchEvent(new Event('scroll'));
    
    // FAQ section has been removed
    
    // Smooth scrolling for navigation links (only for anchor links, not external pages)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    if (menuBtn) {
                        menuBtn.querySelector('i').classList.remove('fa-times');
                        menuBtn.querySelector('i').classList.add('fa-bars');
                    }
                }
                
                // Close industries dropdown if open
                if (industriesDropdownContent && industriesDropdownContent.style.display === 'block') {
                    industriesDropdownContent.style.display = 'none';
                    industriesDropdownContent.classList.remove('dropdown-active');
                    isDropdownOpen = false;
                    
                    // Reset chevron rotation
                    if (industriesDropdown) {
                        const chevron = industriesDropdown.querySelector('i');
                        if (chevron) {
                            chevron.classList.remove('rotate-180');
                        }
                    }
                }
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhanced form validation and submission with real-time validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Form elements
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const messageInput = document.getElementById('project-details');
        const submitButton = document.getElementById('submit-button');
        const loadingSpinner = submitButton?.querySelector('.loading-spinner');
        const formSuccess = document.getElementById('formSuccess');
        
        // File upload elements
        const fileInput = document.getElementById('file-upload');
        const fileNameDisplay = document.getElementById('file-name-display');
        
        // Form navigation buttons
        const nextButton = document.getElementById('next-button');
        const prevButton = document.getElementById('prev-button');
        
        // Form step management
        let currentStep = 1;
        
        // Helper functions for form navigation
        function saveFormData() {
            // Save form data to localStorage or handle as needed
            console.log('Form data saved');
        }
        
        function showStep(step) {
            // Handle step navigation
            currentStep = step;
            console.log('Showing step:', step);
        }
        
        // Industry selection
        const serviceRadios = document.querySelectorAll('input[name="service"]');
        const industrySelection = document.getElementById('industry-selection');
        const industrySelect = document.getElementById('industry');
        const existingSystemsQuestion = document.getElementById('existing-systems-question');
        
        // Show/hide industry selection based on service choice
        function checkIndustryVisibility() {
            const isIndustrySpecific = document.getElementById('service-industry') &&
                                      document.getElementById('service-industry').checked;
            
            if (isIndustrySpecific && industrySelection) {
                industrySelection.classList.remove('hidden');
                if (industrySelect) {
                    industrySelect.setAttribute('required', 'required');
                }
            } else if (industrySelection) {
                industrySelection.classList.add('hidden');
                if (industrySelect) {
                    industrySelect.removeAttribute('required');
                }
            }
            
            // Always show existing systems question
            if (existingSystemsQuestion) {
                existingSystemsQuestion.classList.remove('hidden');
            }
        }
        
        // Real-time validation for inputs
        const inputs = [fullNameInput, emailInput, phoneInput, messageInput];
        
        inputs.forEach(input => {
            if (!input) return;
            
            // Validate on blur (when user leaves the field)
            input.addEventListener('blur', function() {
                validateInput(input);
            });
            
            // Clear error on input
            input.addEventListener('input', function() {
                const validationMessage = input.parentElement.querySelector('.validation-message');
                if (validationMessage) {
                    validationMessage.classList.add('hidden');
                    input.classList.remove('border-red-500');
                }
            });
        });
        
        // File upload handling
        if (fileInput && fileNameDisplay) {
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const file = this.files[0];
                    
                    // Check file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        fileNameDisplay.textContent = 'File is too large. Maximum size is 5MB.';
                        fileNameDisplay.classList.add('text-red-500');
                        fileInput.value = ''; // Clear the input
                        return;
                    }
                    
                    // Display file name
                    fileNameDisplay.textContent = `Selected file: ${file.name}`;
                    fileNameDisplay.classList.remove('text-red-500');
                }
            });
        }
        
        // Event listeners for form navigation
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                // Validate current step
                const currentStepElement = document.querySelector(`.form-step:nth-of-type(${currentStep})`);
                let isValid = true;
                
                if (currentStepElement) {
                    const requiredFields = currentStepElement.querySelectorAll('[required]');
                    requiredFields.forEach(field => {
                        const fieldValid = validateInput(field);
                        if (!fieldValid) isValid = false;
                    });
                }
                
                if (isValid) {
                    saveFormData();
                    showStep(currentStep + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                saveFormData();
                showStep(currentStep - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        // Listen for changes on service radio buttons
        serviceRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                checkIndustryVisibility();
                saveFormData();
            });
        });
        
        // Set up autosave on input change
        contactForm.addEventListener('input', function(e) {
            // Debounce the save operation
            clearTimeout(window.autosaveTimer);
            window.autosaveTimer = setTimeout(saveFormData, 1000);
        });
        
        // Form submission with AJAX
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Validate all required inputs
            let isValid = true;
            
            // Reset previous error states
            const allInputs = contactForm.querySelectorAll('input, textarea, select');
            allInputs.forEach(input => {
                if (input.required) {
                    const isInputValid = validateInput(input);
                    if (!isInputValid) isValid = false;
                }
            });
            
            if (!isValid) {
                return; // Stop if validation fails
            }
            
            // Check reCAPTCHA if it's present
            if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse) {
                const recaptchaResponse = grecaptcha.getResponse();
                if (!recaptchaResponse) {
                    alert('Please complete the reCAPTCHA verification.');
                    return;
                }
            }
            
            // Show loading spinner
            if (loadingSpinner) {
                loadingSpinner.classList.remove('hidden');
            }
            if (submitButton) {
                submitButton.disabled = true;
            }
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Add analytics tracking info
            formData.append('source', 'website_contact_form');
            formData.append('utm_source', new URLSearchParams(window.location.search).get('utm_source') || 'direct');
            
            // Submit form data using fetch API
            fetch('https://formspree.io/f/mpwdodpp', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .then(data => {
                // Clear saved form data on successful submission
                localStorage.removeItem('contactFormData');
                localStorage.removeItem('contactFormStep');
                
                // Reset form data first
                contactForm.reset();
                if (fileNameDisplay) fileNameDisplay.textContent = '';
                
                // Clear all form inputs manually to ensure complete cleanup
                const allInputs = contactForm.querySelectorAll('input, textarea, select');
                allInputs.forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                    // Remove any validation styling
                    input.classList.remove('border-red-500');
                });
                
                // Clear validation messages
                const validationMessages = contactForm.querySelectorAll('.validation-message');
                validationMessages.forEach(msg => msg.classList.add('hidden'));
                
                // Hide form and show custom success message
                contactForm.style.display = 'none';
                
                // Create or update success message
                let successMessage = document.getElementById('custom-success-message');
                if (!successMessage) {
                    successMessage = document.createElement('div');
                    successMessage.id = 'custom-success-message';
                    successMessage.className = 'max-w-2xl mx-auto text-center py-12';
                    contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
                }
                
                successMessage.innerHTML = `
                    <div class="bg-green-50 border border-green-200 rounded-lg p-8 shadow-lg">
                        <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                            <i class="fas fa-check text-green-600 text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-green-800 mb-4">Thank You!</h3>
                        <p class="text-lg text-green-700 mb-6">Your inquiry has been sent successfully. We will be in touch as soon as possible.</p>
                        <button onclick="location.reload()" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-300">
                            Return to Home Page
                        </button>
                    </div>
                `;
                successMessage.style.display = 'block';
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                console.log('Form submitted successfully');
                
                // Send analytics event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submission', {
                        'event_category': 'Contact',
                        'event_label': 'Contact Form'
                    });
                }
                
                // Auto-redirect to home page after 5 seconds
                setTimeout(() => {
                    window.location.href = '#hero';
                    location.reload();
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was a problem submitting your form. Please try again later.');
            })
            .finally(() => {
                // Hide loading spinner
                if (loadingSpinner) {
                    loadingSpinner.classList.add('hidden');
                }
                if (submitButton) {
                    submitButton.disabled = false;
                }
            });
        });
    }
    
    // Function to validate a single input
    function validateInput(input) {
        if (!input) return true;
        
        const validationMessage = input.parentElement.querySelector('.validation-message');
        if (!validationMessage) return true;
        
        let isValid = true;
        let message = '';
        
        // Check if required field is empty
        if (input.required && !input.value.trim()) {
            isValid = false;
            message = `This field is required`;
        }
        // Email validation
        else if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
        // Phone validation (simple check)
        else if (input.id === 'phone' && input.value.trim() && !/^[0-9+\-\s()]{7,20}$/.test(input.value)) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }
        
        // Show validation message if invalid
        if (!isValid) {
            showError(input, message);
        } else {
            input.classList.remove('border-red-500');
            if (validationMessage) {
                validationMessage.classList.add('hidden');
            }
        }
        
        return isValid;
    }
    
    function showError(input, message) {
        input.classList.add('border-red-500');
        const validationMessage = input.parentElement.querySelector('.validation-message');
        if (validationMessage) {
            validationMessage.textContent = message;
            validationMessage.classList.remove('hidden');
        }
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Initialize scroll animations
    setupScrollAnimations();
    
    // Initialize theme switcher
    setupThemeSwitcher();
    
    // Initialize scroll to top button
    setupScrollToTop();
});

function showError(input, message) {
    input.classList.add('border-red-500');
    const validationMessage = input.parentElement.querySelector('.validation-message');
    if (validationMessage) {
        validationMessage.textContent = message;
        validationMessage.classList.remove('hidden');
    }
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add animation for footer
    const footerContainer = document.querySelector('footer .container');
    if (footerContainer) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1
        });
        
        footerObserver.observe(footerContainer);
    }
}

function setupThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or use default
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    const setTheme = function(isDark) {
        if (isDark) {
            htmlElement.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            htmlElement.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
        
        // Sync toggle state
        if (themeToggle) themeToggle.checked = isDark;
        if (mobileThemeToggle) mobileThemeToggle.checked = isDark;
    }
    
    // Initialize theme based on preference
    setTheme(isDarkMode);
    
    // Set up toggle event listeners
    if (themeToggle) {
        themeToggle.addEventListener('change', () => setTheme(themeToggle.checked));
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('change', () => setTheme(mobileThemeToggle.checked));
    }
}

function setupScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollTop');
    
    if (!scrollToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Blog functionality
function setupBlog() {
    // Only initialize blog functions if we're on a blog page
    const blogPostsContainer = document.getElementById('blog-posts');
    const blogPagination = document.getElementById('blog-pagination');
    
    if (!blogPostsContainer) return;
    
    // Fetch blog posts from Contentful
    async function fetchBlogPosts(page = 1) {
        try {
            const spaceId = '05xlhdzrkv93';
            const accessToken = 'YmzWsiU6I-8dCtI63Ipk9P1lTxGx1baY7tr4DkkoIOc';
            const limit = 6;
            const skip = (page - 1) * limit;
            
            // Fetch blog posts
            const postsUrl = `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?access_token=${accessToken}&content_type=blogPost&order=-sys.createdAt&limit=${limit}&skip=${skip}`;
            const postsResponse = await fetch(postsUrl);
            const postsData = await postsResponse.json();
            
            // Fetch assets (images) 
            const assetsUrl = `https://cdn.contentful.com/spaces/${spaceId}/environments/master/assets?access_token=${accessToken}`;
            const assetsResponse = await fetch(assetsUrl);
            const assetsData = await assetsResponse.json();
            
            return {
                posts: postsData.items,
                assets: assetsData.items,
                total: postsData.total
            };
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            return { posts: [], assets: [], total: 0 };
        }
    }
    
    // Render blog posts
    function renderBlogPosts(posts, assets) {
        if (!posts || posts.length === 0) {
            blogPostsContainer.innerHTML = '<p class="text-center text-gray-600">No blog posts found. Check back soon!</p>';
            return;
        }
        
        const postsHTML = posts.map(post => {
            const fields = post.fields;
            const title = fields.title || 'Untitled Post';
            const slug = fields.slug || '';
            const excerpt = fields.excerpt || '';
            const date = new Date(post.sys.createdAt);
            
            // Find featured image if available
            let imageUrl = 'https://via.placeholder.com/800x450/0d8b9c/ffffff?text=AIniseFlow';
            let imageAlt = 'Blog post image';
            
            if (fields.featuredImage && fields.featuredImage.sys) {
                const imageId = fields.featuredImage.sys.id;
                const imageAsset = assets.find(asset => asset.sys.id === imageId);
                
                if (imageAsset && imageAsset.fields) {
                    imageUrl = imageAsset.fields.file.url.startsWith('//') 
                        ? `https:${imageAsset.fields.file.url}` 
                        : imageAsset.fields.file.url;
                    imageAlt = imageAsset.fields.title || imageAlt;
                }
            }
            
            // Format date
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <a href="blog-post.html?slug=${slug}" class="block">
                        <div class="h-48 overflow-hidden">
                            <img src="${imageUrl}" alt="${imageAlt}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
                        </div>
                        <div class="p-6">
                            <p class="text-sm text-gray-500 mb-2">${formattedDate}</p>
                            <h3 class="text-xl font-bold text-secondary mb-2">${title}</h3>
                            <p class="text-gray-600 mb-4">${excerpt}</p>
                            <span class="text-primary font-semibold hover:underline">Read More →</span>
                        </div>
                    </a>
                </div>
            `;
        }).join('');
        
        blogPostsContainer.innerHTML = postsHTML;
    }
    
    // Initialize blog
    fetchBlogPosts().then(data => {
        renderBlogPosts(data.posts, data.assets);
    });
}

// Initialize blog if on blog page
if (document.getElementById('blog-posts')) {
    setupBlog();
}
// =====================================
// MOBILE OPTIMIZATION ENHANCEMENTS
// =====================================

// Mobile-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Add mobile class to body for CSS targeting
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-device');
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuBtn = document.getElementById('menu-btn');
        
        if (mobileMenu && menuBtn && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });
    
    // Close mobile menu when clicking on nav links
    const mobileNavLinks = document.querySelectorAll('#mobile-menu a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            const mobileMenu = document.getElementById('mobile-menu');
            const menuBtn = document.getElementById('menu-btn');
            
            if (mobileMenu && menuBtn) {
                mobileMenu.classList.add('hidden');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Force viewport refresh
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
            }
            
            // Close mobile menu on orientation change
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const menuBtn = document.getElementById('menu-btn');
                if (menuBtn) {
                    const icon = menuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        }, 100);
    });
    
    // Improve touch scrolling for mobile
    if ('ontouchstart' in window) {
        document.body.style.webkitOverflowScrolling = 'touch';
    }
    
    // Add touch feedback for buttons
    const touchElements = document.querySelectorAll('button, .btn, a');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        });
    });
    
    // Prevent zoom on input focus for iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                if (parseFloat(input.style.fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            });
        });
    }
    
    // Smooth scrolling for anchor links on mobile
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add swipe gesture for mobile menu (optional enhancement)
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        const minSwipeDistance = 100;
        
        // Swipe right to open menu (from left edge)
        if (swipeDistance > minSwipeDistance && touchStartX < 50) {
            const mobileMenu = document.getElementById('mobile-menu');
            const menuBtn = document.getElementById('menu-btn');
            
            if (mobileMenu && mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                if (menuBtn) {
                    const icon = menuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    }
                }
            }
        }
        
        // Swipe left to close menu
        if (swipeDistance < -minSwipeDistance) {
            const mobileMenu = document.getElementById('mobile-menu');
            const menuBtn = document.getElementById('menu-btn');
            
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                if (menuBtn) {
                    const icon = menuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        }
    }
});

// Resize handler to update mobile class
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.remove('mobile-device');
        // Close mobile menu on desktop resize
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const menuBtn = document.getElementById('menu-btn');
            if (menuBtn) {
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    }
    
    // Enhanced Mobile Menu Visibility Fix
    // Function to ensure mobile menu button AND navigation bar remain visible during scroll
    function ensureMobileMenuVisible() {
        const menuBtn = document.getElementById('menu-btn');
        const mainNav = document.getElementById('main-nav');
        
        // Always ensure navigation bar is visible
        if (mainNav) {
            mainNav.style.position = 'fixed';
            mainNav.style.top = '0';
            mainNav.style.left = '0';
            mainNav.style.right = '0';
            mainNav.style.zIndex = '1000';
            mainNav.style.width = '100%';
            mainNav.style.transform = 'none';
            mainNav.style.visibility = 'visible';
            mainNav.style.opacity = '1';
            mainNav.style.display = 'block';
        }
        
        if (menuBtn && window.innerWidth <= 767) {
            // Force mobile menu button to be visible with important styles
            menuBtn.style.display = 'flex';
            menuBtn.style.visibility = 'visible';
            menuBtn.style.opacity = '1';
            menuBtn.style.zIndex = '1001';
            menuBtn.style.position = 'relative';
            menuBtn.style.pointerEvents = 'auto';
        }
    }
    
    // Call the function on scroll events to ensure menu button stays visible
    const originalScrollHandler = window.onscroll;
    window.addEventListener('scroll', function() {
        ensureMobileMenuVisible();
        if (originalScrollHandler) originalScrollHandler();
    });
    
    // Ensure mobile menu button is visible on page load, resize, and orientation change
    ensureMobileMenuVisible();
    window.addEventListener('resize', ensureMobileMenuVisible);
    window.addEventListener('orientationchange', function() {
        setTimeout(ensureMobileMenuVisible, 100); // Small delay for orientation change
    });
    
    // Override any CSS that might hide the menu button on mobile
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 767px) {
            #menu-btn {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                z-index: 1001 !important;
                position: relative !important;
                pointer-events: auto !important;
            }
        }
    `;
    document.head.appendChild(style);
});

/* ============================================ */
/* MOBILE DROPDOWN FORCE-VISIBLE FIX */
/* ============================================ */

// Ensure mobile industries dropdown is always visible when mobile menu is open
document.addEventListener('DOMContentLoaded', function() {
    function forceMobileDropdownVisible() {
        if (window.innerWidth <= 767) {
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileDropdown = mobileMenu ? mobileMenu.querySelector('.dropdown-menu') : null;
            
            if (mobileDropdown) {
                // Force mobile dropdown to always be visible
                mobileDropdown.style.display = 'block';
                mobileDropdown.style.opacity = '1';
                mobileDropdown.style.visibility = 'visible';
                mobileDropdown.style.transform = 'none';
                mobileDropdown.style.position = 'static';
                mobileDropdown.style.maxHeight = 'none';
                mobileDropdown.style.overflow = 'visible';
                mobileDropdown.classList.add('show');
            }
        }
    }
    
    // Apply the fix on page load
    forceMobileDropdownVisible();
    
    // Apply the fix when mobile menu becomes visible
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('visible')) {
                    setTimeout(forceMobileDropdownVisible, 100);
                }
            }
        });
    });
    
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        observer.observe(mobileMenu, { attributes: true });
    }
    
    // Apply on window resize
    window.addEventListener('resize', function() {
        setTimeout(forceMobileDropdownVisible, 100);
    });
    
    // Force mobile dropdown to be visible whenever mobile menu is toggled
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            setTimeout(forceMobileDropdownVisible, 150);
        });
    }
});
