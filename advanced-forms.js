// Advanced Form Handling for AIniseFlow Contact Forms
// Enhanced validation, UX improvements, and lead generation optimization

(function() {
    'use strict';

    // Form validation and enhancement
    class ContactFormEnhancer {
        constructor(formSelector = '#contact form') {
            this.form = document.querySelector(formSelector);
            this.init();
        }

        init() {
            if (!this.form) return;

            this.setupValidation();
            this.setupProgressIndicator();
            this.setupFormSubmissionTracking();
            this.setupFieldEnhancements();
            this.setupAutoSave();
        }

        // Real-time validation
        setupValidation() {
            const fields = this.form.querySelectorAll('input, select, textarea');
            
            fields.forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearErrors(field));
            });

            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            let isValid = true;
            let errorMessage = '';

            // Clear previous errors
            this.clearErrors(field);

            // Required field validation
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required.';
            }

            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
            }

            // Business email validation (avoid personal emails for better leads)
            if (field.type === 'email' && value) {
                const personalEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
                const domain = value.split('@')[1];
                if (personalEmailDomains.includes(domain?.toLowerCase())) {
                    this.showWarning(field, 'Consider using your business email for better service.');
                }
            }

            // Phone number validation (if present)
            if (field.name === 'phone' && value) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number.';
                }
            }

            if (!isValid) {
                this.showError(field, errorMessage);
            }

            return isValid;
        }

        showError(field, message) {
            field.classList.add('border-red-500', 'bg-red-50');
            
            // Remove existing error message
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) existingError.remove();

            // Add new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-red-600 text-sm mt-1';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i>${message}`;
            field.parentNode.appendChild(errorDiv);
        }

        showWarning(field, message) {
            const warningDiv = document.createElement('div');
            warningDiv.className = 'warning-message text-yellow-600 text-sm mt-1';
            warningDiv.innerHTML = `<i class="fas fa-info-circle mr-1"></i>${message}`;
            field.parentNode.appendChild(warningDiv);
        }

        clearErrors(field) {
            field.classList.remove('border-red-500', 'bg-red-50');
            const errorMessage = field.parentNode.querySelector('.error-message, .warning-message');
            if (errorMessage) errorMessage.remove();
        }

        // Form progress indicator
        setupProgressIndicator() {
            const progressBar = document.createElement('div');
            progressBar.className = 'form-progress-container mb-6';
            progressBar.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-700">Form Progress</span>
                    <span class="text-sm text-gray-500"><span id="progress-percentage">0</span>% Complete</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="progress-bar" class="bg-gradient-to-r from-[#0d8b9c] to-[#2A7F83] h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                </div>
            `;

            const firstFieldContainer = this.form.querySelector('.grid');
            firstFieldContainer.parentNode.insertBefore(progressBar, firstFieldContainer);

            // Update progress on field changes
            const fields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
            fields.forEach(field => {
                field.addEventListener('input', () => this.updateProgress());
                field.addEventListener('change', () => this.updateProgress());
            });
        }

        updateProgress() {
            const requiredFields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
            const filledFields = Array.from(requiredFields).filter(field => field.value.trim() !== '');
            
            const progress = (filledFields.length / requiredFields.length) * 100;
            
            const progressBar = document.getElementById('progress-bar');
            const progressPercentage = document.getElementById('progress-percentage');
            
            if (progressBar && progressPercentage) {
                progressBar.style.width = `${progress}%`;
                progressPercentage.textContent = Math.round(progress);
            }
        }

        // Enhanced form submission with tracking
        async handleSubmit(e) {
            e.preventDefault();

            // Validate all fields
            const fields = this.form.querySelectorAll('input, select, textarea');
            let isFormValid = true;

            fields.forEach(field => {
                if (field.hasAttribute('required') || field.value.trim()) {
                    if (!this.validateField(field)) {
                        isFormValid = false;
                    }
                }
            });

            if (!isFormValid) {
                this.showFormError('Please fix the errors above before submitting.');
                return;
            }

            // Show loading state
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            submitBtn.disabled = true;

            try {
                // Track form submission
                this.trackFormSubmission();

                // Submit to Formspree
                const formData = new FormData(this.form);
                const response = await fetch(this.form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    this.showSuccessMessage();
                    this.form.reset();
                    this.updateProgress();
                    
                    // Track successful submission
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit_success', {
                            'event_category': 'lead_generation',
                            'event_label': 'contact_form',
                            'value': 1
                        });
                    }
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                this.showFormError('There was an error submitting your form. Please try again or contact us directly.');
                
                // Track submission error
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit_error', {
                        'event_category': 'lead_generation',
                        'event_label': 'contact_form_error'
                    });
                }
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }

        showSuccessMessage() {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6';
            successDiv.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-check-circle mr-2"></i>
                    <div>
                        <strong>Thank you!</strong> Your message has been sent successfully. 
                        We'll get back to you within 24 hours with your free AI consultation details.
                    </div>
                </div>
            `;
            
            this.form.parentNode.insertBefore(successDiv, this.form);
            
            // Auto-remove success message after 10 seconds
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 10000);
        }

        showFormError(message) {
            // Remove existing error message
            const existingError = this.form.querySelector('.form-error-message');
            if (existingError) existingError.remove();

            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6';
            errorDiv.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    ${message}
                </div>
            `;
            
            this.form.insertBefore(errorDiv, this.form.firstChild);
        }

        // Enhanced field interactions
        setupFieldEnhancements() {
            // Add floating labels effect
            const inputs = this.form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.parentNode.querySelector('label').classList.add('text-[#2A7F83]', 'font-semibold');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentNode.querySelector('label').classList.remove('text-[#2A7F83]', 'font-semibold');
                    }
                });
            });

            // Industry-specific suggestions
            const industrySelect = this.form.querySelector('#industry');
            if (industrySelect) {
                industrySelect.addEventListener('change', (e) => {
                    this.showIndustrySpecificSuggestions(e.target.value);
                });
            }
        }

        showIndustrySpecificSuggestions(industry) {
            const suggestionMap = {
                'restaurant': 'Great choice! We help restaurants automate reservations, orders, and customer service.',
                'healthcare': 'Perfect! Our AI solutions help healthcare providers streamline patient management and communications.',
                'professional': 'Excellent! We specialize in automating professional service workflows and client interactions.',
                'retail': 'Fantastic! Our retail AI solutions optimize inventory, customer service, and sales processes.'
            };

            const suggestion = suggestionMap[industry];
            if (suggestion) {
                // Remove existing suggestion
                const existingSuggestion = this.form.querySelector('.industry-suggestion');
                if (existingSuggestion) existingSuggestion.remove();

                // Add new suggestion
                const suggestionDiv = document.createElement('div');
                suggestionDiv.className = 'industry-suggestion bg-blue-50 border-l-4 border-blue-400 p-4 mb-6';
                suggestionDiv.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-lightbulb text-blue-400 mr-2"></i>
                        <p class="text-blue-700">${suggestion}</p>
                    </div>
                `;
                
                const industryField = this.form.querySelector('#industry').parentNode.parentNode;
                industryField.parentNode.insertBefore(suggestionDiv, industryField.nextSibling);
            }
        }

        // Auto-save form data to localStorage
        setupAutoSave() {
            const fields = this.form.querySelectorAll('input, select, textarea');
            
            // Load saved data
            fields.forEach(field => {
                const savedValue = localStorage.getItem(`ainiseflow_form_${field.name}`);
                if (savedValue && !field.value) {
                    field.value = savedValue;
                }
            });

            // Save data on changes
            fields.forEach(field => {
                field.addEventListener('input', () => {
                    localStorage.setItem(`ainiseflow_form_${field.name}`, field.value);
                });
            });

            // Clear saved data on successful submission
            this.form.addEventListener('submit', () => {
                setTimeout(() => {
                    fields.forEach(field => {
                        localStorage.removeItem(`ainiseflow_form_${field.name}`);
                    });
                }, 2000);
            });
        }

        // Track form interactions for analytics
        trackFormSubmission() {
            const formData = new FormData(this.form);
            const industry = formData.get('industry');
            const aiSolutions = formData.getAll('ai-solutions[]');

            // Track with Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'generate_lead', {
                    'event_category': 'lead_generation',
                    'event_label': industry || 'unknown_industry',
                    'custom_parameter_1': industry,
                    'custom_parameter_2': aiSolutions.join(','),
                    'value': 1
                });
            }

            // Track form completion time
            const formStartTime = sessionStorage.getItem('form_start_time');
            if (formStartTime) {
                const completionTime = Date.now() - parseInt(formStartTime);
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_completion_time', {
                        'event_category': 'user_engagement',
                        'event_label': 'contact_form',
                        'value': Math.round(completionTime / 1000) // in seconds
                    });
                }
            }
        }
    }

    // Initialize form enhancements when DOM is ready
    function initContactForms() {
        // Track when user starts interacting with form
        const contactForm = document.querySelector('#contact form');
        if (contactForm) {
            const firstInput = contactForm.querySelector('input');
            if (firstInput) {
                firstInput.addEventListener('focus', () => {
                    if (!sessionStorage.getItem('form_start_time')) {
                        sessionStorage.setItem('form_start_time', Date.now().toString());
                    }
                }, { once: true });
            }
        }

        // Initialize form enhancer
        new ContactFormEnhancer();

        // Track form section visibility
        if ('IntersectionObserver' in window) {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Track contact section view
                            if (typeof gtag !== 'undefined') {
                                gtag('event', 'view_contact_section', {
                                    'event_category': 'user_engagement',
                                    'event_label': 'contact_form_visibility'
                                });
                            }
                            observer.unobserve(contactSection);
                        }
                    });
                }, { threshold: 0.5 });

                observer.observe(contactSection);
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactForms);
    } else {
        initContactForms();
    }

})();