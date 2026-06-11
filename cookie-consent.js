/* ============================================================
   Cookie consent banner + Google Analytics 4 loader
   GA4 is only loaded after the visitor explicitly accepts
   analytics cookies (PECR / UK GDPR requirement).
   Include this script BEFORE any inline gtag() calls.
   ============================================================ */
(function () {
    var STORAGE_KEY = 'ainiseflow-cookie-consent'; /* 'granted' | 'denied' */
    var GA_ID = 'G-JKM102Q8H1';

    /* Stub so trackCTAClick()/trackFormSubmit() calls queue safely
       even before (or without) the GA library being loaded. */
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

    function getChoice() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function setChoice(choice) {
        try { localStorage.setItem(STORAGE_KEY, choice); } catch (e) { /* storage blocked — treat as session-only choice */ }
    }

    function loadAnalytics() {
        if (document.getElementById('ga4-script')) return;
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, { send_page_view: true });
        var s = document.createElement('script');
        s.id = 'ga4-script';
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
    }

    function privacyPolicyHref() {
        /* Pages live at the site root except the tools/ subfolder */
        return /\/tools\//.test(window.location.pathname) ? '../privacy-policy.html' : 'privacy-policy.html';
    }

    function removeBanner() {
        var b = document.getElementById('cookie-banner');
        if (b && b.parentNode) b.parentNode.removeChild(b);
    }

    function showBanner() {
        if (document.getElementById('cookie-banner')) return;
        var banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Cookie consent');
        banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#0a3b5c;color:#fff;padding:16px;box-shadow:0 -2px 12px rgba(0,0,0,.25);font-size:14px;line-height:1.5;';
        banner.innerHTML =
            '<div style="max-width:960px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:12px;justify-content:space-between;">' +
              '<p style="margin:0;flex:1 1 320px;">We use optional analytics cookies (Google Analytics) to understand how visitors use this site. They are only set if you accept. See our <a href="' + privacyPolicyHref() + '" style="color:#7ee8f0;text-decoration:underline;">privacy policy</a> for details.</p>' +
              '<div style="display:flex;gap:8px;flex:0 0 auto;">' +
                '<button type="button" id="cookie-decline" style="background:transparent;color:#fff;border:1px solid #7ee8f0;border-radius:6px;padding:8px 16px;cursor:pointer;font-weight:600;">Decline</button>' +
                '<button type="button" id="cookie-accept" style="background:#2dd4bf;color:#0a3b5c;border:none;border-radius:6px;padding:8px 16px;cursor:pointer;font-weight:700;">Accept</button>' +
              '</div>' +
            '</div>';
        document.body.appendChild(banner);
        document.getElementById('cookie-accept').addEventListener('click', function () {
            setChoice('granted');
            removeBanner();
            loadAnalytics();
        });
        document.getElementById('cookie-decline').addEventListener('click', function () {
            setChoice('denied');
            removeBanner();
        });
    }

    function init() {
        var choice = getChoice();
        if (choice === 'granted') { loadAnalytics(); return; }
        if (choice === 'denied') return;
        showBanner();
    }

    /* Any element with a data-cookie-settings attribute (e.g. a
       "Cookie Preferences" footer link) reopens the banner so the
       visitor can change their choice at any time. */
    document.addEventListener('click', function (e) {
        var target = e.target.closest ? e.target.closest('[data-cookie-settings]') : null;
        if (target) {
            e.preventDefault();
            showBanner();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
