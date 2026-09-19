const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const http = require('http');

const CONFIG_DIR = path.join(os.homedir(), '.agentsponsor');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const CACHE_FILE = path.join(CONFIG_DIR, 'campaign_cache.json');

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

const fetchCampaign = async (apiUrl, cacheDurationMs) => {
    return new Promise((resolve) => {
        try {
            if (fs.existsSync(CACHE_FILE)) {
                const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
                if (Date.now() - cache.timestamp < cacheDurationMs) {
                    return resolve(cache.campaign);
                }
            }
        } catch (e) { }

        const installId = getInstallationId();
        const url = new URL(`/v1/campaign?installation_id=${installId}`, apiUrl);

        const req = http.get(url, { timeout: 2000 }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const campaign = JSON.parse(data);
                        if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true });
                        fs.writeFileSync(CACHE_FILE, JSON.stringify({
                            timestamp: Date.now(),
                            campaign
                        }));
                        resolve(campaign);
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
    });
};

const reportEvent = (apiUrl, eventType, data = {}) => {
    try {
        const installId = getInstallationId();
        const eventId = crypto.randomUUID();
        const payload = JSON.stringify({
            event_id: eventId,
            installation_id: installId,
            event_type: eventType,
            timestamp: Date.now(),
            ...data
        });

        const url = new URL('/v1/events', apiUrl);
        const req = http.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            },
            timeout: 2000
        });

        req.on('error', () => {});
        req.write(payload);
        req.end();
    } catch (e) { }
};

const formatMessage = (campaign) => {
    if (!campaign) return null;
    const advertiser = campaign.advertiser_name || campaign.advertiser || 'Sponsor';
    const headline = campaign.headline || '';
    const url = campaign.destination_url || campaign.url || '';
    return `────────────────────────────\nSponsored · ${advertiser}\n${headline} → ${url}\n────────────────────────────`;
};

module.exports = {
    getInstallationId,
    fetchCampaign,
    reportEvent,
    formatMessage
};
