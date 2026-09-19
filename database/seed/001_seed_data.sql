-- database/seed/001_seed_data.sql

-- Dummy advertiser user
INSERT INTO users (id, email, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000001', 'demo@cloudforge.example.com', 'CloudForge Demo', 'advertiser')
ON CONFLICT (email) DO NOTHING;

-- Advertiser
INSERT INTO advertisers (id, user_id, company_name, contact_email)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'CloudForge Demo', 'demo@cloudforge.example.com')
ON CONFLICT (id) DO NOTHING;

-- Demo active campaign
INSERT INTO campaigns (id, advertiser_id, campaign_name, headline, description, destination_url, creative_version, budget, status)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000002',
    'Deploy AI Backend',
    'Deploy your AI backend in seconds',
    'GPU infrastructure built for developers.',
    'https://example.com',
    'v1.0',
    10000.00,
    'ACTIVE'
)
ON CONFLICT (id) DO NOTHING;

-- Demo Developer User
INSERT INTO users (id, email, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000004', 'dev@example.com', 'Dev Demo', 'developer')
ON CONFLICT (email) DO NOTHING;

-- Demo Installation
INSERT INTO installations (id, user_id, installation_uuid, os, client_version, status)
VALUES (
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000004',
    '11111111-1111-1111-1111-111111111111',
    'linux',
    '1.0.0',
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- Demo Session
INSERT INTO sessions (id, installation_id, conversation_id, status, started_at)
VALUES (
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000005',
    'conv_001',
    'active',
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Demo Impression
INSERT INTO impressions (id, session_id, campaign_id, installation_id, event_id, exposure_duration, is_eligible)
VALUES (
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000005',
    'evt_001',
    5000,
    true
)
ON CONFLICT (id) DO NOTHING;
