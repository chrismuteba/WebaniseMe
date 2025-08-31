/**
 * 🎯 AIniseFlow Lead Scoring System
 * Advanced lead qualification and prioritization system
 * Integrates with forms, email engagement, and behavioral tracking
 * 
 * @version 2.0
 * @author AIniseFlow Development Team
 * @description Comprehensive lead scoring with real-time updates and CRM integration
 */

class AIniseFlowLeadScoring {
    constructor(config = {}) {
        this.config = {
            // Scoring weights configuration
            weights: {
                demographic: 0.3,    // 30% - Company info, industry, etc.
                behavioral: 0.4,     // 40% - Website engagement, form completion
                engagement: 0.3      // 30% - Email opens, clicks, responses
            },
            
            // Minimum scores for categorization
            thresholds: {
                hot: 80,      // Hot leads (immediate follow-up)
                warm: 50,     // Warm leads (standard nurture)
                cold: 20      // Cold leads (long-term nurture)
            },
            
            // Integration endpoints
            endpoints: {
                crm: config.crmWebhook || null,
                slack: config.slackWebhook || null,
                analytics: config.analyticsId || 'G-JKM102Q8H1'
            },
            
            ...config
        };
        
        this.init();
    }

    /**
     * Initialize the lead scoring system
     */
    init() {
        this.bindFormEvents();
        this.initializeTracking();
        this.loadExistingLeadData();
        
        console.log('🎯 AIniseFlow Lead Scoring System initialized');
    }

    /**
     * 📊 DEMOGRAPHIC SCORING
     * Score based on company information and industry
     */
    calculateDemographicScore(leadData) {
        let score = 0;
        const maxScore = 100;

        // Email domain scoring (business vs personal)
        if (leadData.email) {
            const email = leadData.email.toLowerCase();
            const businessDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
            const isBusinessEmail = !businessDomains.some(domain => email.includes(domain));
            
            if (isBusinessEmail) {
                score += 25; // Business email = +25 points
            }
            
            // Premium domain scoring
            const premiumIndicators = ['.gov', '.edu', '.org', 'healthcare', 'medical', 'law', 'consulting'];
            if (premiumIndicators.some(indicator => email.includes(indicator))) {
                score += 15; // Premium domain = +15 points
            }
        }

        // Company name provided
        if (leadData.company && leadData.company.trim().length > 2) {
            score += 20; // Company name = +20 points
            
            // Company size indicators
            const enterpriseIndicators = ['corporation', 'corp', 'inc', 'llc', 'group', 'systems', 'solutions'];
            if (enterpriseIndicators.some(indicator => 
                leadData.company.toLowerCase().includes(indicator))) {
                score += 10; // Enterprise indicators = +10 points
            }
        }

        // Industry scoring (high-value industries)
        const industryScores = {
            'healthcare': 25,
            'professional-services': 20,
            'finance': 20,
            'legal': 20,
            'consulting': 18,
            'technology': 15,
            'manufacturing': 15,
            'real-estate': 12,
            'retail': 10,
            'restaurant': 8,
            'other': 5
        };
        
        const industry = leadData.industry || 'other';
        score += industryScores[industry] || 5;

        // Phone number provided (indicates serious intent)
        if (leadData.phone && leadData.phone.length >= 10) {
            score += 15; // Phone number = +15 points
        }

        return Math.min(score, maxScore);
    }

