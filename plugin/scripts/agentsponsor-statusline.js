const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const https = require('https');

const PLUGIN_DIR = path.resolve(__dirname, '..');
const LOCAL_CONFIG = path.join(PLUGIN_DIR, 'config', 'config.json');

const CONFIG_DIR = path.join(os.homedir(), '.agentsponsor');
const USER_CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const CACHE_FILE = path.join(CONFIG_DIR, 'campaign_cache.json');

let config = {
    api_url: "http://localhost:8000",
    cache_duration: 60, // 60s default for statusline freshness
    enabled: true
};

try {
    if (fs.existsSync(LOCAL_CONFIG)) {
        config = { ...config, ...JSON.parse(fs.readFileSync(LOCAL_CONFIG, 'utf8')) };
    }
} catch (e) { }

const getInstallationId = () => {
    try {
        if (fs.existsSync(USER_CONFIG_FILE)) {
            const data = JSON.parse(fs.readFileSync(USER_CONFIG_FILE, 'utf8'));
            if (data.installation_id) return data.installation_id;
        }
    } catch (e) { }
    return 'anonymous-fallback-uuid';
};

const getCachedOrFetchCampaign = async (apiUrl, cacheDurationMs) => {
    // 1. Try reading cache first
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
            if (Date.now() - cache.timestamp < cacheDurationMs && cache.campaign) {
                return cache.campaign;
            }
        }
    } catch (e) { }

    // 2. Fetch with very short timeout so we never block Antigravity
    return new Promise((resolve) => {
        try {
            const installId = getInstallationId();
            const url = new URL(`/v1/campaign?installation_id=${installId}`, apiUrl);
            const client = url.protocol === 'https:' ? https : http;

            const req = client.get(url, { timeout: 1000 }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            const campaign = JSON.parse(data);
                            if (campaign && (campaign.campaign_id || campaign.id)) {
                                if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true });
                                fs.writeFileSync(CACHE_FILE, JSON.stringify({
                                    timestamp: Date.now(),
                                    campaign
                                }));
                                return resolve(campaign);
                            }
                            resolve(null);
                        } catch (e) {
                            resolve(null);
                        }
                    } else {
                        resolve(null);
                    }
                });
            });

            req.on('error', () => resolve(null));
            req.on('timeout', () => {
                req.destroy();
                resolve(null);
            });
        } catch (e) {
            resolve(null);
        }
    });
};

const formatStatusLine = (campaign, maxColumns = 80) => {
    if (!campaign) return '';
    const advertiser = campaign.advertiser_name || campaign.advertiser || 'Sponsor';
    const headline = campaign.headline || '';
    
    // Format: Sponsored · CloudForge Demo — Deploy your AI backend in seconds →
    let line = `Sponsored · ${advertiser}`;
    if (headline) {
        line += ` — ${headline} →`;
    }

    // Protect against terminal overflow / wrapping
    const limit = Math.max(20, maxColumns - 2);
    if (line.length > limit) {
        line = line.slice(0, limit - 1) + '…';
    }

    return line;
};

// Main entry point
let inputData = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
    inputData += chunk;
});

process.stdin.on('end', async () => {
    if (!config.enabled) {
        process.exit(0);
    }

    try {
        let payload = {};
        if (inputData && inputData.trim()) {
            payload = JSON.parse(inputData.trim());
        }

        const agentState = (payload.agent_state || payload.agentState || '').toLowerCase();

        // Only show sponsor for active agent states
        const activeStates = ['thinking', 'working', 'tool_use', 'tooluse'];
        if (!activeStates.includes(agentState)) {
            // Idle, initializing, or unknown states -> empty stdout
            process.exit(0);
        }

        const cacheDurationMs = (config.cache_duration || 60) * 1000;
        const campaign = await getCachedOrFetchCampaign(config.api_url, cacheDurationMs);

        if (!campaign) {
            process.exit(0);
        }

        const termColumns = payload.terminal_columns || payload.terminalColumns || process.stdout.columns || 80;
        const statusText = formatStatusLine(campaign, termColumns);

        if (statusText) {
            process.stdout.write(statusText);
        }
    } catch (e) {
        // Always fail open and exit cleanly
        process.exit(0);
    }
});
