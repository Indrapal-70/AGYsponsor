const assert = require('assert');
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const pluginDir = path.resolve(__dirname, '..');
const hookScript = path.join(pluginDir, 'scripts', 'statusline.js');
const statuslineScript = path.join(pluginDir, 'scripts', 'agentsponsor-statusline.js');
const utilities = require('../scripts/utilities');

console.log('Running plugin unit tests...');

// 1. URL validation test
assert.strictEqual(utilities.isValidHttpUrl('https://example.com'), true);
assert.strictEqual(utilities.isValidHttpUrl('http://localhost:8000'), true);
assert.strictEqual(utilities.isValidHttpUrl('javascript:alert(1)'), false);
assert.strictEqual(utilities.isValidHttpUrl('data:text/html,<script>'), false);
assert.strictEqual(utilities.isValidHttpUrl('file:///etc/passwd'), false);
console.log('✓ URL validation tests passed');

// 2. formatMessage test
const sampleCampaign = {
    campaign_id: 'cmp_demo_001',
    advertiser_name: 'CloudForge Demo',
    headline: 'Deploy your AI backend in seconds',
    destination_url: 'https://example.com'
};
const formatted = utilities.formatMessage(sampleCampaign);
assert.ok(formatted.includes('Sponsored · CloudForge Demo'));
assert.ok(formatted.includes('Deploy your AI backend in seconds'));
assert.ok(formatted.includes('https://example.com'));
console.log('✓ formatMessage test passed');

// 3. Hooks test: PreInvocation must NOT inject visual ad into stream anymore
const runHook = (hookType, inputObj = {}) => {
    const res = spawnSync(process.execPath, [hookScript, hookType], {
        input: JSON.stringify(inputObj),
        cwd: pluginDir,
        encoding: 'utf8'
    });
    assert.strictEqual(res.status, 0, res.stderr);
    return JSON.parse(res.stdout);
};

const preInvocOutput = runHook('PreInvocation', { conversationId: 'test-convo-123' });
assert.deepStrictEqual(preInvocOutput, {}, 'PreInvocation must return clean {} without visual injectSteps');
console.log('✓ PreInvocation telemetry hook test passed (clean {})');

// 4. PreToolUse hook test (must fail open with allow)
const preToolOutput = runHook('PreToolUse', { toolCall: { name: 'run_command' } });
assert.strictEqual(preToolOutput.decision, 'allow');
console.log('✓ PreToolUse hook test passed');

// 5. PostInvocation and Stop hooks
const postInvocOutput = runHook('PostInvocation', { conversationId: 'test-convo-123' });
assert.deepStrictEqual(postInvocOutput, {});
const stopOutput = runHook('Stop', { conversationId: 'test-convo-123' });
assert.deepStrictEqual(stopOutput, {});
console.log('✓ PostInvocation and Stop hook tests passed');

// 6. Custom Status Line Script Tests (agentsponsor-statusline.js)
const os = require('os');
const userConfigDir = path.join(os.homedir(), '.agentsponsor');
if (!fs.existsSync(userConfigDir)) fs.mkdirSync(userConfigDir, { recursive: true });
fs.writeFileSync(path.join(userConfigDir, 'campaign_cache.json'), JSON.stringify({
    timestamp: Date.now(),
    campaign: sampleCampaign
}));

const runStatusLine = (inputObj) => {
    const inputStr = typeof inputObj === 'string' ? inputObj : JSON.stringify(inputObj);
    const res = spawnSync(process.execPath, [statuslineScript], {
        input: inputStr,
        cwd: pluginDir,
        encoding: 'utf8'
    });
    assert.strictEqual(res.status, 0, res.stderr);
    return res.stdout;
};

// Test working state
const workingOut = runStatusLine({ agent_state: 'working', conversation_id: 'test' });
assert.ok(workingOut.includes('Sponsored · CloudForge Demo'));
assert.ok(workingOut.includes('Deploy your AI backend in seconds →'));
console.log('✓ StatusLine working state passed:', workingOut);

// Test idle state (must be empty)
const idleOut = runStatusLine({ agent_state: 'idle', conversation_id: 'test' });
assert.strictEqual(idleOut, '', 'idle state must output empty string');
console.log('✓ StatusLine idle state passed (empty output)');

// Test thinking state
const thinkingOut = runStatusLine({ agent_state: 'thinking', conversation_id: 'test' });
assert.ok(thinkingOut.includes('Sponsored · CloudForge Demo'));
console.log('✓ StatusLine thinking state passed');

// Test tool_use state
const toolUseOut = runStatusLine({ agent_state: 'tool_use', conversation_id: 'test' });
assert.ok(toolUseOut.includes('Sponsored · CloudForge Demo'));
console.log('✓ StatusLine tool_use state passed');

// Test narrow terminal width truncation
const narrowOut = runStatusLine({ agent_state: 'working', terminal_columns: 35 });
assert.ok(narrowOut.length <= 35, 'Narrow output must not exceed terminal columns');
assert.ok(narrowOut.endsWith('…'), 'Narrow output should end with ellipsis');
console.log('✓ StatusLine narrow terminal width truncation passed:', narrowOut);

// Test malformed JSON handling (fail open)
const malformedOut = runStatusLine('this is not json');
assert.strictEqual(malformedOut, '', 'Malformed input must fail open with empty stdout');
console.log('✓ StatusLine malformed input fail-open passed');

console.log('All plugin and statusline tests passed successfully!');