    /**
     * 🎬 BEHAVIORAL SCORING
     * Score based on website engagement and form completion quality
     */
    calculateBehavioralScore(leadData, behaviorData = {}) {
        let score = 0;
        const maxScore = 100;

        // Message quality and length
        if (leadData.message) {
            const messageLength = leadData.message.trim().length;
            
            if (messageLength > 200) {
                score += 25; // Detailed message = +25 points
            } else if (messageLength > 100) {
                score += 15; // Medium message = +15 points
            } else if (messageLength > 20) {
                score += 10; // Basic message = +10 points
            }
            
            // Keywords indicating serious intent
            const intentKeywords = [
                'automation', 'implement', 'integrate', 'budget', 'timeline', 'roi',
                'efficiency', 'streamline', 'optimize', 'reduce costs', 'save time',
                'competitive advantage', 'growth', 'scale', 'expansion'
            ];
            
            const messageLower = leadData.message.toLowerCase();
            const keywordMatches = intentKeywords.filter(keyword => 
                messageLower.includes(keyword)).length;
            
            score += Math.min(keywordMatches * 5, 20); // Max 20 points for keywords
        }

        // AI interests selected (multiple selections show higher intent)
        if (leadData.aiInterests && Array.isArray(leadData.aiInterests)) {
            const interestCount = leadData.aiInterests.length;
            if (interestCount >= 3) {
                score += 20; // Multiple interests = +20 points
            } else if (interestCount === 2) {
                score += 15; // Two interests = +15 points
            } else if (interestCount === 1) {
                score += 10; // One interest = +10 points
            }
        }

        // Website engagement (from analytics or session data)
        if (behaviorData.pageViews) {
            if (behaviorData.pageViews >= 5) {
                score += 15; // High engagement = +15 points
            } else if (behaviorData.pageViews >= 3) {
                score += 10; // Medium engagement = +10 points
            } else if (behaviorData.pageViews >= 2) {
                score += 5; // Basic engagement = +5 points
            }
        }

        // Time on site
        if (behaviorData.timeOnSite) {
            const minutes = behaviorData.timeOnSite / 60;
            if (minutes >= 10) {
                score += 15; // Long session = +15 points
            } else if (minutes >= 5) {
                score += 10; // Medium session = +10 points
            } else if (minutes >= 2) {
                score += 5; // Short session = +5 points
            }
        }

        // Specific page visits (high-intent pages)
        const highIntentPages = [
            '/ai-professional-services',
            '/ai-healthcare-solutions',
            '/pricing', '/contact',
            '/case-studies', '/testimonials'
        ];
        
        if (behaviorData.visitedPages) {
            const highIntentVisits = behaviorData.visitedPages.filter(page =>
                highIntentPages.some(intentPage => page.includes(intentPage))
            ).length;
            
            score += Math.min(highIntentVisits * 8, 20); // Max 20 points for page visits
        }

        // Referral source quality
        if (behaviorData.referralSource) {
            const sourceScores = {
                'google-ads': 15,
                'linkedin': 12,
                'direct': 10,
                'google-organic': 8,
                'referral': 6,
                'social': 4
            };
            
            score += sourceScores[behaviorData.referralSource] || 2;
        }

        return Math.min(score, maxScore);
    }

    /**
     * 📧 ENGAGEMENT SCORING
     * Score based on email opens, clicks, and responses
     */
    calculateEngagementScore(engagementData = {}) {
        let score = 0;
        const maxScore = 100;

        // Email open tracking
        if (engagementData.emailOpens) {
            const opens = engagementData.emailOpens;
            if (opens >= 3) {
                score += 30; // Multiple opens = +30 points
            } else if (opens >= 2) {
                score += 20; // Two opens = +20 points
            } else if (opens >= 1) {
                score += 15; // One open = +15 points
            }
        }

        // Email click tracking
        if (engagementData.emailClicks) {
            const clicks = engagementData.emailClicks;
            score += Math.min(clicks * 15, 40); // Max 40 points for clicks
        }

        // Email reply/response
        if (engagementData.emailReplied) {
            score += 25; // Email reply = +25 points (high engagement)
        }

        // Calendar booking clicks
        if (engagementData.calendarClicks) {
            score += 20; // Calendar click = +20 points
        }

        // Consultation actually booked
        if (engagementData.consultationBooked) {
            score += 30; // Booking = +30 points (highest intent)
        }

        // Social media engagement
        if (engagementData.socialEngagement) {
            score += 10; // Social follow/like = +10 points
        }

        // Website return visits after email
        if (engagementData.returnVisits) {
            score += Math.min(engagementData.returnVisits * 8, 20);
        }

        return Math.min(score, maxScore);
    }

