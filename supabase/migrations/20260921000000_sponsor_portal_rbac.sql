-- =====================================================
-- AGENTSPONSOR MIGRATION: SPONSOR PORTAL ROLE-BASED ACCESS & RPCs
-- Migration: 20260921000000_sponsor_portal_rbac.sql
-- Idempotent, dependency-ordered, re-runnable
-- =====================================================

-- =====================================================
-- 01 HELPER FUNCTIONS (SECURITY DEFINER, public search_path)
-- =====================================================

-- 1.1 Helper: Check if a user has the SPONSOR role
CREATE OR REPLACE FUNCTION public.is_sponsor(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = p_user_id AND role = 'SPONSOR'
    );
$$;

-- 1.2 Helper: Check if a user is an active member of an organization
CREATE OR REPLACE FUNCTION public.is_org_member(p_org_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.sponsor_members
        WHERE org_id = p_org_id AND user_id = p_user_id
    );
$$;

-- Ensure is_admin exists with search_path = public
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

-- =====================================================
-- 02 INDEXES FOR PERFORMANCE & REPORTING
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_ad_exposures_campaign_created 
    ON public.ad_exposures(campaign_id, created_at) 
    WHERE is_qualified = true AND validation_status = 'VALID';

CREATE INDEX IF NOT EXISTS idx_ad_clicks_campaign_clicked 
    ON public.ad_clicks(campaign_id, clicked_at);

CREATE INDEX IF NOT EXISTS idx_sponsor_members_user_org 
    ON public.sponsor_members(user_id, org_id);

CREATE INDEX IF NOT EXISTS idx_campaigns_org_status 
    ON public.campaigns(org_id, status);

-- =====================================================
-- 03 RPC: REGISTER SPONSOR
-- Idempotent registration of sponsor organization and member role.
-- Never grants ADMIN role.
-- =====================================================
CREATE OR REPLACE FUNCTION public.register_sponsor(
    p_org_name TEXT,
    p_billing_email TEXT,
    p_website_url TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_org_id UUID;
    v_existing_org_id UUID;
    v_plan_id UUID;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'Authentication required to register as sponsor';
    END IF;

    IF TRIM(COALESCE(p_org_name, '')) = '' THEN
        RAISE EXCEPTION 'Organization name is required';
    END IF;

    IF TRIM(COALESCE(p_billing_email, '')) = '' OR p_billing_email NOT LIKE '%@%.%' THEN
        RAISE EXCEPTION 'Valid billing email is required';
    END IF;

    -- Check if user already owns or belongs to an org
    SELECT sm.org_id INTO v_existing_org_id
    FROM public.sponsor_members sm
    WHERE sm.user_id = v_uid
    LIMIT 1;

    IF v_existing_org_id IS NOT NULL THEN
        v_org_id := v_existing_org_id;
        UPDATE public.sponsor_organizations
        SET name = TRIM(p_org_name),
            billing_email = TRIM(p_billing_email),
            website_url = NULLIF(TRIM(COALESCE(p_website_url, '')), ''),
            updated_at = NOW()
        WHERE id = v_org_id;
    ELSE
        -- Create new sponsor organization
        INSERT INTO public.sponsor_organizations (
            name,
            billing_email,
            website_url,
            status,
            created_by
        )
        VALUES (
            TRIM(p_org_name),
            TRIM(p_billing_email),
            NULLIF(TRIM(COALESCE(p_website_url, '')), ''),
            'ACTIVE',
            v_uid
        )
        RETURNING id INTO v_org_id;

        -- Insert caller as OWNER
        INSERT INTO public.sponsor_members (org_id, user_id, role)
        VALUES (v_org_id, v_uid, 'OWNER')
        ON CONFLICT (org_id, user_id) DO UPDATE
        SET role = 'OWNER';

        -- Attach Starter Plan subscription by default
        SELECT id INTO v_plan_id FROM public.sponsor_plans WHERE slug = 'starter' LIMIT 1;
        IF v_plan_id IS NOT NULL THEN
            INSERT INTO public.sponsor_subscriptions (
                org_id,
                plan_id,
                provider,
                status,
                current_period_start,
                current_period_end
            )
            VALUES (
                v_org_id,
                v_plan_id,
                'MOCK',
                'ACTIVE',
                NOW(),
                NOW() + INTERVAL '365 days'
            )
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;

    -- Assign SPONSOR role (idempotent, never grants ADMIN)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_uid, 'SPONSOR')
    ON CONFLICT (user_id, role) DO NOTHING;

    RETURN jsonb_build_object(
        'success', true,
        'org_id', v_org_id,
        'org_name', TRIM(p_org_name),
        'role', 'SPONSOR',
        'message', 'Sponsor organization registered successfully'
    );
