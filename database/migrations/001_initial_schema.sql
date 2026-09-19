-- database/migrations/001_initial_schema.sql
-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'developer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. installations
CREATE TABLE installations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    installation_uuid UUID NOT NULL,
    os TEXT,
    client_version TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. advertisers
CREATE TABLE advertisers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. campaigns
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advertiser_id UUID REFERENCES advertisers(id) ON DELETE CASCADE,
    campaign_name TEXT NOT NULL,
    headline TEXT NOT NULL,
    description TEXT,
    destination_url TEXT,
    creative_version TEXT,
    budget DECIMAL(10, 2),
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    installation_id UUID REFERENCES installations(id) ON DELETE CASCADE,
    conversation_id TEXT,
    status TEXT,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ
);

-- 6. impressions
CREATE TABLE impressions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    installation_id UUID REFERENCES installations(id) ON DELETE CASCADE,
    event_id TEXT,
    exposure_duration INTEGER,
    is_eligible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. earnings
CREATE TABLE earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id),
    impression_id UUID REFERENCES impressions(id),
    gross_revenue DECIMAL(10, 4),
    developer_share DECIMAL(10, 4),
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. payouts
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2),
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending',
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- 9. audit_logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_installations_user_id ON installations(user_id);
CREATE INDEX idx_installations_uuid ON installations(installation_uuid);
CREATE INDEX idx_campaigns_advertiser_id ON campaigns(advertiser_id);
CREATE INDEX idx_impressions_session_id ON impressions(session_id);
CREATE INDEX idx_impressions_campaign_id ON impressions(campaign_id);
CREATE INDEX idx_impressions_created_at ON impressions(created_at);
CREATE INDEX idx_earnings_user_id ON earnings(user_id);
CREATE INDEX idx_payouts_user_id ON payouts(user_id);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