    /**
     * 🎯 COMPOSITE LEAD SCORING
     * Calculate final weighted score and categorization
     */
    calculateLeadScore(leadData, behaviorData = {}, engagementData = {}) {
        const demographicScore = this.calculateDemographicScore(leadData);
        const behavioralScore = this.calculateBehavioralScore(leadData, behaviorData);
        const engagementScore = this.calculateEngagementScore(engagementData);

        // Weighted composite score
        const compositeScore = Math.round(
            (demographicScore * this.config.weights.demographic) +
            (behavioralScore * this.config.weights.behavioral) +
            (engagementScore * this.config.weights.engagement)
        );

        // Determine category
        let category;
        if (compositeScore >= this.config.thresholds.hot) {
            category = 'hot';
        } else if (compositeScore >= this.config.thresholds.warm) {
            category = 'warm';
        } else {
            category = 'cold';
        }

        // Create comprehensive lead profile
        const leadProfile = {
            // Core identification
            id: this.generateLeadId(leadData),
            email: leadData.email,
            name: leadData.name || 'Unknown',
            company: leadData.company || 'Unknown',
            industry: leadData.industry || 'other',
            
            // Scoring breakdown
            scores: {
                demographic: demographicScore,
                behavioral: behavioralScore,
                engagement: engagementScore,
                composite: compositeScore
            },
            
            // Categorization
            category: category,
            priority: this.getPriorityLevel(category),
            
            // Recommendations
            nextAction: this.getNextAction(category, engagementData),
            followUpTiming: this.getFollowUpTiming(category),
            
            // Metadata
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            source: 'website_contact_form',
            
            // Raw data for reference
            rawData: {
                lead: leadData,
                behavior: behaviorData,
                engagement: engagementData
            }
        };

        // Store and process the lead
        this.processLead(leadProfile);
        
        return leadProfile;
    }

    /**
     * 🔄 LEAD PROCESSING & ROUTING
     * Route leads based on score and trigger appropriate actions
     */
    processLead(leadProfile) {
        // Store lead data
        this.storeLead(leadProfile);
        
        // Send to analytics
        this.trackLeadScoring(leadProfile);
        
        // Route based on category
        switch (leadProfile.category) {
            case 'hot':
                this.processHotLead(leadProfile);
                break;
            case 'warm':
                this.processWarmLead(leadProfile);
                break;
            case 'cold':
                this.processColdLead(leadProfile);
                break;
        }
        
        // Send to CRM if configured
        if (this.config.endpoints.crm) {
            this.sendToCRM(leadProfile);
        }
    }

    /**
     * 🔥 HOT LEAD PROCESSING
     * Immediate high-priority actions for hot leads
     */
    processHotLead(leadProfile) {
        console.log('🔥 Processing HOT lead:', leadProfile.name);
        
        // Immediate notifications
        this.sendSlackAlert('hot', leadProfile);
        this.sendEmailAlert('hot', leadProfile);
        
        // Priority CRM assignment
        this.assignToSalesRep(leadProfile, 'senior');
        
        // Fast-track email sequence
        this.triggerEmailSequence(leadProfile, 'hot_lead_sequence');
        
        // Analytics event
        gtag('event', 'hot_lead_generated', {
            'event_category': 'Lead Scoring',
            'event_label': leadProfile.industry,
            'value': 500,
            'lead_score': leadProfile.scores.composite
        });
    }

    /**
     * 🟡 WARM LEAD PROCESSING
     * Standard nurturing sequence for warm leads
     */
    processWarmLead(leadProfile) {
        console.log('🟡 Processing WARM lead:', leadProfile.name);
        
        // Standard notifications
        this.sendSlackAlert('warm', leadProfile);
        
        // Standard CRM assignment
        this.assignToSalesRep(leadProfile, 'standard');
        
        // Standard email sequence
        this.triggerEmailSequence(leadProfile, 'standard_nurture_sequence');
        
        // Analytics event
        gtag('event', 'warm_lead_generated', {
            'event_category': 'Lead Scoring',
            'event_label': leadProfile.industry,
            'value': 250,
            'lead_score': leadProfile.scores.composite
        });
    }

    /**
     * 🔵 COLD LEAD PROCESSING
     * Long-term nurturing for cold leads
     */
    processColdLead(leadProfile) {
        console.log('🔵 Processing COLD lead:', leadProfile.name);
        
        // Basic CRM entry
        this.assignToSalesRep(leadProfile, 'junior');
        
        // Long-term nurture sequence
        this.triggerEmailSequence(leadProfile, 'long_term_nurture');
        
        // Analytics event
        gtag('event', 'cold_lead_generated', {
            'event_category': 'Lead Scoring',
            'event_label': leadProfile.industry,
            'value': 50,
            'lead_score': leadProfile.scores.composite
        });
    }

