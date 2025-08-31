// Performance Optimizations for AIniseFlow
// Implements Core Web Vitals improvements

(function() {
    'use strict';

    // 1. Largest Contentful Paint (LCP) Optimization
    function optimizeLCP() {
        // Preload critical resources
        const criticalResources = [
            '/AIniseFlow-Logo.png',
            'https://cdn.tailwindcss.com',
            '/styles.css'
        ];

        criticalResources.forEach(resource => {
            if (!document.querySelector(`link[href="${resource}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = resource;
                link.as = resource.endsWith('.css') ? 'style' : 
                          resource.endsWith('.js') ? 'script' : 'image';
                document.head.appendChild(link);
            }
        });
    }

    // 2. First Input Delay (FID) Optimization
    function optimizeFID() {
        // Defer non-critical JavaScript
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
                script.setAttribute('defer', '');
            }
        });

        // Optimize event listeners with passive listeners
        const addPassiveListener = (element, event, handler) => {
            element.addEventListener(event, handler, { passive: true });
        };

        // Add passive scroll listeners
        document.addEventListener('scroll', function() {
            requestAnimationFrame(() => {
                // Scroll-based animations can go here
            });
        }, { passive: true });
    }

    // 3. Cumulative Layout Shift (CLS) Optimization
    function optimizeCLS() {
        // Add proper dimensions to images without them
        const images = document.querySelectorAll('img:not([width]):not([height])');
        images.forEach(img => {
            // Set default dimensions to prevent layout shift
            if (!img.style.width && !img.style.height) {
                img.style.aspectRatio = '1';
                img.style.width = 'auto';
                img.style.height = 'auto';
            }
        });

        // Reserve space for dynamically loaded content
        const dynamicElements = document.querySelectorAll('.dynamic-content');
        dynamicElements.forEach(element => {
            if (!element.style.minHeight) {
                element.style.minHeight = '200px';
            }
        });
    }

    // 4. Intersection Observer for Lazy Loading
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            });

            // Observe all images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // 5. Resource Hints Optimization
    function addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
            { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
        ];

        hints.forEach(hint => {
            if (!document.querySelector(`link[href="${hint.href}"]`)) {
                const link = document.createElement('link');
                link.rel = hint.rel;
                link.href = hint.href;
                if (hint.crossorigin) link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            }
        });
    }

    // 6. Critical CSS Inlining for faster rendering
    function inlineCriticalCSS() {
        const criticalCSS = `
            /* Critical above-the-fold styles */
            body { margin: 0; padding-top: 80px; font-family: system-ui, -apple-system, sans-serif; }
            .hero-section { min-height: 100vh; background: linear-gradient(135deg, #0a3b5c 0%, #0d8b9c 100%); display: flex; align-items: center; }
            nav { position: fixed; top: 0; width: 100%; z-index: 50; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        `;

        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // 7. Performance Monitoring
    function monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const metrics = {
                        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
                        firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0
                    };

                    // Send to analytics if available
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'performance_metrics', {
                            event_category: 'performance',
                            load_time: Math.round(metrics.loadTime),
                            dom_content_loaded: Math.round(metrics.domContentLoaded),
                            first_paint: Math.round(metrics.firstPaint),
                            first_contentful_paint: Math.round(metrics.firstContentfulPaint)
                        });
                    }

                    console.log('Performance Metrics:', metrics);
                }, 0);
            });
        }
    }

    // 8. Service Worker for Caching (Progressive Web App features)
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    // Initialize all optimizations
    function initPerformanceOptimizations() {
        // Run immediately
        optimizeLCP();
        addResourceHints();
        inlineCriticalCSS();

        // Run when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                optimizeFID();
                optimizeCLS();
                setupLazyLoading();
                monitorPerformance();
            });
        } else {
            optimizeFID();
            optimizeCLS();
            setupLazyLoading();
            monitorPerformance();
        }

        // Register service worker
        registerServiceWorker();
    }

    // Start optimizations
    initPerformanceOptimizations();

})();