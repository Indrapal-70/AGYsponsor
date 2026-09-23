-- =====================================================
-- AGENTSPONSOR PRODUCTION SUPABASE DATABASE SCHEMA
-- File: queries.txt
-- Self-contained, dependency-ordered, executable in order
-- =====================================================

-- =====================================================
-- 01 EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 02 TYPES / ENUMS
-- =====================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_type') THEN
        CREATE TYPE user_role_type AS ENUM ('CONSUMER', 'SPONSOR', 'ADMIN');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'installation_status') THEN
        CREATE TYPE installation_status AS ENUM ('ACTIVE', 'DISABLED', 'SUSPENDED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pairing_code_status') THEN
        CREATE TYPE pairing_code_status AS ENUM ('PENDING', 'CLAIMED', 'EXPIRED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'campaign_status') THEN
        CREATE TYPE campaign_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'REJECTED', 'ARCHIVED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exposure_validation_status') THEN
        CREATE TYPE exposure_validation_status AS ENUM ('PENDING', 'VALID', 'DUPLICATE', 'RATE_LIMITED', 'INVALID_TOKEN', 'FRAUD_SUSPECTED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ledger_entry_type') THEN
        CREATE TYPE ledger_entry_type AS ENUM ('EXPOSURE_REWARD', 'BONUS', 'ADJUSTMENT', 'PAYOUT_RESERVATION', 'PAYOUT_COMPLETED', 'REVERSAL');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ledger_status') THEN
        CREATE TYPE ledger_status AS ENUM ('PENDING', 'AVAILABLE', 'PAID', 'REVERSED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payout_status') THEN
        CREATE TYPE payout_status AS ENUM ('PENDING_REVIEW', 'HELD', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED', 'FAILED');
    END IF;
END $$;

-- =====================================================
-- 03 TABLES
-- =====================================================

-- 3.1 Profiles (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.2 User Roles (RBAC: CONSUMER, SPONSOR, ADMIN)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role_type NOT NULL DEFAULT 'CONSUMER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_roles_user_role_unique UNIQUE (user_id, role)
);

-- 3.3 Installations (CLI client instances)
CREATE TABLE IF NOT EXISTS public.installations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    installation_uuid UUID UNIQUE NOT NULL,
    device_name TEXT,
    os TEXT,
    client_version TEXT,
    status installation_status NOT NULL DEFAULT 'ACTIVE',
    is_paired BOOLEAN NOT NULL DEFAULT false,
    paired_at TIMESTAMPTZ,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.4 Installation Pairing Codes (short-lived code for connecting CLI to web account)
CREATE TABLE IF NOT EXISTS public.installation_pairing_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    installation_uuid UUID NOT NULL,
    pairing_code TEXT UNIQUE NOT NULL,
    status pairing_code_status NOT NULL DEFAULT 'PENDING',
    expires_at TIMESTAMPTZ NOT NULL,
    claimed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    claimed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.5 Sponsor Organizations
CREATE TABLE IF NOT EXISTS public.sponsor_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    billing_email TEXT NOT NULL,
    website_url TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.6 Sponsor Organization Members
CREATE TABLE IF NOT EXISTS public.sponsor_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.sponsor_organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('OWNER', 'ADMIN', 'MEMBER')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT sponsor_members_org_user_unique UNIQUE (org_id, user_id)
);

-- 3.7 Sponsor Subscription Plans
CREATE TABLE IF NOT EXISTS public.sponsor_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    monthly_price_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    included_budget_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    campaign_limit INT NOT NULL DEFAULT 1,
    creative_limit INT NOT NULL DEFAULT 2,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.8 Sponsor Subscriptions
CREATE TABLE IF NOT EXISTS public.sponsor_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.sponsor_organizations(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.sponsor_plans(id) ON DELETE RESTRICT,
    provider TEXT NOT NULL DEFAULT 'MOCK' CHECK (provider IN ('MOCK', 'RAZORPAY', 'STRIPE', 'CASHFREE')),
    provider_sub_id TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAST_DUE', 'CANCELED', 'PAUSED')),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.9 Campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.sponsor_organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status campaign_status NOT NULL DEFAULT 'PENDING_REVIEW',
    rejection_reason TEXT,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    priority_weight INT NOT NULL DEFAULT 100 CHECK (priority_weight >= 1),
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.10 Campaign Creatives
CREATE TABLE IF NOT EXISTS public.campaign_creatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    advertiser_name VARCHAR(60) NOT NULL,
    headline VARCHAR(120) NOT NULL,
    description VARCHAR(255),
    destination_url TEXT NOT NULL,
    creative_version INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.11 Campaign Budgets
CREATE TABLE IF NOT EXISTS public.campaign_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID UNIQUE NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    total_budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_budget >= 0),
    remaining_budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (remaining_budget >= 0),
    daily_budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (daily_budget >= 0),
    spent_today NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (spent_today >= 0),
    total_spent NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_spent >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.12 Campaign Delivery Settings