    /**
     * 📊 HELPER METHODS
     */
    
    getPriorityLevel(category) {
        const priorities = {
            'hot': 'P1 - Immediate (2 hours)',
            'warm': 'P2 - Standard (24 hours)',
            'cold': 'P3 - Long-term (3-7 days)'
        };
        return priorities[category];
    }

    getNextAction(category, engagementData) {
        if (category === 'hot') {
            return 'Schedule immediate consultation call';
        } else if (category === 'warm') {
            return 'Send personalized follow-up email within 24 hours';
        } else {
            return 'Add to long-term nurture campaign';
        }
    }

    getFollowUpTiming(category) {
        const timings = {
            'hot': 'Within 2 hours',
            'warm': 'Within 24 hours',
            'cold': 'Within 3-7 days'
        };
        return timings[category];
    }

    generateLeadId(leadData) {
        const timestamp = Date.now();
        const emailHash = this.hashString(leadData.email || 'unknown');
        return `lead_${timestamp}_${emailHash}`;
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }

    /**
     * 💾 DATA PERSISTENCE
     */
    
    storeLead(leadProfile) {
        try {
            // Store in localStorage for immediate access
            const leads = JSON.parse(localStorage.getItem('ainiseflow_leads') || '[]');
            leads.push(leadProfile);
            localStorage.setItem('ainiseflow_leads', JSON.stringify(leads));
            
            // Store in sessionStorage for current session
            sessionStorage.setItem('current_lead', JSON.stringify(leadProfile));
            
        } catch (error) {
            console.error('Error storing lead data:', error);
        }
    }

    loadExistingLeadData() {
        try {
            const leads = JSON.parse(localStorage.getItem('ainiseflow_leads') || '[]');
            console.log(`📚 Loaded ${leads.length} existing leads`);
            return leads;
        } catch (error) {
            console.error('Error loading lead data:', error);
            return [];
        }
    }

    /**
     * 🔗 INTEGRATIONS
     */
    
    sendToCRM(leadProfile) {
        if (!this.config.endpoints.crm) return;

        fetch(this.config.endpoints.crm, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'lead_scored',
                lead: leadProfile,
                timestamp: new Date().toISOString()
            })
        }).catch(error => console.error('CRM webhook error:', error));
    }

    sendSlackAlert(category, leadProfile) {
        if (!this.config.endpoints.slack) return;

        const emojis = { hot: '🔥', warm: '🟡', cold: '🔵' };
        const message = {
            text: `${emojis[category]} New ${category.toUpperCase()} lead: ${leadProfile.name} from ${leadProfile.company}`,
            attachments: [{
                color: category === 'hot' ? '#ff0000' : category === 'warm' ? '#ffaa00' : '#0066cc',
                fields: [
                    { title: 'Score', value: leadProfile.scores.composite, short: true },
                    { title: 'Industry', value: leadProfile.industry, short: true },
                    { title: 'Next Action', value: leadProfile.nextAction, short: false }
                ]
            }]
        };

        fetch(this.config.endpoints.slack, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        }).catch(error => console.error('Slack webhook error:', error));
    }

    triggerEmailSequence(leadProfile, sequenceType) {
        // This would integrate with your email platform (Mailchimp, ConvertKit, etc.)
        console.log(`📧 Triggering ${sequenceType} for ${leadProfile.email}`);
        
        // Store sequence trigger for tracking
        const sequenceData = {
            leadId: leadProfile.id,
            sequenceType: sequenceType,
            triggeredAt: new Date().toISOString(),
            status: 'active'
        };
        
        const sequences = JSON.parse(localStorage.getItem('email_sequences') || '[]');
        sequences.push(sequenceData);
        localStorage.setItem('email_sequences', JSON.stringify(sequences));
    }

    trackLeadScoring(leadProfile) {
        gtag('event', 'lead_scored', {
            'event_category': 'Lead Scoring',
            'event_label': leadProfile.category,
            'custom_parameter_lead_score': leadProfile.scores.composite,
            'custom_parameter_industry': leadProfile.industry,
            'custom_parameter_company': leadProfile.company
        });
    }

    /**
     * 🎮 EVENT BINDING
     */
    
    bindFormEvents() {
        // Listen for form submissions
        document.addEventListener('submit', (event) => {
            const form = event.target;
            if (form.action && form.action.includes('formspree.io')) {
                this.handleFormSubmission(form);
            }
        });
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const leadData = {};
        
        // Extract form data
        for (let [key, value] of formData.entries()) {
            leadData[key] = value;
        }
        
        // Get behavioral data from session
        const behaviorData = this.getBehaviorData();
        
        // Calculate and process lead score
        const leadProfile = this.calculateLeadScore(leadData, behaviorData);
        
        console.log('📋 Form submitted - Lead scored:', leadProfile);
    }

    getBehaviorData() {
        // Collect behavioral data from analytics, session storage, etc.
        return {
            pageViews: parseInt(sessionStorage.getItem('page_views') || '1'),
            timeOnSite: parseInt(sessionStorage.getItem('time_on_site') || '0'),
            visitedPages: JSON.parse(sessionStorage.getItem('visited_pages') || '[]'),
            referralSource: sessionStorage.getItem('referral_source') || 'direct'
        };
    }

    initializeTracking() {
        // Track page views
        let pageViews = parseInt(sessionStorage.getItem('page_views') || '0');
        pageViews++;
        sessionStorage.setItem('page_views', pageViews.toString());
        
        // Track visited pages
        const visitedPages = JSON.parse(sessionStorage.getItem('visited_pages') || '[]');
        const currentPage = window.location.pathname;
        if (!visitedPages.includes(currentPage)) {
            visitedPages.push(currentPage);
            sessionStorage.setItem('visited_pages', JSON.stringify(visitedPages));
        }
        
        // Track time on site
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnSite = Date.now() - startTime;
            sessionStorage.setItem('time_on_site', timeOnSite.toString());
        });
    }
}

