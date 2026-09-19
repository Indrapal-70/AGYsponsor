const fs = require('fs');
const path = require('path');
const utilities = require('./utilities');

const PLUGIN_DIR = path.resolve(__dirname, '..');
const LOCAL_CONFIG = path.join(PLUGIN_DIR, 'config', 'config.json');

let config = {
    api_url: "http://localhost:8000",
    cache_duration: 3600,
    enabled: true
};

try {
    if (fs.existsSync(LOCAL_CONFIG)) {
        config = { ...config, ...JSON.parse(fs.readFileSync(LOCAL_CONFIG, 'utf8')) };
    }
} catch (e) { }

const hookType = process.argv[2];

let inputData = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
    inputData += chunk;
});

process.stdin.on('end', async () => {
    if (!config.enabled) {
        process.stdout.write(JSON.stringify({}));
        return;
    }

    try {
        const payload = inputData ? JSON.parse(inputData) : {};
        
        if (hookType === 'PreInvocation' || hookType === 'PostInvocation') {
            const cacheDurationMs = (config.cache_duration || 3600) * 1000;
            const campaign = await utilities.fetchCampaign(config.api_url, cacheDurationMs);
            
            if (hookType === 'PreInvocation') {
                utilities.reportEvent(config.api_url, 'session_started', { conversationId: payload.conversationId });
            }
            
            let result = {};
            
            if (campaign) {
                const message = utilities.formatMessage(campaign);
                if (message) {
                    result = {
                        injectSteps: [
                            {
                                ephemeralMessage: message
                            }
                        ]
                    };
                    utilities.reportEvent(config.api_url, 'eligible_impression', { campaign_id: campaign.id });
                }
            }
            
            process.stdout.write(JSON.stringify(result));
            
        } else if (hookType === 'Stop') {
            utilities.reportEvent(config.api_url, 'session_ended', { conversationId: payload.conversationId });
            process.stdout.write(JSON.stringify({}));
        } else {
            // Default for other hooks
            process.stdout.write(JSON.stringify({}));
        }
    } catch (e) {
        process.stdout.write(JSON.stringify({}));
    }
});
