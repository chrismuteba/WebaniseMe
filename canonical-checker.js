#!/usr/bin/env node

/**
 * Canonical URL Verification Script for AIniseFlow
 * Checks all HTML files for proper canonical tag implementation
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DOMAIN = 'https://ainiseflow.com';
const HTML_FILES = [
    'index.html',
    'ai-automation-services.html',
    'ai-healthcare-solutions.html',
    'ai-professional-services.html',
    'ai-restaurant-solutions.html',
    'ai-retail-solutions.html',
    'blog.html',
    'web-design-addon.html'
];

function checkCanonicalTag(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract canonical tag
        const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i);
        
        if (!canonicalMatch) {
            return {
                file: filePath,
                status: 'ERROR',
                message: 'No canonical tag found',
                canonical: null
            };
        }
        
        const canonicalUrl = canonicalMatch[1];
        const fileName = path.basename(filePath);
        let expectedUrl;
        
        if (fileName === 'index.html') {
            expectedUrl = `${DOMAIN}/`;
        } else {
            expectedUrl = `${DOMAIN}/${fileName}`;
        }
        
        const isCorrect = canonicalUrl === expectedUrl;
        
        return {
            file: filePath,
            status: isCorrect ? 'OK' : 'MISMATCH',
            message: isCorrect ? 'Canonical URL is correct' : `Expected: ${expectedUrl}, Found: ${canonicalUrl}`,
            canonical: canonicalUrl,
            expected: expectedUrl
        };
        
    } catch (error) {
        return {
            file: filePath,
            status: 'ERROR',
            message: `File read error: ${error.message}`,
            canonical: null
        };
    }
}

function checkSitemapConsistency() {
    try {
        const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
        const urlMatches = sitemapContent.match(/<loc>([^<]+)<\/loc>/g) || [];
        
        const sitemapUrls = urlMatches.map(match => 
            match.replace(/<\/?loc>/g, '')
        );
        
        console.log('\n📋 SITEMAP URLS:');
        sitemapUrls.forEach(url => {
            const hasWww = url.includes('www.');
            const protocol = url.startsWith('https://') ? '✅ HTTPS' : '❌ HTTP';
            const wwwStatus = hasWww ? '❌ Has www' : '✅ No www';
            console.log(`   ${url} - ${protocol}, ${wwwStatus}`);
        });
        
        return sitemapUrls;
    } catch (error) {
        console.log('❌ Error reading sitemap.xml:', error.message);
        return [];
    }
}

// Main execution
console.log('🔍 CANONICAL TAG VERIFICATION REPORT');
console.log('=====================================');

let allPassed = true;
const results = [];

HTML_FILES.forEach(file => {
    if (fs.existsSync(file)) {
        const result = checkCanonicalTag(file);
        results.push(result);
        
        const status = result.status === 'OK' ? '✅' : '❌';
        console.log(`${status} ${file}: ${result.message}`);
        
        if (result.status !== 'OK') {
            allPassed = false;
        }
    } else {
        console.log(`❌ ${file}: File not found`);
        allPassed = false;
    }
});

// Check sitemap consistency
const sitemapUrls = checkSitemapConsistency();

// Summary
console.log('\n📊 SUMMARY:');
console.log(`Total files checked: ${results.length}`);
console.log(`Passed: ${results.filter(r => r.status === 'OK').length}`);
console.log(`Failed: ${results.filter(r => r.status !== 'OK').length}`);

if (allPassed) {
    console.log('\n🎉 ALL CANONICAL TAGS ARE PROPERLY CONFIGURED!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Submit updated sitemap to Google Search Console');
    console.log('2. Request re-indexing for affected pages');
    console.log('3. Monitor Search Console for canonical tag errors');
    console.log('4. Set up 301 redirects from www to non-www versions');
} else {
    console.log('\n⚠️  ISSUES FOUND - Please fix the errors above before deployment');
}

// Export results for programmatic use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { results, allPassed, sitemapUrls };
}