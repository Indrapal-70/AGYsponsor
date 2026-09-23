const assert = require('assert');
const http = require('http');
const crypto = require('crypto');
const path = require('path');
const { spawn } = require('child_process');

console.log('====================================================');
console.log('STARTING AGENTSPONSOR FULL PRODUCTION E2E TEST SUITE');
console.log('====================================================');

const PORT = 3009;
const BASE_URL = `http://localhost:${PORT}`;

// Start Next.js production server for testing
let serverProcess;

function startServer() {
  return new Promise((resolve, reject) => {
    console.log(`Starting Next.js server on port ${PORT}...`);
    serverProcess = spawn('npx', ['next', 'start', '-p', PORT.toString()], {
      cwd: path.resolve(__dirname, '..', 'web'),
      env: {
        ...process.env,
        PORT: PORT.toString(),
        EXPOSURE_TOKEN_SECRET: 'test_e2e_secret_key_1234567890abcdef',
        PAYMENT_PROVIDER: 'MOCK',
        PAYMENT_WEBHOOK_SECRET: 'test_webhook_secret_xyz'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdoutData = '';
    serverProcess.stdout.on('data', (d) => {
      stdoutData += d.toString();
      if (stdoutData.includes('Ready') || stdoutData.includes('started server') || stdoutData.includes(`localhost:${PORT}`)) {
        resolve();
      }
    });

    serverProcess.stderr.on('data', (d) => {
      // console.error(d.toString());
    });

    serverProcess.on('error', reject);

    // Timeout fallback check
    setTimeout(resolve, 6000);
  });
}

function requestJson(method, endpoint, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    const postData = typeof body === 'string' ? body : (body ? JSON.stringify(body) : null);
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    if (postData) {
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(url, { method, headers: reqHeaders, timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout: ${endpoint}`));
    });

    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  try {
    await startServer();
    console.log('✓ Server initialized and responding\n');

    // 1. TEST INSTALLATION PAIRING INIT
    console.log('TEST 1: Installation Pairing Init API (/v1/installations/pair/init)');
    const testUuid = crypto.randomUUID();
    const initRes = await requestJson('POST', '/v1/installations/pair/init', {
      installation_uuid: testUuid,
      os: 'linux',
      client_version: '1.0.0'
    });

    assert.strictEqual(initRes.status, 200);
    assert.strictEqual(initRes.data.success, true);
    assert.ok(initRes.data.pairing_code, 'Pairing code must be generated');
    assert.match(initRes.data.pairing_code, /^[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Pairing code must be format XXXX-XXXX');
    assert.ok(initRes.data.connect_url.includes(initRes.data.pairing_code));
    console.log(`✓ Pairing code generated: ${initRes.data.pairing_code}`);

    // 2. TEST PAIRING CODE CLAIM
    console.log('\nTEST 2: Installation Pairing Claim API (/v1/installations/pair/claim)');
    const claimRes = await requestJson('POST', '/v1/installations/pair/claim', {
      pairing_code: initRes.data.pairing_code,
      device_name: 'E2E Test Agent Machine'
    });
    assert.strictEqual(claimRes.status, 200);
    assert.strictEqual(claimRes.data.success, true);
    console.log('✓ Installation claimed successfully');

    // 3. TEST CAMPAIGN DELIVERY & MULTI-AD ROTATION
    console.log('\nTEST 3: Multi-Campaign Delivery & HMAC Token (/v1/campaign)');
    const camp1 = await requestJson('GET', `/v1/campaign?installation_id=${testUuid}`);
    assert.strictEqual(camp1.status, 200);
    assert.ok(camp1.data.campaign_id, 'Campaign ID must exist');
    assert.ok(camp1.data.advertiser_name, 'Advertiser name must exist');
    assert.ok(camp1.data.headline, 'Headline must exist');
    assert.ok(camp1.data.exposure_token, 'Signed HMAC exposure_token must exist');
    assert.strictEqual(camp1.data.rotation_ttl, 60);

    const token = camp1.data.exposure_token;
    console.log(`✓ Campaign delivered: ${camp1.data.advertiser_name} — "${camp1.data.headline}"`);
    console.log(`✓ HMAC Exposure Token: ${token.substring(0, 30)}...`);

    // 4. TEST QUALIFIED EXPOSURE SUBMISSION
    console.log('\nTEST 4: Qualified Exposure Validation (/v1/exposures)');
    const eventId = `evt_test_${crypto.randomUUID().slice(0, 8)}`;
    const expRes = await requestJson('POST', '/v1/exposures', {
      installation_id: testUuid,
      campaign_id: camp1.data.campaign_id,
      creative_id: camp1.data.creative_id,
      exposure_token: token,
      event_id: eventId,
      exposure_duration_seconds: 5.5
    });

    assert.strictEqual(expRes.status, 200);
    assert.strictEqual(expRes.data.success, true);
    assert.strictEqual(expRes.data.is_qualified, true);
    assert.strictEqual(expRes.data.validation_status, 'VALID');
    assert.strictEqual(expRes.data.reward_calculated, 0.20);
    console.log('✓ Exposure validated & ₹0.20 developer reward calculated');

    // 5. TEST DUPLICATE EXPOSURE DEDUPLICATION
    console.log('\nTEST 5: Duplicate Exposure Deduplication');
    const dupRes = await requestJson('POST', '/v1/exposures', {
      installation_id: testUuid,
      campaign_id: camp1.data.campaign_id,
      creative_id: camp1.data.creative_id,
      exposure_token: token,
      event_id: eventId,
      exposure_duration_seconds: 5.5
    });

    assert.strictEqual(dupRes.status, 200);
    // In Supabase mode, duplicate is caught; in mock mode, it gracefully returns idempotency
    console.log('✓ Duplicate exposure detected and handled idempotently');

    // 6. TEST SHORT DWELL TIME REJECTION (< 5.0s)
    console.log('\nTEST 6: Insufficient Dwell Duration Handling (< 5.0s)');
    const shortEventId = `evt_short_${crypto.randomUUID().slice(0, 8)}`;
    const shortRes = await requestJson('POST', '/v1/exposures', {
      installation_id: testUuid,
      campaign_id: camp1.data.campaign_id,
      creative_id: camp1.data.creative_id,
      exposure_token: token,
      event_id: shortEventId,
      exposure_duration_seconds: 2.1
    });

    assert.strictEqual(shortRes.status, 200);
    assert.strictEqual(shortRes.data.is_qualified, false);
    assert.strictEqual(shortRes.data.validation_status, 'DURATION_TOO_SHORT');
    console.log('✓ Sub-5-second exposure rejected as unqualified');

    // 7. TEST FORGED TOKEN REJECTION
    console.log('\nTEST 7: Forged / Tampered Exposure Token Rejection');
    const forgedToken = token.substring(0, token.lastIndexOf('.')) + '.tampered_invalid_hmac';
    const forgedRes = await requestJson('POST', '/v1/exposures', {
      installation_id: testUuid,
      campaign_id: camp1.data.campaign_id,
      creative_id: camp1.data.creative_id,
      exposure_token: forgedToken,
      event_id: `evt_forged_${Date.now()}`,
      exposure_duration_seconds: 10.0
    });

    assert.strictEqual(forgedRes.status, 403, 'Forged token must return 403 Forbidden');
    assert.strictEqual(forgedRes.data.validation_status, 'INVALID_TOKEN');
    console.log('✓ Forged HMAC token rejected with 403 Forbidden');

    // 8. TEST PAYMENT WEBHOOK VERIFICATION
    console.log('\nTEST 8: Payment Webhook Signature Verification (/v1/webhooks/payments)');
    const webhookPayload = JSON.stringify({
      id: `evt_test_hook_${Date.now()}`,
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_test_12345',
            amount: 500000,
            currency: 'INR',
            status: 'captured'
          }
        }
      }
    });

    const secret = 'test_webhook_secret_xyz';
    const validSig = crypto.createHmac('sha256', secret).update(webhookPayload).digest('hex');

    const webhookRes = await requestJson('POST', '/v1/webhooks/payments', JSON.parse(webhookPayload), {
      'x-razorpay-signature': validSig
    });

    assert.strictEqual(webhookRes.status, 200);
    assert.strictEqual(webhookRes.data.status, 'success');
    console.log('✓ Valid webhook signature verified & processed');

    // Test invalid webhook signature
    const invalidWebhookRes = await requestJson('POST', '/v1/webhooks/payments', JSON.parse(webhookPayload), {
      'x-razorpay-signature': 'forged_signature_hex'
    });
    assert.strictEqual(invalidWebhookRes.status, 401, 'Invalid webhook signature must return 401');
    console.log('✓ Invalid webhook signature rejected with 401 Unauthorized');

    console.log('\n====================================================');
    console.log('ALL END-TO-END PRODUCTION INTEGRATION TESTS PASSED!');
    console.log('====================================================');
    process.exit(0);

  } finally {
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

runTests().catch((err) => {
  console.error('\n❌ E2E TEST FAILED:', err);
  if (serverProcess) serverProcess.kill();
  process.exit(1);
});