END;
$$;

-- =====================================================
-- 04 RPC: CREATE SPONSORSHIP
-- Multi-table atomic insertion with strict server-side validation.
-- Forces status to PENDING_REVIEW and enforces subscription limits.
-- =====================================================
CREATE OR REPLACE FUNCTION public.create_sponsorship(
    p_org_id UUID,
    p_name TEXT,
    p_advertiser_name VARCHAR(60),
    p_headline VARCHAR(120),
    p_description VARCHAR(255),
    p_destination_url TEXT,
    p_total_budget NUMERIC,
    p_daily_budget NUMERIC,
    p_start_date TIMESTAMPTZ DEFAULT NOW(),
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_campaign_id UUID;
    v_plan_campaign_limit INT := 1;
    v_active_campaigns_count INT := 0;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    -- 1. Authorization checks
    IF NOT public.is_sponsor(v_uid) THEN
        RAISE EXCEPTION 'Access denied: Caller does not possess SPONSOR role';
    END IF;

    IF NOT public.is_org_member(p_org_id, v_uid) THEN
        RAISE EXCEPTION 'Access denied: Caller is not a member of organization %', p_org_id;
    END IF;

    -- 2. Server-side data validation
    IF TRIM(COALESCE(p_name, '')) = '' THEN
        RAISE EXCEPTION 'Campaign name is required';
    END IF;

    IF TRIM(COALESCE(p_advertiser_name, '')) = '' OR LENGTH(TRIM(p_advertiser_name)) > 60 THEN
        RAISE EXCEPTION 'Advertiser name must be between 1 and 60 characters';
    END IF;

    IF TRIM(COALESCE(p_headline, '')) = '' OR LENGTH(TRIM(p_headline)) > 120 THEN
        RAISE EXCEPTION 'Headline must be between 1 and 120 characters';
    END IF;

    IF p_description IS NOT NULL AND LENGTH(p_description) > 255 THEN
        RAISE EXCEPTION 'Description must be 255 characters or less';
    END IF;

    -- URL safety: strict https:// requirement
    IF p_destination_url IS NULL OR TRIM(p_destination_url) NOT LIKE 'https://%' THEN
        RAISE EXCEPTION 'Destination URL must start with https:// for developer safety';
    END IF;

    IF p_total_budget IS NULL OR p_total_budget <= 0 THEN
        RAISE EXCEPTION 'Total budget must be greater than 0';
    END IF;

    IF p_daily_budget IS NULL OR p_daily_budget < 0 THEN
        RAISE EXCEPTION 'Daily budget must be non-negative';
    END IF;

    IF p_daily_budget > p_total_budget THEN
        RAISE EXCEPTION 'Daily budget (₹%) cannot exceed total budget (₹%)', p_daily_budget, p_total_budget;
    END IF;

    IF p_end_date IS NOT NULL AND p_end_date <= COALESCE(p_start_date, NOW()) THEN
        RAISE EXCEPTION 'End date must be chronologically after the start date';
    END IF;

    -- 3. Subscription limit check
    SELECT COALESCE(sp.campaign_limit, 1) INTO v_plan_campaign_limit
    FROM public.sponsor_subscriptions ss
    JOIN public.sponsor_plans sp ON sp.id = ss.plan_id
    WHERE ss.org_id = p_org_id AND ss.status = 'ACTIVE'
    ORDER BY ss.created_at DESC
    LIMIT 1;

    SELECT COUNT(*) INTO v_active_campaigns_count
    FROM public.campaigns
    WHERE org_id = p_org_id AND status NOT IN ('ARCHIVED', 'REJECTED');

    IF v_active_campaigns_count >= v_plan_campaign_limit THEN
        RAISE EXCEPTION 'Active campaign limit (%) reached for your subscription plan. Upgrade to create more campaigns.', v_plan_campaign_limit;
    END IF;

    -- 4. In one atomic transaction, insert campaign, creative, budget, delivery, and payment records
    INSERT INTO public.campaigns (
        org_id,
        name,
        status,
        start_date,
        end_date,
        priority_weight
    )
    VALUES (
        p_org_id,
        TRIM(p_name),
        'PENDING_REVIEW', -- FORCED review status
        COALESCE(p_start_date, NOW()),
        p_end_date,
        100
    )
    RETURNING id INTO v_campaign_id;

    -- Creative
    INSERT INTO public.campaign_creatives (
        campaign_id,
        advertiser_name,
        headline,
        description,
        destination_url,
        creative_version,
        is_active
    )
    VALUES (
        v_campaign_id,
        TRIM(p_advertiser_name),
        TRIM(p_headline),
        NULLIF(TRIM(COALESCE(p_description, '')), ''),
        TRIM(p_destination_url),
        1,
        true
    );

    -- Budget (atomic 100% initial remaining balance)
    INSERT INTO public.campaign_budgets (
        campaign_id,
        total_budget,
        remaining_budget,
        daily_budget,
        spent_today,
        total_spent,
        currency,
        last_reset_date
    )
    VALUES (
        v_campaign_id,
        p_total_budget,
        p_total_budget,
        p_daily_budget,
        0.00,
        0.00,
        'INR',
        CURRENT_DATE
    );

    -- Delivery settings
    INSERT INTO public.campaign_delivery_settings (
        campaign_id,
        frequency_cap_hours,
        max_impressions_per_day,
        priority_weight
    )
    VALUES (
        v_campaign_id,
        1,
        1000,
        100
    );

    -- MOCK payment transaction ledger entry
    INSERT INTO public.payment_transactions (
        org_id,
        campaign_id,
        provider,
        provider_transaction_id,
        amount,
        currency,
        transaction_type,
        status,
        metadata
    )
    VALUES (
        p_org_id,
        v_campaign_id,
        'MOCK',
        'mock_tx_' || gen_random_uuid()::text,
        p_total_budget,
        'INR',
        'DEPOSIT',
        'SUCCEEDED',
        jsonb_build_object(
            'created_by', v_uid,
            'campaign_name', TRIM(p_name),
            'note', 'Auto-confirmed deposit on sponsorship creation'
        )
    );

    RETURN v_campaign_id;
END;
$$;

-- =====================================================
-- 05 RPC: GET SPONSOR IMPRESSIONS & ANALYTICS
-- Returns per-campaign totals, daily time series, and summary metrics.
-- Only counts verified, qualified exposures (is_qualified = true AND validation_status = 'VALID').
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_sponsor_impressions(
    p_org_id UUID,
    p_from_date TIMESTAMPTZ DEFAULT NULL,
    p_to_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_from TIMESTAMPTZ := COALESCE(p_from_date, NOW() - INTERVAL '30 days');
    v_to TIMESTAMPTZ := COALESCE(p_to_date, NOW());
    v_campaigns JSONB;
    v_daily_series JSONB;
    v_summary JSONB;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    IF NOT public.is_sponsor(v_uid) OR NOT public.is_org_member(p_org_id, v_uid) THEN
        RAISE EXCEPTION 'Access denied: User is not authorized for organization %', p_org_id;
    END IF;

    -- 1. Per-campaign performance records
    SELECT COALESCE(jsonb_agg(c_row ORDER BY c_row.created_at DESC), '[]'::jsonb) INTO v_campaigns
    FROM (
        SELECT 
            c.id AS campaign_id,
            c.name,
            cr.advertiser_name,
            cr.headline,
            cr.description,
            cr.destination_url,
            c.status,
            c.created_at,
            c.start_date,
            c.end_date,
            COALESCE(b.total_budget, 0.00) AS total_budget,
            COALESCE(b.remaining_budget, 0.00) AS remaining_budget,
            COALESCE(b.total_spent, 0.00) AS total_spent,
            COALESCE(exp.impression_count, 0) AS impressions,
            COALESCE(clk.click_count, 0) AS clicks,
            CASE 
                WHEN COALESCE(exp.impression_count, 0) > 0 
                THEN ROUND((COALESCE(clk.click_count, 0)::NUMERIC / exp.impression_count::NUMERIC) * 100, 2)
                ELSE 0.00
            END AS ctr
        FROM public.campaigns c
        LEFT JOIN public.campaign_creatives cr ON cr.campaign_id = c.id AND cr.is_active = true
        LEFT JOIN public.campaign_budgets b ON b.campaign_id = c.id
        LEFT JOIN (
            SELECT campaign_id, COUNT(*) AS impression_count
            FROM public.ad_exposures
            WHERE is_qualified = true 
              AND validation_status = 'VALID'
              AND created_at >= v_from 
              AND created_at <= v_to
            GROUP BY campaign_id
        ) exp ON exp.campaign_id = c.id
        LEFT JOIN (
            SELECT campaign_id, COUNT(*) AS click_count
            FROM public.ad_clicks
            WHERE clicked_at >= v_from 
              AND clicked_at <= v_to
            GROUP BY campaign_id
        ) clk ON clk.campaign_id = c.id
        WHERE c.org_id = p_org_id
    ) c_row;

    -- 2. Daily time series for trend visualization
    SELECT COALESCE(jsonb_agg(d_row ORDER BY d_row.date_str), '[]'::jsonb) INTO v_daily_series
    FROM (
        SELECT 
            TO_CHAR(d.day, 'YYYY-MM-DD') AS date_str,
            COALESCE(COUNT(DISTINCT e.id), 0) AS impressions,
            COALESCE(COUNT(DISTINCT cl.id), 0) AS clicks
        FROM (
            SELECT generate_series(
                DATE_TRUNC('day', v_from),
                DATE_TRUNC('day', v_to),
                '1 day'::interval
            )::DATE AS day
        ) d
        LEFT JOIN public.campaigns c ON c.org_id = p_org_id
        LEFT JOIN public.ad_exposures e ON e.campaign_id = c.id 
            AND e.is_qualified = true 
            AND e.validation_status = 'VALID'
            AND DATE_TRUNC('day', e.created_at) = d.day
        LEFT JOIN public.ad_clicks cl ON cl.campaign_id = c.id 
            AND DATE_TRUNC('day', cl.clicked_at) = d.day
        GROUP BY d.day
    ) d_row;

    -- 3. Aggregate totals and metrics
    SELECT jsonb_build_object(
        'total_impressions', COALESCE(SUM((c->>'impressions')::INT), 0),
        'total_clicks', COALESCE(SUM((c->>'clicks')::INT), 0),
        'total_budget_funded', COALESCE(SUM((c->>'total_budget')::NUMERIC), 0.00),
        'total_budget_remaining', COALESCE(SUM((c->>'remaining_budget')::NUMERIC), 0.00),
        'total_spent', COALESCE(SUM((c->>'total_spent')::NUMERIC), 0.00),
        'ctr', CASE 
            WHEN COALESCE(SUM((c->>'impressions')::INT), 0) > 0 
            THEN ROUND((COALESCE(SUM((c->>'clicks')::INT), 0)::NUMERIC / SUM((c->>'impressions')::INT)::NUMERIC) * 100, 2)
            ELSE 0.00
        END,
        'active_campaigns_count', COALESCE(COUNT(*) FILTER (WHERE c->>'status' = 'ACTIVE'), 0),
        'pending_campaigns_count', COALESCE(COUNT(*) FILTER (WHERE c->>'status' = 'PENDING_REVIEW'), 0)
    ) INTO v_summary
    FROM jsonb_array_elements(v_campaigns) AS c;

    RETURN jsonb_build_object(
        'campaigns', v_campaigns,
        'daily_series', v_daily_series,
        'summary', COALESCE(v_summary, jsonb_build_object(
            'total_impressions', 0,
            'total_clicks', 0,
            'total_budget_funded', 0.00,
            'total_budget_remaining', 0.00,
            'total_spent', 0.00,
            'ctr', 0.00,
            'active_campaigns_count', 0,
            'pending_campaigns_count', 0
        ))
    );
END;
$$;

-- =====================================================
-- 06 RLS POLICIES FIX: STRICT READ-ONLY FOR SPONSORS
-- Sponsors cannot directly INSERT, UPDATE, or DELETE campaigns, creatives,
-- budgets, delivery settings, or exposures. All writes must go through RPCs.
-- =====================================================

DO $$
BEGIN
    -- Drop old policies to ensure clean, idempotent recreation
    DROP POLICY IF EXISTS "campaigns_select_sponsor" ON public.campaigns;
    DROP POLICY IF EXISTS "campaigns_admin_all" ON public.campaigns;

    DROP POLICY IF EXISTS "creatives_select_sponsor" ON public.campaign_creatives;
    DROP POLICY IF EXISTS "creatives_admin_all" ON public.campaign_creatives;

    DROP POLICY IF EXISTS "budgets_select_sponsor" ON public.campaign_budgets;
    DROP POLICY IF EXISTS "budgets_admin_all" ON public.campaign_budgets;

    DROP POLICY IF EXISTS "delivery_settings_select_sponsor" ON public.campaign_delivery_settings;
    DROP POLICY IF EXISTS "delivery_settings_admin_all" ON public.campaign_delivery_settings;

    DROP POLICY IF EXISTS "exposures_select_sponsor" ON public.ad_exposures;
    DROP POLICY IF EXISTS "exposures_admin_all" ON public.ad_exposures;
END $$;

-- 6.1 Campaigns: SELECT only for members of the organization
CREATE POLICY "campaigns_select_sponsor" ON public.campaigns 
    FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.sponsor_members 
        WHERE org_id = public.campaigns.org_id AND user_id = auth.uid()
    ));

