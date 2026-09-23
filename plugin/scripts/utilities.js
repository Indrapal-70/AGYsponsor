const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const http = require('http');
const https = require('https');

const CONFIG_DIR = path.join(os.homedir(), '.agentsponsor');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const CACHE_FILE = path.join(CONFIG_DIR, 'campaign_cache.json');
const IMPRESSIONS_FILE = path.join(CONFIG_DIR, 'recorded_impressions.json');

const getInstallationId = () => {
    try {
        if (!fs.existsSync(CONFIG_DIR)) {
            fs.mkdirSync(CONFIG_DIR, { recursive: true });
        }
        if (fs.existsSync(CONFIG_FILE)) {
            const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
            if (config.installation_id) {
                return config.installation_id;
            }
        }
        const newId = crypto.randomUUID();
        const config = fs.existsSync(CONFIG_FILE) ? JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) : {};
        config.installation_id = newId;
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        return newId;
    } catch (e) {
        return 'anonymous-fallback-uuid';
    }
};

const isValidHttpUrl = (urlString) => {
    try {
        const parsed = new URL(urlString);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};

const fetchCampaign = async (apiUrl, cacheDurationMs) => {
    return new Promise((resolve) => {
        try {
            if (fs.existsSync(CACHE_FILE)) {
                const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
                if (Date.now() - cache.timestamp < cacheDurationMs && cache.campaign) {
                    return resolve(cache.campaign);
                }
            }
        } catch (e) { }

        try {
            const installId = getInstallationId();
            const url = new URL(`/v1/campaign?installation_id=${installId}`, apiUrl);
            const client = url.protocol === 'https:' ? https : http;

            const req = client.get(url, { timeout: 2000 }, (res) => {
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

const hasRecordedImpression = (conversationId, campaignId) => {
    try {
        if (!conversationId || !campaignId) return false;
        if (!fs.existsSync(IMPRESSIONS_FILE)) return false;
        const impressions = JSON.parse(fs.readFileSync(IMPRESSIONS_FILE, 'utf8'));
        const key = `${conversationId}:${campaignId}`;
        const recordTime = impressions[key];
        // 1 hour exposure window per conversation+campaign
        if (recordTime && Date.now() - recordTime < 3600000) {
            return true;
        }
        return false;
    } catch {
        return false;
    }
};

const markImpressionRecorded = (conversationId, campaignId) => {
    try {
        if (!conversationId || !campaignId) return;
        if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true });
        let impressions = {};
        if (fs.existsSync(IMPRESSIONS_FILE)) {
            impressions = JSON.parse(fs.readFileSync(IMPRESSIONS_FILE, 'utf8'));
        }
        const now = Date.now();
        // Prune older than 24 hours
        for (const k in impressions) {
            if (now - impressions[k] > 86400000) {
                delete impressions[k];
            }
        }
        impressions[`${conversationId}:${campaignId}`] = now;
        fs.writeFileSync(IMPRESSIONS_FILE, JSON.stringify(impressions, null, 2));
    } catch { }
};

const makeImpressionEventId = (installId, conversationId, campaignId) => {
    const key = `${installId}:${conversationId || 'default'}:${campaignId}`;
    return `evt_imp_${crypto.createHash('sha256').update(key).digest('hex').slice(0, 16)}`;
};

const reportEvent = (apiUrl, eventType, data = {}) => {
    try {
        const installId = getInstallationId();
        const eventId = data.event_id || crypto.randomUUID();
        const payload = JSON.stringify({
            event_id: eventId,
            installation_id: installId,
            event_type: eventType,
            timestamp: Date.now(),
            ...data
        });

        const url = new URL('/v1/events', apiUrl);
        const client = url.protocol === 'https:' ? https : http;
        const req = client.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            },
            timeout: 2000
        });

        req.on('error', () => {});
        req.on('timeout', () => {
            req.destroy();
        });
        req.write(payload);
        req.end();
        // Allow Node.js process to exit without waiting for background reporting
        if (req.socket) req.socket.unref();
        req.on('socket', (sock) => sock.unref());
    } catch (e) { }
};

const formatMessage = (campaign) => {
    if (!campaign) return null;
    const advertiser = campaign.advertiser_name || campaign.advertiser || 'Sponsor';
    const headline = campaign.headline || '';
    let url = campaign.destination_url || campaign.url || '';
    
    // Validate destination URL safety: only allow http or https
    if (!isValidHttpUrl(url)) {
        url = 'https://example.com';
    }

    return `────────────────────────────\nSponsored · ${advertiser}\n${headline} → ${url}\n────────────────────────────`;
};

module.exports = {
    getInstallationId,
    fetchCampaign,
    reportEvent,
    formatMessage,
    hasRecordedImpression,
    markImpressionRecorded,
    makeImpressionEventId,
    isValidHttpUrl
};