CREATE TABLE IF NOT EXISTS public.campaign_delivery_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID UNIQUE NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    frequency_cap_hours INT NOT NULL DEFAULT 1 CHECK (frequency_cap_hours >= 0),
    max_impressions_per_day INT NOT NULL DEFAULT 1000 CHECK (max_impressions_per_day >= 1),
    priority_weight INT NOT NULL DEFAULT 100 CHECK (priority_weight >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.13 Agent Sessions
CREATE TABLE IF NOT EXISTS public.agent_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    installation_id UUID NOT NULL REFERENCES public.installations(id) ON DELETE CASCADE,
    conversation_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'ABORTED')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.14 Ad Exposures
CREATE TABLE IF NOT EXISTS public.ad_exposures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE RESTRICT,
    creative_id UUID NOT NULL REFERENCES public.campaign_creatives(id) ON DELETE RESTRICT,
    installation_id UUID NOT NULL REFERENCES public.installations(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.agent_sessions(id) ON DELETE SET NULL,
    exposure_token TEXT NOT NULL,
    event_id TEXT UNIQUE NOT NULL,
    exposure_duration_seconds NUMERIC(8, 2) NOT NULL DEFAULT 5.0,
    is_qualified BOOLEAN NOT NULL DEFAULT false,
    validation_status exposure_validation_status NOT NULL DEFAULT 'PENDING',
    qualification_reason TEXT,
    reward_calculated NUMERIC(10, 4) NOT NULL DEFAULT 0.0000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.15 Ad Clicks
CREATE TABLE IF NOT EXISTS public.ad_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exposure_id UUID REFERENCES public.ad_exposures(id) ON DELETE SET NULL,
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    installation_id UUID REFERENCES public.installations(id) ON DELETE SET NULL,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    referrer TEXT,
    ip_hash TEXT
);

-- 3.16 Earnings Ledger (Append-only immutable financial records)
CREATE TABLE IF NOT EXISTS public.earnings_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    installation_id UUID REFERENCES public.installations(id) ON DELETE SET NULL,
    exposure_id UUID REFERENCES public.ad_exposures(id) ON DELETE SET NULL,
    entry_type ledger_entry_type NOT NULL,
    amount NUMERIC(10, 4) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status ledger_status NOT NULL DEFAULT 'PENDING',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.17 Earnings Balances (Atomic calculated cache derived from ledger)
CREATE TABLE IF NOT EXISTS public.earnings_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_earned NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    pending_balance NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    available_balance NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    paid_balance NUMERIC(12, 4) NOT NULL DEFAULT 0.0000,
    currency TEXT NOT NULL DEFAULT 'INR',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.18 Payout Accounts (User withdrawal destinations)
CREATE TABLE IF NOT EXISTS public.payout_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    account_type TEXT NOT NULL CHECK (account_type IN ('UPI', 'BANK_TRANSFER')),
    account_identifier TEXT NOT NULL,
    holder_name TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT true,
    is_default BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DISABLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.19 Payout Requests
CREATE TABLE IF NOT EXISTS public.payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    payout_account_id UUID NOT NULL REFERENCES public.payout_accounts(id) ON DELETE RESTRICT,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 50.00),
    currency TEXT NOT NULL DEFAULT 'INR',
    status payout_status NOT NULL DEFAULT 'PENDING_REVIEW',
    rejection_reason TEXT,
    admin_notes TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.20 Payout Transactions
CREATE TABLE IF NOT EXISTS public.payout_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payout_request_id UUID NOT NULL REFERENCES public.payout_requests(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'MOCK' CHECK (provider IN ('MOCK', 'RAZORPAYX', 'CASHFREE')),
    provider_payout_id TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'QUEUED', 'PROCESSED', 'REVERSED', 'FAILED')),
    failure_reason TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.21 Payment Customers