/**
 * 🚀 INITIALIZATION & USAGE
 */

// Initialize the lead scoring system
document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const leadScoringConfig = {
        // Customize thresholds based on your business needs
        thresholds: {
            hot: 75,    // Adjust based on your lead quality standards
            warm: 45,   // Medium priority leads
            cold: 20    // Long-term nurture leads
        },
        
        // Integration webhooks (configure these in your dashboard)
        endpoints: {
            crm: '/api/webhook/crm',           // Your CRM webhook endpoint
            slack: '/api/webhook/slack',       // Slack notifications
            analytics: 'G-JKM102Q8H1'         // Your GA4 measurement ID
        }
    };
    
    // Initialize the system
    window.ainiseFlowScoring = new AIniseFlowLeadScoring(leadScoringConfig);
    
    console.log('🎯 AIniseFlow Lead Scoring System ready!');
});

/**
 * 🧪 TESTING & UTILITIES
 */

// Test function for manual lead scoring
function testLeadScoring(testData) {
    if (typeof window.ainiseFlowScoring === 'undefined') {
        console.error('Lead scoring system not initialized');
        return;
    }
    
    const sampleLead = {
        name: testData.name || 'John Smith',
        email: testData.email || 'john.smith@healthcarecorp.com',
        company: testData.company || 'Healthcare Solutions Inc.',
        industry: testData.industry || 'healthcare',
        phone: testData.phone || '555-123-4567',
        message: testData.message || 'We need to automate our patient intake process and reduce manual data entry. Looking for AI solutions that can integrate with our existing EMR system.',
        aiInterests: testData.aiInterests || ['process-automation', 'data-analysis', 'customer-service']
    };
    
    const sampleBehavior = {
        pageViews: 7,
        timeOnSite: 480000, // 8 minutes
        visitedPages: ['/ai-healthcare-solutions', '/case-studies', '/contact'],
        referralSource: 'google-organic'
    };
    
    const sampleEngagement = {
        emailOpens: 2,
        emailClicks: 1,
        calendarClicks: 0,
        consultationBooked: false
    };
    
    const result = window.ainiseFlowScoring.calculateLeadScore(sampleLead, sampleBehavior, sampleEngagement);
    console.log('🧪 Test Lead Scoring Result:', result);
    return result;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIniseFlowLeadScoring;
}