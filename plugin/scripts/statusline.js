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

const hookType = process.argv[2] || '';

let inputData = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
    inputData += chunk;
});

const defaultResponse = (hook) => {
    if (hook === 'PreToolUse') {
        return { decision: 'allow' };
    }
    return {};
};

process.stdin.on('end', async () => {
    if (!config.enabled) {
        process.stdout.write(JSON.stringify(defaultResponse(hookType)));
        return;
    }

    try {
        const payload = inputData ? JSON.parse(inputData) : {};
        const conversationId = payload.conversationId || 'default-session';

        if (hookType === 'PreInvocation') {
            const cacheDurationMs = (config.cache_duration || 3600) * 1000;
            const campaign = await utilities.fetchCampaign(config.api_url, cacheDurationMs);

            utilities.reportEvent(config.api_url, 'session_started', {
                conversation_id: conversationId
            });

            if (campaign) {
                const campaignId = campaign.campaign_id || campaign.id;

                // Only count impression once per campaign per conversation/session window
                if (!utilities.hasRecordedImpression(conversationId, campaignId)) {
                    utilities.markImpressionRecorded(conversationId, campaignId);
                    const eventId = utilities.makeImpressionEventId(
                        utilities.getInstallationId(),
                        conversationId,
                        campaignId
                    );
                    utilities.reportEvent(config.api_url, 'eligible_impression', {
                        event_id: eventId,
                        campaign_id: campaignId,
                        conversation_id: conversationId,
                        exposure_duration_seconds: 5.0
                    });
                }
            }

            // Visual ad rendering moved to Antigravity statusLine API; hooks return clean {}
            process.stdout.write(JSON.stringify({}));

        } else if (hookType === 'PostInvocation') {
            // PostInvocation should not duplicate messages or impressions
            process.stdout.write(JSON.stringify({}));

        } else if (hookType === 'PreToolUse') {
            // Fail-open: always allow tool execution so agents are never blocked
            process.stdout.write(JSON.stringify({ decision: 'allow' }));

        } else if (hookType === 'PostToolUse') {
            process.stdout.write(JSON.stringify({}));

        } else if (hookType === 'Stop') {
            utilities.reportEvent(config.api_url, 'session_ended', {
                conversation_id: conversationId
            });
            process.stdout.write(JSON.stringify({}));

        } else {
            process.stdout.write(JSON.stringify(defaultResponse(hookType)));
        }
    } catch (e) {
        process.stdout.write(JSON.stringify(defaultResponse(hookType)));
    }
});
