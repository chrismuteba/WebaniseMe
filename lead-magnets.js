// Lead Magnets and Conversion Optimization for AIniseFlow
// Multiple lead capture opportunities and conversion optimization

(function() {
    'use strict';

    // Exit Intent Lead Capture
    class ExitIntentCapture {
        constructor() {
            this.hasShown = false;
            this.init();
        }

        init() {
            document.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
            
            // Mobile scroll-based exit intent
            let scrollTimer = null;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                    if (window.scrollY > document.body.scrollHeight * 0.7) {
                        this.showExitIntentPopup();
                    }
                }, 150);
            });
        }

        handleMouseLeave(e) {
            if (e.clientY <= 0 && !this.hasShown) {
                this.showExitIntentPopup();
            }
        }

        showExitIntentPopup() {
            if (this.hasShown || localStorage.getItem('ainiseflow_exit_popup_shown')) {
                return;
            }

            this.hasShown = true;
            localStorage.setItem('ainiseflow_exit_popup_shown', Date.now().toString());

            const popup = this.createPopup();
            document.body.appendChild(popup);

            // Track popup display
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exit_intent_popup_shown', {
                    'event_category': 'lead_generation',
                    'event_label': 'exit_intent'
                });
            }

            // Auto-close after 30 seconds
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 30000);
        }

        createPopup() {
            const popup = document.createElement('div');
            popup.className = 'exit-intent-popup fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
            popup.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-bounce">
                    <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl" onclick="this.closest('.exit-intent-popup').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="text-center">
                        <div class="w-16 h-16 bg-gradient-to-r from-[#0d8b9c] to-[#2A7F83] rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-robot text-white text-2xl"></i>
                        </div>
                        
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">Wait! Don't Miss Out!</h3>
                        <p class="text-gray-600 mb-4">Get our free "AI Automation Readiness Checklist" - discover which AI solutions are perfect for your business!</p>
                        
                        <form class="space-y-3" onsubmit="return handlePopupFormSubmit(event)">
                            <input type="email" name="popup_email" placeholder="Enter your email address" required 
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A7F83] focus:border-transparent">
                            
                            <button type="submit" class="w-full bg-gradient-to-r from-[#0d8b9c] to-[#2A7F83] text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition duration-300">
                                <i class="fas fa-download mr-2"></i>Get Free Checklist
                            </button>
                        </form>
                        
                        <p class="text-xs text-gray-500 mt-3">
                            <i class="fas fa-lock mr-1"></i>We respect your privacy. Unsubscribe at any time.
                        </p>
                    </div>
                </div>
            `;

            // Add event listeners
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    popup.remove();
                }
            });

            return popup;
        }
    }

    // Scroll-based CTA Bar
    class StickyContactBar {
        constructor() {
            this.bar = null;
            this.isVisible = false;
            this.init();
        }

        init() {
            this.createStickyBar();
            window.addEventListener('scroll', () => this.handleScroll());
        }

        createStickyBar() {
            this.bar = document.createElement('div');
            this.bar.className = 'sticky-contact-bar fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#0d8b9c] to-[#2A7F83] text-white p-3 transform translate-y-full transition-transform duration-300 z-40 shadow-lg';
            this.bar.innerHTML = `
                <div class="container mx-auto flex items-center justify-between px-4">
                    <div class="flex items-center">
                        <i class="fas fa-rocket mr-2"></i>
                        <span class="font-semibold hidden sm:inline">Ready to automate your business?</span>
                        <span class="font-semibold sm:hidden">Start your AI journey!</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <a href="#contact" class="bg-white text-[#2A7F83] px-4 py-2 rounded-lg font-bold hover:shadow-md transition duration-300 text-sm sm:text-base" onclick="trackStickyBarClick('contact')">
                            <i class="fas fa-comments mr-1"></i>Get Free Consultation
                        </a>
                        <button onclick="this.closest('.sticky-contact-bar').style.display='none'" class="text-white hover:text-gray-200 ml-2">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(this.bar);
        }

        handleScroll() {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > 25 && !this.isVisible) {
                this.showBar();
            } else if (scrollPercent <= 25 && this.isVisible) {
                this.hideBar();
            }
        }

        showBar() {
            this.isVisible = true;
            this.bar.classList.remove('translate-y-full');
            
            // Track sticky bar display
            if (typeof gtag !== 'undefined') {
                gtag('event', 'sticky_bar_shown', {
                    'event_category': 'lead_generation',
                    'event_label': 'sticky_contact_bar'
                });
            }
        }

        hideBar() {
            this.isVisible = false;
            this.bar.classList.add('translate-y-full');
        }
    }

    // Smart Content Recommendations
    class ContentRecommendations {
        constructor() {
            this.init();
        }

        init() {
            this.addIndustrySpecificCTAs();
            this.addScrollProgressRecommendations();
        }

        addIndustrySpecificCTAs() {
            // Detect user's likely industry based on page interactions
            const serviceLinks = document.querySelectorAll('a[href*="ai-"]');
            
            serviceLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const industry = this.extractIndustryFromLink(e.target.href);
                    if (industry) {
                        setTimeout(() => {
                            this.showIndustrySpecificCTA(industry);
                        }, 3000);
                    }
                });
            });
        }

        extractIndustryFromLink(href) {
            if (href.includes('restaurant')) return 'restaurant';
            if (href.includes('healthcare')) return 'healthcare';
            if (href.includes('professional')) return 'professional';
            if (href.includes('retail')) return 'retail';
            return null;
        }

        showIndustrySpecificCTA(industry) {
            if (document.querySelector('.industry-specific-cta')) return; // Don't show if already visible

            const industryData = {
                'restaurant': {
                    title: 'Transform Your Restaurant Operations',
                    description: 'See how AI can automate reservations, orders, and customer service for restaurants like yours.',
                    cta: 'Get Restaurant AI Demo'
                },
                'healthcare': {
                    title: 'Streamline Your Healthcare Practice',
                    description: 'Discover AI solutions that reduce admin work and improve patient communication.',
                    cta: 'Get Healthcare AI Demo'
                },
                'professional': {
                    title: 'Automate Your Professional Services',
                    description: 'Learn how AI can handle client communications and streamline your workflows.',
                    cta: 'Get Professional Services Demo'
                },
                'retail': {
                    title: 'Boost Your Retail Efficiency',
                    description: 'See how AI can optimize inventory, customer service, and sales processes.',
                    cta: 'Get Retail AI Demo'
                }
            };

            const data = industryData[industry];
            if (!data) return;

            const ctaElement = document.createElement('div');
            ctaElement.className = 'industry-specific-cta fixed top-20 right-4 bg-white border-l-4 border-[#2A7F83] shadow-xl rounded-lg p-4 max-w-sm z-30 transform translate-x-full transition-transform duration-500';
            ctaElement.innerHTML = `
                <button class="absolute top-1 right-1 text-gray-400 hover:text-gray-600" onclick="this.closest('.industry-specific-cta').remove()">
                    <i class="fas fa-times text-sm"></i>
                </button>
                
                <div class="pr-4">
                    <h4 class="font-bold text-gray-800 mb-1">${data.title}</h4>
                    <p class="text-sm text-gray-600 mb-3">${data.description}</p>
                    <a href="#contact" class="inline-block bg-[#2A7F83] text-white text-sm px-3 py-2 rounded hover:bg-[#236e72] transition duration-300" onclick="trackIndustrySpecificCTA('${industry}')">
                        ${data.cta} <i class="fas fa-arrow-right ml-1"></i>
                    </a>
                </div>
            `;

            document.body.appendChild(ctaElement);

            // Show the CTA
            setTimeout(() => {
                ctaElement.classList.remove('translate-x-full');
            }, 100);

            // Auto-hide after 15 seconds
            setTimeout(() => {
                if (ctaElement.parentNode) {
                    ctaElement.classList.add('translate-x-full');
                    setTimeout(() => {
                        ctaElement.remove();
                    }, 500);
                }
            }, 15000);

            // Track industry-specific CTA display
            if (typeof gtag !== 'undefined') {
                gtag('event', 'industry_cta_shown', {
                    'event_category': 'lead_generation',
                    'event_label': industry
                });
            }
        }

        addScrollProgressRecommendations() {
            let hasShownScrollCTA = false;
            
            window.addEventListener('scroll', () => {
                const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                
                if (scrollPercent > 60 && !hasShownScrollCTA) {
                    hasShownScrollCTA = true;
                    this.showScrollBasedRecommendation();
                }
            });
        }

        showScrollBasedRecommendation() {
            // Don't show if user already interacted with forms
            if (localStorage.getItem('ainiseflow_form_interaction')) {
                return;
            }

            const notification = document.createElement('div');
            notification.className = 'scroll-recommendation fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-lg z-30 max-w-sm';
            notification.innerHTML = `
                <div class="flex items-start">
                    <i class="fas fa-lightbulb text-yellow-500 mt-1 mr-2"></i>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-yellow-800">Interested in AI automation?</p>
                        <p class="text-xs text-yellow-700 mt-1">Get a free consultation to see which solutions fit your business best!</p>
                        <div class="mt-2">
                            <a href="#contact" class="text-xs bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition duration-300" onclick="trackScrollRecommendationClick()">
                                Get Free Consultation <i class="fas fa-arrow-down ml-1"></i>
                            </a>
                        </div>
                    </div>
                    <button onclick="this.closest('.scroll-recommendation').remove()" class="text-yellow-500 hover:text-yellow-700 ml-2">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            document.body.appendChild(notification);

            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 10000);
        }
    }

    // Global tracking functions (accessible from HTML onclick events)
    window.trackStickyBarClick = function(action) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sticky_bar_click', {
                'event_category': 'lead_generation',
                'event_label': action
            });
        }
    };

    window.trackIndustrySpecificCTA = function(industry) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'industry_cta_click', {
                'event_category': 'lead_generation',
                'event_label': industry
            });
        }
    };

    window.trackScrollRecommendationClick = function() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll_recommendation_click', {
                'event_category': 'lead_generation',
                'event_label': 'scroll_based'
            });
        }
    };

    window.handlePopupFormSubmit = function(event) {
        event.preventDefault();
        
        const email = event.target.popup_email.value;
        
        // Track popup form submission
        if (typeof gtag !== 'undefined') {
            gtag('event', 'popup_form_submit', {
                'event_category': 'lead_generation',
                'event_label': 'exit_intent_popup'
            });
        }

        // Here you would normally send to your email service
        // For now, we'll show a success message and redirect to main contact form
        const popup = event.target.closest('.exit-intent-popup');
        popup.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
                <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-check text-white text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
                <p class="text-gray-600 mb-4">Your checklist is being prepared. For personalized AI recommendations, complete our quick consultation form below!</p>
                <button onclick="document.querySelector('.exit-intent-popup').remove(); document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });" 
                        class="bg-[#2A7F83] text-white px-6 py-2 rounded-lg hover:bg-[#236e72] transition duration-300">
                    Get Personal Consultation <i class="fas fa-arrow-down ml-1"></i>
                </button>
            </div>
        `;

        // Auto-close and scroll to contact form after 3 seconds
        setTimeout(() => {
            popup.remove();
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        }, 3000);

        return false;
    };

    // Initialize all lead generation features
    function initLeadMagnets() {
        // Only show exit intent after user has been on site for 30+ seconds
        setTimeout(() => {
            new ExitIntentCapture();
        }, 30000);

        new StickyContactBar();
        new ContentRecommendations();

        // Track form interactions
        const formInputs = document.querySelectorAll('#contact input, #contact textarea, #contact select');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (!localStorage.getItem('ainiseflow_form_interaction')) {
                    localStorage.setItem('ainiseflow_form_interaction', 'true');
                }
            }, { once: true });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLeadMagnets);
    } else {
        initLeadMagnets();
    }

})();