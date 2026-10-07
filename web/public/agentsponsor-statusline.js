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
const LAST_IMPRESSION_FILE = path.join(CONFIG_DIR, 'last_impression.json');
const ROTATION_INDEX_FILE = path.join(CONFIG_DIR, 'rotation_index.json');

// Default circulating sponsor pool
const SPONSOR_POOL = [
    {
        campaign_id: "cmp_cloudforge_001",
        advertiser_name: "CloudForge",
        headline: "Deploy serverless AI backends with instant cold starts"
    },
    {
        campaign_id: "cmp_neondb_002",
        advertiser_name: "Neon DB",
        headline: "Serverless Postgres with instant branching for agent tests"
    },
    {
        campaign_id: "cmp_prisma_003",
        advertiser_name: "Prisma ORM",
        headline: "Type-safe database client for autonomous TypeScript agents"
    },
    {
        campaign_id: "cmp_supabase_004",
        advertiser_name: "Supabase",
        headline: "Open-source Postgres with Realtime, Auth, and Storage"
    },
    {
        campaign_id: "cmp_cursor_005",
        advertiser_name: "Cursor",
        headline: "The AI-first Code Editor built for agentic pair-programming"
    }
];

const ACTIVE_STATES = new Set([
    'working',
    'thinking',
    'tool_use',
    'tooluse',
    'executing',
    'streaming',
    'running',
    'busy',
    'prompt_running',
    'active',
    'in_progress',
    'generating'
]);

const IDLE_STATES = new Set([
    'idle',
    'ready',
    'waiting',
    'stopped',
    'completed',
    'done',
    'standby',
    'finished',
    'none',
    'inactive'
]);

let config = {
    api_url: "http://localhost:8000",
    cache_duration: 30, // 30s cache
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
    return '0539ab62-99fb-473f-bcac-a25953c5c007';
};

// Circulate through sponsor pool
const getNextCirculatingSponsor = () => {
    let index = 0;
    try {
        if (fs.existsSync(ROTATION_INDEX_FILE)) {
            const data = JSON.parse(fs.readFileSync(ROTATION_INDEX_FILE, 'utf8'));
            index = (data.index + 1) % SPONSOR_POOL.length;
        }
        if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true });
        fs.writeFileSync(ROTATION_INDEX_FILE, JSON.stringify({ index, updated: Date.now() }));
    } catch (e) {
        index = Math.floor(Math.random() * SPONSOR_POOL.length);
    }
    return SPONSOR_POOL[index];
};

const getCachedOrFetchCampaign = async (apiUrl, cacheDurationMs) => {
    // 1. Check local cache
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
            if (Date.now() - cache.timestamp < cacheDurationMs && cache.campaign) {
                return cache.campaign;
            }
        }
    } catch (e) { }

    // 2. Fetch from backend API or circulate fallback
    return new Promise((resolve) => {
        try {
            const installId = getInstallationId();
            const url = new URL(`/v1/campaign?installation_id=${installId}`, apiUrl);
            const client = url.protocol === 'https:' ? https : http;

            const req = client.get(url, { timeout: 800 }, (res) => {
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
                            resolve(getNextCirculatingSponsor());
                        } catch (e) {
                            resolve(getNextCirculatingSponsor());
                        }
                    } else {
                        resolve(getNextCirculatingSponsor());
                    }
                });
            });

            req.on('error', () => resolve(getNextCirculatingSponsor()));
            req.on('timeout', () => {
                req.destroy();
                resolve(getNextCirculatingSponsor());
            });
        } catch (e) {
            resolve(getNextCirculatingSponsor());
        }
    });
};

const reportImpressionAsync = (apiUrl, campaignId, installId) => {
    try {
        const now = Date.now();
        if (fs.existsSync(LAST_IMPRESSION_FILE)) {
            const last = JSON.parse(fs.readFileSync(LAST_IMPRESSION_FILE, 'utf8'));
            // Rate limit impression reporting to once per 10 seconds
            if (now - last.timestamp < 10000 && last.campaign_id === campaignId) {
                return;
            }
        }

        fs.writeFileSync(LAST_IMPRESSION_FILE, JSON.stringify({
            timestamp: now,
            campaign_id: campaignId
        }));

        const eventId = `evt_imp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const payload = JSON.stringify({
            event_id: eventId,
            installation_id: installId,
            event_type: "eligible_impression",
            campaign_id: campaignId,
            exposure_duration_seconds: 5.0
        });

        const url = new URL('/v1/events', apiUrl);
        const client = url.protocol === 'https:' ? https : http;

        const req = client.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            },
            timeout: 500
        });

        req.on('error', () => {});
        req.write(payload);
        req.end();
    } catch (e) { }
};

const formatStatusLine = (campaign, maxColumns) => {
    if (!campaign) return '';
    const advertiser = campaign.advertiser_name || campaign.advertiser || 'CloudForge';
    const headline = campaign.headline || 'Deploy serverless AI backends with instant cold starts';

    let line = `Sponsored · ${advertiser} — ${headline} →`;

    if (maxColumns && typeof maxColumns === 'number' && maxColumns > 3 && line.length > maxColumns) {
        line = line.slice(0, maxColumns - 1) + '…';
    }

    return line;
};

const main = async (rawInput) => {
    if (!config.enabled) {
        process.exit(0);
    }

    try {
        if (!rawInput || !rawInput.trim()) {
            // No input or prompt not active -> silent exit
            process.exit(0);
        }

        let payload = {};
        try { 
            payload = JSON.parse(rawInput.trim()); 
        } catch (e) { 
            // Malformed JSON -> fail open with empty stdout
            process.exit(0);
        }

        // REQUIREMENT: Only show status line while prompt/command is actively executing
        if (payload.is_idle === true || payload.busy === false || payload.is_running === false || payload.active === false) {
            process.exit(0);
        }

        const state = (payload.agent_state || payload.state || payload.status || '').toLowerCase().trim();
        
        if (IDLE_STATES.has(state)) {
            process.exit(0);
        }

        const isRunning = ACTIVE_STATES.has(state) || 
                          payload.is_running === true || 
                          payload.busy === true || 
                          payload.command_running === true || 
                          payload.active_prompt === true;

        if (!isRunning) {
            // Neither actively running nor recognized active state -> show nothing
            process.exit(0);
        }

        const installId = getInstallationId();
        const cacheDurationMs = (config.cache_duration || 30) * 1000;
        const campaign = await getCachedOrFetchCampaign(config.api_url, cacheDurationMs);

        if (!campaign) {
            process.exit(0);
        }

        const campaignId = campaign.campaign_id || campaign.id;
        reportImpressionAsync(config.api_url, campaignId, installId);

        const maxColumns = payload.terminal_columns || payload.columns || payload.width;
        const statusText = formatStatusLine(campaign, maxColumns);
        if (statusText) {
            process.stdout.write(statusText);
        }
    } catch (e) {
        process.exit(0);
    }
};

// Non-blocking stdin handler with fast 25ms fallback
let stdinBuffer = '';
let executed = false;

const runOnce = () => {
    if (executed) return;
    executed = true;
    main(stdinBuffer);
};

if (process.stdin.isTTY) {
    runOnce();
} else {
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => {
        stdinBuffer += chunk;
    });
    process.stdin.on('end', runOnce);

    // If stdin doesn't close within 35ms, execute immediately
    setTimeout(runOnce, 35);
}
