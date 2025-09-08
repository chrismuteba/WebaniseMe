// Enhanced Performance Optimizations for AIniseFlow
// Ultra-fast loading for mobile and desktop

(function() {
    'use strict';

    // Core Web Vitals & Performance Optimization
    const PerformanceOptimizer = {
        // 1. Enhanced Lazy Loading with Intersection Observer
        initLazyLoading() {
            if ('IntersectionObserver' in window) {
                // Lazy load images
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                img.classList.add('fade-in');
                            }
                            observer.unobserve(img);
                        }
                    });
                }, { 
                    rootMargin: '50px',
                    threshold: 0.1 
                });

                // Observe all lazy images
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });

                // Lazy load CSS (non-critical)
                const cssObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadNonCriticalCSS();
                            observer.disconnect();
                        }
                    });
                }, { threshold: 0.1 });

                const firstSection = document.querySelector('.hero-section');
                if (firstSection) cssObserver.observe(firstSection);
            }
        },

        // 2. Load non-critical CSS asynchronously
        loadNonCriticalCSS() {
            const criticalCSSLoaded = sessionStorage.getItem('criticalCSSLoaded');
            if (criticalCSSLoaded) return;

            const cssFiles = [
                'https://cdn.tailwindcss.com',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
                'styles.min.css'
            ];

            cssFiles.forEach(href => {
                if (!document.querySelector(`link[href="${href}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = href;
                    link.media = 'print';
                    link.onload = function() {
                        this.media = 'all';
                        this.onload = null;
                    };
                    document.head.appendChild(link);
                }
            });

            sessionStorage.setItem('criticalCSSLoaded', 'true');
        },

        // 3. Optimize font loading
        optimizeFonts() {
            // Use font-display: swap for web fonts
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
            fontLink.media = 'print';
            fontLink.onload = function() {
                this.media = 'all';
            };
            document.head.appendChild(fontLink);
        },

        // 4. Mobile-specific optimizations
        mobileOptimizations() {
            if (window.innerWidth <= 768) {
                // Disable animations on mobile for better performance
                const style = document.createElement('style');
                style.textContent = `
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                `;
                document.head.appendChild(style);

                // Optimize scroll performance
                document.addEventListener('touchstart', function() {}, { passive: true });
                document.addEventListener('touchmove', function() {}, { passive: true });
            }
        },

        // 5. Preload critical resources intelligently
        preloadResources() {
            const resources = [
                { href: 'AIniseFlow-Logo.webp', as: 'image', type: 'image/webp' },
                { href: 'scripts-combined.js', as: 'script' }
            ];

            resources.forEach(resource => {
                if (!document.querySelector(`link[href="${resource.href}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.href = resource.href;
                    link.as = resource.as;
                    if (resource.type) link.type = resource.type;
                    document.head.appendChild(link);
                }
            });
        },

        // 6. Critical rendering path optimization
        optimizeRenderingPath() {
            // Defer non-critical JavaScript
            const scripts = document.querySelectorAll('script[src]:not([async]):not([defer])');
            scripts.forEach(script => {
                if (!script.src.includes('gtag') && !script.src.includes('critical')) {
                    script.defer = true;
                }
            });
        },

        // 7. Enhanced service worker for aggressive caching
        registerServiceWorker() {
            if ('serviceWorker' in navigator && 'caches' in window) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw-enhanced.js')
                        .then(registration => {
                            console.log('Enhanced SW registered');
                        })
                        .catch(error => {
                            console.log('SW registration failed');
                        });
                });
            }
        },

        // 8. Performance monitoring and reporting
        monitorPerformance() {
            if ('performance' in window) {
                window.addEventListener('load', () => {
                    // Use requestIdleCallback for performance monitoring
                    const monitor = () => {
                        try {
                            const navigation = performance.getEntriesByType('navigation')[0];
                            const paint = performance.getEntriesByType('paint');
                            
                            const metrics = {
                                loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
                                domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
                                firstPaint: paint[0] ? Math.round(paint[0].startTime) : 0,
                                firstContentfulPaint: paint[1] ? Math.round(paint[1].startTime) : 0,
                                networkType: navigator.connection ? navigator.connection.effectiveType : 'unknown'
                            };

                            // Send to analytics
                            if (typeof gtag !== 'undefined') {
                                gtag('event', 'performance_metrics', {
                                    event_category: 'performance',
                                    custom_map: metrics
                                });
                            }

                            console.log('Performance Metrics:', metrics);
                        } catch (e) {
                            console.warn('Performance monitoring error:', e);
                        }
                    };

                    if ('requestIdleCallback' in window) {
                        requestIdleCallback(monitor);
                    } else {
                        setTimeout(monitor, 0);
                    }
                });
            }
        },

        // 9. Initialize all optimizations
        init() {
            // Immediate optimizations
            this.preloadResources();
            this.optimizeRenderingPath();
            this.mobileOptimizations();

            // DOM ready optimizations
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.initLazyLoading();
                    this.optimizeFonts();
                });
            } else {
                this.initLazyLoading();
                this.optimizeFonts();
            }

            // Load optimizations
            this.registerServiceWorker();
            this.monitorPerformance();
        }
    };

    // Start optimizations immediately
    PerformanceOptimizer.init();

})();

// Additional performance utilities
window.performanceUtils = {
    // Debounce function for scroll and resize events
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for high-frequency events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};