CREATE TABLE IF NOT EXISTS public.payment_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.sponsor_organizations(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'MOCK',
    provider_customer_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.22 Payment Transactions
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.sponsor_organizations(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    provider TEXT NOT NULL DEFAULT 'MOCK',
    provider_payment_id TEXT UNIQUE,
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'SUCCESS' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.23 Payment Webhook Events (Idempotency and audit)
CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    provider_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    payload_hash TEXT NOT NULL,
    payload JSONB NOT NULL,
    processing_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (processing_status IN ('PENDING', 'PROCESSED', 'FAILED', 'DUPLICATE')),
    error_message TEXT,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- 3.24 Fraud Signals
CREATE TABLE IF NOT EXISTS public.fraud_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    installation_id UUID REFERENCES public.installations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    signal_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'LOW' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.25 Fraud Reviews
CREATE TABLE IF NOT EXISTS public.fraud_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type TEXT NOT NULL CHECK (target_type IN ('USER', 'INSTALLATION', 'PAYOUT')),
    target_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'CLEARED', 'BLOCKED')),
    reviewer_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.26 Admin Actions
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.27 Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id UUID,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3.28 Platform Settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 04 INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_installations_user_id ON public.installations(user_id);
CREATE INDEX IF NOT EXISTS idx_installations_uuid ON public.installations(installation_uuid);
CREATE INDEX IF NOT EXISTS idx_pairing_codes_code ON public.installation_pairing_codes(pairing_code);
CREATE INDEX IF NOT EXISTS idx_pairing_codes_status ON public.installation_pairing_codes(status);
CREATE INDEX IF NOT EXISTS idx_sponsor_members_user_id ON public.sponsor_members(user_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_members_org_id ON public.sponsor_members(org_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_org_id ON public.campaigns(org_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_creatives_campaign_id ON public.campaign_creatives(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_exposures_event_id ON public.ad_exposures(event_id);
CREATE INDEX IF NOT EXISTS idx_ad_exposures_campaign_id ON public.ad_exposures(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_exposures_installation_id ON public.ad_exposures(installation_id);
CREATE INDEX IF NOT EXISTS idx_earnings_ledger_user_id ON public.earnings_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_earnings_ledger_status ON public.earnings_ledger(status);
CREATE INDEX IF NOT EXISTS idx_payout_requests_user_id ON public.payout_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payout_requests_status ON public.payout_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_event_id ON public.payment_webhook_events(provider_event_id);
CREATE INDEX IF NOT EXISTS idx_fraud_signals_installation_id ON public.fraud_signals(installation_id);

-- =====================================================
-- 05 FUNCTIONS
-- =====================================================

-- 5.1 RBAC Check Function
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = p_user_id AND role = 'ADMIN'
    );
$$;

-- 5.2 Auto-create profile and consumer role on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url);

    -- Ensure default CONSUMER role exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'CONSUMER')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Initialize earnings balances record
    INSERT INTO public.earnings_balances (user_id, total_earned, pending_balance, available_balance, paid_balance)
    VALUES (NEW.id, 0.0000, 0.0000, 0.0000, 0.0000)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- 5.3 Synchronize earnings balances whenever ledger changes
CREATE OR REPLACE FUNCTION public.sync_earnings_balances()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_total NUMERIC(12, 4);
    v_pending NUMERIC(12, 4);
    v_available NUMERIC(12, 4);
    v_paid NUMERIC(12, 4);
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_user_id := OLD.user_id;
    ELSE
        v_user_id := NEW.user_id;
    END IF;

    -- Total earned = all positive non-reversed entries
    SELECT COALESCE(SUM(amount), 0.0000)
    INTO v_total
    FROM public.earnings_ledger
    WHERE user_id = v_user_id
      AND amount > 0
      AND status IN ('AVAILABLE', 'PAID');

    -- Pending balance = positive pending entries
    SELECT COALESCE(SUM(amount), 0.0000)
    INTO v_pending
    FROM public.earnings_ledger
    WHERE user_id = v_user_id
      AND amount > 0
      AND status = 'PENDING';

    -- Available balance = net available (credits minus reservations)
    SELECT COALESCE(SUM(amount), 0.0000)
    INTO v_available
    FROM public.earnings_ledger
    WHERE user_id = v_user_id
      AND status = 'AVAILABLE';

    -- Paid balance = paid amounts
    SELECT COALESCE(ABS(SUM(amount)), 0.0000)
    INTO v_paid
    FROM public.earnings_ledger
    WHERE user_id = v_user_id
      AND status = 'PAID'
      AND entry_type = 'PAYOUT_COMPLETED';

    INSERT INTO public.earnings_balances (user_id, total_earned, pending_balance, available_balance, paid_balance, updated_at)
    VALUES (v_user_id, v_total, v_pending, GREATEST(0.0000, v_available), v_paid, NOW())
    ON CONFLICT (user_id) DO UPDATE
    SET total_earned = EXCLUDED.total_earned,
        pending_balance = EXCLUDED.pending_balance,
        available_balance = EXCLUDED.available_balance,
        paid_balance = EXCLUDED.paid_balance,
        updated_at = NOW();

    RETURN NEW;
END;
$$;

-- 5.4 Claim Pairing Code RPC
CREATE OR REPLACE FUNCTION public.claim_pairing_code(p_code TEXT, p_device_name TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_record public.installation_pairing_codes%ROWTYPE;
BEGIN
    IF v_uid IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Authentication required');
    END IF;

    -- Find active unexpired pairing code
    SELECT * INTO v_record
    FROM public.installation_pairing_codes
    WHERE pairing_code = UPPER(TRIM(p_code))
      AND status = 'PENDING'
      AND expires_at > NOW()
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired pairing code');
    END IF;

    -- Update pairing code status
    UPDATE public.installation_pairing_codes
    SET status = 'CLAIMED',
        claimed_by = v_uid,
        claimed_at = NOW()
    WHERE id = v_record.id;

    -- Link installation to user profile
    INSERT INTO public.installations (
        installation_uuid,
        user_id,
        device_name,
        is_paired,
        paired_at,
        status,
        last_seen_at
    )
    VALUES (
        v_record.installation_uuid,
        v_uid,
        COALESCE(p_device_name, 'AgentSponsor CLI'),
        true,
        NOW(),
        'ACTIVE',
        NOW()
    )
    ON CONFLICT (installation_uuid) DO UPDATE
    SET user_id = EXCLUDED.user_id,
        device_name = COALESCE(p_device_name, public.installations.device_name),
        is_paired = true,
        paired_at = NOW(),
        status = 'ACTIVE',
        last_seen_at = NOW();

    RETURN jsonb_build_object(
        'success', true,
        'installation_uuid', v_record.installation_uuid,
        'message', 'Installation linked successfully'
    );
END;
$$;

-- 5.5 Deduct Campaign Budget Atomically
CREATE OR REPLACE FUNCTION public.deduct_campaign_budget(p_campaign_id UUID, p_cost NUMERIC)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_remaining NUMERIC;
BEGIN
    SELECT remaining_budget INTO v_remaining
    FROM public.campaign_budgets
    WHERE campaign_id = p_campaign_id
    FOR UPDATE;

    IF v_remaining IS NULL OR v_remaining < p_cost THEN
        RETURN false;
    END IF;

    UPDATE public.campaign_budgets
    SET remaining_budget = remaining_budget - p_cost,
        spent_today = spent_today + p_cost,
        total_spent = total_spent + p_cost,
        updated_at = NOW()
    WHERE campaign_id = p_campaign_id;

    RETURN true;
END;
$$;

-- =====================================================
-- 06 TRIGGERS
-- =====================================================

-- Trigger on auth.users creation (if auth schema exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger on earnings_ledger changes to auto-update earnings_balances
DROP TRIGGER IF EXISTS on_ledger_entry_changed ON public.earnings_ledger;
CREATE TRIGGER on_ledger_entry_changed
    AFTER INSERT OR UPDATE OR DELETE ON public.earnings_ledger
    FOR EACH ROW EXECUTE FUNCTION public.sync_earnings_balances();

-- =====================================================
-- 07 RLS (ENABLE ON ALL TABLES)
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installation_pairing_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_exposures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.earnings_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 08 RLS POLICIES
-- =====================================================

-- Helper macro: drop existing policy before recreating
DO $$
BEGIN
    -- Profiles policies
    DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
    DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
    DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;

    -- User Roles policies
    DROP POLICY IF EXISTS "user_roles_select_own" ON public.user_roles;
    DROP POLICY IF EXISTS "user_roles_admin_all" ON public.user_roles;

    -- Installations policies
    DROP POLICY IF EXISTS "installations_select_own" ON public.installations;
    DROP POLICY IF EXISTS "installations_update_own" ON public.installations;
    DROP POLICY IF EXISTS "installations_admin_all" ON public.installations;

    -- Pairing codes policies
    DROP POLICY IF EXISTS "pairing_codes_auth_claim" ON public.installation_pairing_codes;
    DROP POLICY IF EXISTS "pairing_codes_admin_all" ON public.installation_pairing_codes;

    -- Sponsor orgs policies
    DROP POLICY IF EXISTS "sponsor_orgs_select_member" ON public.sponsor_organizations;
    DROP POLICY IF EXISTS "sponsor_orgs_admin_all" ON public.sponsor_organizations;

    -- Campaigns policies
    DROP POLICY IF EXISTS "campaigns_select_sponsor" ON public.campaigns;
    DROP POLICY IF EXISTS "campaigns_admin_all" ON public.campaigns;

    -- Creatives policies
    DROP POLICY IF EXISTS "creatives_select_sponsor" ON public.campaign_creatives;
    DROP POLICY IF EXISTS "creatives_admin_all" ON public.campaign_creatives;

    -- Earnings ledger policies
    DROP POLICY IF EXISTS "earnings_select_own" ON public.earnings_ledger;
    DROP POLICY IF EXISTS "earnings_admin_all" ON public.earnings_ledger;

    -- Earnings balances policies
    DROP POLICY IF EXISTS "balances_select_own" ON public.earnings_balances;
    DROP POLICY IF EXISTS "balances_admin_all" ON public.earnings_balances;

    -- Payout accounts policies
    DROP POLICY IF EXISTS "payout_accounts_all_own" ON public.payout_accounts;
    DROP POLICY IF EXISTS "payout_accounts_admin_all" ON public.payout_accounts;

    -- Payout requests policies
    DROP POLICY IF EXISTS "payout_requests_all_own" ON public.payout_requests;
    DROP POLICY IF EXISTS "payout_requests_admin_all" ON public.payout_requests;

    -- Plans policies
    DROP POLICY IF EXISTS "plans_public_read" ON public.sponsor_plans;
    DROP POLICY IF EXISTS "plans_admin_all" ON public.sponsor_plans;

    -- Platform settings policies
    DROP POLICY IF EXISTS "platform_settings_public_read" ON public.platform_settings;
    DROP POLICY IF EXISTS "platform_settings_admin_all" ON public.platform_settings;
END $$;

-- 8.1 Profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (public.is_admin(auth.uid()));

-- 8.2 User Roles
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL USING (public.is_admin(auth.uid()));

-- 8.3 Installations
CREATE POLICY "installations_select_own" ON public.installations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "installations_update_own" ON public.installations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "installations_admin_all" ON public.installations FOR ALL USING (public.is_admin(auth.uid()));

-- 8.4 Sponsor Plans (Public readable)
CREATE POLICY "plans_public_read" ON public.sponsor_plans FOR SELECT USING (is_active = true);
CREATE POLICY "plans_admin_all" ON public.sponsor_plans FOR ALL USING (public.is_admin(auth.uid()));

-- 8.5 Sponsor Organizations & Members
CREATE POLICY "sponsor_orgs_select_member" ON public.sponsor_organizations FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.sponsor_members WHERE org_id = public.sponsor_organizations.id AND user_id = auth.uid()));
CREATE POLICY "sponsor_orgs_admin_all" ON public.sponsor_organizations FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "sponsor_members_select_org" ON public.sponsor_members FOR SELECT
    USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "sponsor_members_admin_all" ON public.sponsor_members FOR ALL USING (public.is_admin(auth.uid()));

-- 8.6 Campaigns & Creatives
CREATE POLICY "campaigns_select_sponsor" ON public.campaigns FOR ALL
    USING (EXISTS (SELECT 1 FROM public.sponsor_members WHERE org_id = public.campaigns.org_id AND user_id = auth.uid()));
CREATE POLICY "campaigns_admin_all" ON public.campaigns FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "creatives_select_sponsor" ON public.campaign_creatives FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.campaigns c
        JOIN public.sponsor_members m ON m.org_id = c.org_id
        WHERE c.id = public.campaign_creatives.campaign_id AND m.user_id = auth.uid()
    ));