CREATE POLICY "campaigns_admin_all" ON public.campaigns 
    FOR ALL 
    USING (public.is_admin(auth.uid()));

-- 6.2 Campaign Creatives: SELECT only for sponsor org members
CREATE POLICY "creatives_select_sponsor" ON public.campaign_creatives 
    FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.campaigns c
        JOIN public.sponsor_members m ON m.org_id = c.org_id
        WHERE c.id = public.campaign_creatives.campaign_id AND m.user_id = auth.uid()
    ));

CREATE POLICY "creatives_admin_all" ON public.campaign_creatives 
    FOR ALL 
    USING (public.is_admin(auth.uid()));

-- 6.3 Campaign Budgets: SELECT only for sponsor org members
CREATE POLICY "budgets_select_sponsor" ON public.campaign_budgets 
    FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.campaigns c
        JOIN public.sponsor_members m ON m.org_id = c.org_id
        WHERE c.id = public.campaign_budgets.campaign_id AND m.user_id = auth.uid()
    ));

CREATE POLICY "budgets_admin_all" ON public.campaign_budgets 
    FOR ALL 
    USING (public.is_admin(auth.uid()));

-- 6.4 Campaign Delivery Settings: SELECT only for sponsor org members
CREATE POLICY "delivery_settings_select_sponsor" ON public.campaign_delivery_settings 
    FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.campaigns c
        JOIN public.sponsor_members m ON m.org_id = c.org_id
        WHERE c.id = public.campaign_delivery_settings.campaign_id AND m.user_id = auth.uid()
    ));