CREATE POLICY "creatives_admin_all" ON public.campaign_creatives FOR ALL USING (public.is_admin(auth.uid()));

-- 8.7 Earnings Ledger & Balances
CREATE POLICY "earnings_select_own" ON public.earnings_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "earnings_admin_all" ON public.earnings_ledger FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "balances_select_own" ON public.earnings_balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "balances_admin_all" ON public.earnings_balances FOR ALL USING (public.is_admin(auth.uid()));

-- 8.8 Payouts
CREATE POLICY "payout_accounts_all_own" ON public.payout_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "payout_accounts_admin_all" ON public.payout_accounts FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "payout_requests_all_own" ON public.payout_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payout_requests_insert_own" ON public.payout_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "payout_requests_admin_all" ON public.payout_requests FOR ALL USING (public.is_admin(auth.uid()));

-- 8.9 Platform Settings
CREATE POLICY "platform_settings_public_read" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "platform_settings_admin_all" ON public.platform_settings FOR ALL USING (public.is_admin(auth.uid()));

-- =====================================================
-- 09 VIEWS
-- =====================================================
CREATE OR REPLACE VIEW public.active_eligible_campaigns AS
SELECT 
    c.id AS campaign_id,
    c.org_id,
    c.name AS campaign_name,
    c.priority_weight,
    cr.id AS creative_id,
    cr.advertiser_name,
    cr.headline,
    cr.description,
    cr.destination_url,
    cr.creative_version,
    b.remaining_budget,
    b.daily_budget,
    b.spent_today,
    ds.frequency_cap_hours
FROM public.campaigns c
JOIN public.campaign_creatives cr ON cr.campaign_id = c.id AND cr.is_active = true
JOIN public.campaign_budgets b ON b.campaign_id = c.id
LEFT JOIN public.campaign_delivery_settings ds ON ds.campaign_id = c.id
WHERE c.status = 'ACTIVE'
  AND b.remaining_budget > 0
  AND (b.daily_budget = 0 OR b.spent_today < b.daily_budget)
  AND (c.end_date IS NULL OR c.end_date > NOW());

-- =====================================================
-- 10 SEED / DEMO DATA
-- =====================================================

-- 10.1 Platform Default Settings
INSERT INTO public.platform_settings (key, value, description)
VALUES 
('consumer_reward_rate', '0.20'::jsonb, 'Developer reward per qualified exposure in INR (₹0.20)'),
('platform_share_rate', '0.30'::jsonb, 'Platform fee per exposure in INR (₹0.30)'),
('min_exposure_seconds', '5.0'::jsonb, 'Minimum active duration required to qualify an impression'),
('min_payout_amount_inr', '50.0'::jsonb, 'Minimum withdrawal threshold in INR (₹50)'),
('default_rotation_ttl', '60'::jsonb, 'Default cache TTL in seconds for CLI client rotation')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 10.2 Sponsor Subscription Plans
INSERT INTO public.sponsor_plans (name, slug, monthly_price_inr, included_budget_inr, campaign_limit, creative_limit, features, is_active)
VALUES
('Starter Sponsor', 'starter', 4999.00, 4000.00, 1, 2, '["1 Active Campaign", "2 Creatives", "Standard Placement", "Basic Analytics"]'::jsonb, true),
('Growth Sponsor', 'growth', 14999.00, 12500.00, 3, 6, '["3 Active Campaigns", "6 Creatives", "Priority Weighting", "Detailed Conversion Analytics"]'::jsonb, true),
('Scale Sponsor', 'scale', 39999.00, 35000.00, 10, 20, '["10 Active Campaigns", "20 Creatives", "Max Priority", "Realtime Webhooks", "Dedicated Account Manager"]'::jsonb, true)
ON CONFLICT (slug) DO UPDATE
SET monthly_price_inr = EXCLUDED.monthly_price_inr,
    included_budget_inr = EXCLUDED.included_budget_inr,
    features = EXCLUDED.features;

-- =====================================================
-- 11 CRON / SCHEDULED JOBS (DOCUMENTATION / PG_CRON)
-- =====================================================
-- MANUAL DASHBOARD STEP:
-- In Supabase Dashboard -> Database -> Extensions -> Enable "pg_cron" if daily budget reset automation is desired.
-- Once enabled, run:
-- SELECT cron.schedule('reset-daily-campaign-budgets', '0 0 * * *', $$
--     UPDATE public.campaign_budgets
--     SET spent_today = 0.00,
--         last_reset_date = CURRENT_DATE
--     WHERE last_reset_date < CURRENT_DATE;
-- $$);

-- =====================================================
-- 12 VERIFICATION QUERIES
-- =====================================================
-- Run these queries to verify that all tables, views, and seed data were created:
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
SELECT * FROM public.sponsor_plans;
SELECT * FROM public.platform_settings;
SELECT count(*) FROM public.active_eligible_campaigns;