CREATE POLICY "delivery_settings_admin_all" ON public.campaign_delivery_settings 
    FOR ALL 
    USING (public.is_admin(auth.uid()));

-- 6.5 Ad Exposures: SELECT only for sponsor org members (their campaigns)
CREATE POLICY "exposures_select_sponsor" ON public.ad_exposures 
    FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.campaigns c
        JOIN public.sponsor_members m ON m.org_id = c.org_id
        WHERE c.id = public.ad_exposures.campaign_id AND m.user_id = auth.uid()
    ));

CREATE POLICY "exposures_admin_all" ON public.ad_exposures 
    FOR ALL 
    USING (public.is_admin(auth.uid()));

-- =====================================================
-- 07 FUNCTION PERMISSIONS & SECURITY HARDENING
-- =====================================================

-- Helper Functions (Safe read-only boolean predicates for RLS evaluation)
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_sponsor(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_org_member(UUID, UUID) TO anon, authenticated, service_role;

-- Sponsor RPCs: Authenticated only
REVOKE EXECUTE ON FUNCTION public.register_sponsor(TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_sponsor(TEXT, TEXT, TEXT) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.create_sponsorship(UUID, TEXT, VARCHAR, VARCHAR, VARCHAR, TEXT, NUMERIC, NUMERIC, TIMESTAMPTZ, TIMESTAMPTZ) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_sponsorship(UUID, TEXT, VARCHAR, VARCHAR, VARCHAR, TEXT, NUMERIC, NUMERIC, TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.get_sponsor_impressions(UUID, TIMESTAMPTZ, TIMESTAMPTZ) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_sponsor_impressions(UUID, TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated, service_role;

-- deduct_campaign_budget: strictly service_role ONLY (no anon or authenticated access)
REVOKE EXECUTE ON FUNCTION public.deduct_campaign_budget(UUID, NUMERIC) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.deduct_campaign_budget(UUID, NUMERIC) TO service_role;

-- Secure active_eligible_campaigns view: service_role only
REVOKE ALL ON public.active_eligible_campaigns FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.active_eligible_campaigns TO service_role;
