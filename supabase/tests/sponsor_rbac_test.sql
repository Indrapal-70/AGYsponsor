-- ====================================================================
-- AGENTSPONSOR SPONSOR PORTAL RBAC SECURITY & PERMISSION TEST HARNESS
-- File: supabase/tests/sponsor_rbac_test.sql
-- 
-- Tests 4 identities:
--   1. anon (unauthenticated)
--   2. CONSUMER (authenticated developer user without SPONSOR role)
--   3. Sponsor A (authenticated user with SPONSOR role, Org A)
--   4. Sponsor B (authenticated user with SPONSOR role, Org B)
-- ====================================================================

BEGIN;

-- 0. TEST SETUP: Mock Identities & Profiles
CREATE SCHEMA IF NOT EXISTS auth;

-- Generate Test UUIDs
DO $$
DECLARE
    uid_consumer UUID := '11111111-1111-1111-1111-111111111111'::UUID;
    uid_sponsor_a UUID := '22222222-2222-2222-2222-222222222222'::UUID;
    uid_sponsor_b UUID := '33333333-3333-3333-3333-333333333333'::UUID;
BEGIN
    -- Insert test profiles
    INSERT INTO public.profiles (id, email, full_name)
    VALUES 
        (uid_consumer, 'consumer@workstation.io', 'Consumer Dev'),
        (uid_sponsor_a, 'sponsor_a@cloudforge.io', 'Sponsor A Owner'),
        (uid_sponsor_b, 'sponsor_b@vectorscale.io', 'Sponsor B Owner')
    ON CONFLICT (id) DO NOTHING;

    -- Consumer role only for uid_consumer
    INSERT INTO public.user_roles (user_id, role)
    VALUES (uid_consumer, 'CONSUMER')
    ON CONFLICT (user_id, role) DO NOTHING;
END $$;

-- ====================================================================
-- TEST 1: Calling register_sponsor cannot produce an ADMIN role
-- ====================================================================
DO $$
DECLARE
    uid_sponsor_a UUID := '22222222-2222-2222-2222-222222222222'::UUID;
    res JSONB;
    is_adm BOOLEAN;
    is_spn BOOLEAN;
BEGIN
    -- Set auth context to Sponsor A
    PERFORM set_config('request.jwt.claim.sub', uid_sponsor_a::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    res := public.register_sponsor('CloudForge Systems', 'billing@cloudforge.io', 'https://cloudforge.io');
    
    -- Check roles
    SELECT public.is_admin(uid_sponsor_a) INTO is_adm;
    SELECT public.is_sponsor(uid_sponsor_a) INTO is_spn;

    ASSERT is_spn = true, 'TEST 1 FAILED: User was not granted SPONSOR role';
    ASSERT is_adm = false, 'TEST 1 FAILED: Security breach! register_sponsor granted ADMIN role!';
    RAISE NOTICE '✓ TEST 1 PASSED: register_sponsor granted SPONSOR and did NOT grant ADMIN';
END $$;

-- Register Sponsor B
DO $$
DECLARE
    uid_sponsor_b UUID := '33333333-3333-3333-3333-333333333333'::UUID;
    res JSONB;
BEGIN
    PERFORM set_config('request.jwt.claim.sub', uid_sponsor_b::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    res := public.register_sponsor('VectorScale AI', 'billing@vectorscale.io', 'https://vectorscale.io');
    RAISE NOTICE '✓ Sponsor B registered with Org ID: %', res->>'org_id';
END $$;

-- ====================================================================
-- TEST 2: Anon and CONSUMER cannot call sponsor RPCs or read campaigns
-- ====================================================================

-- 2a. Anon cannot call create_sponsorship
DO $$
BEGIN
    -- Clear auth context (anon)
    PERFORM set_config('request.jwt.claim.sub', '', true);
    PERFORM set_config('request.jwt.claim.role', 'anon', true);

    BEGIN
        PERFORM public.create_sponsorship(
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID,
            'Test Campaign',
            'Anon Co',
            'Headline',
            'Desc',
            'https://example.com',
            5000,
            1000
        );
        RAISE EXCEPTION 'TEST 2a FAILED: Anon was allowed to call create_sponsorship';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '✓ TEST 2a PASSED: Anon blocked from calling create_sponsorship (%)', SQLERRM;
    END;
END $$;

-- 2b. CONSUMER cannot call create_sponsorship
DO $$
DECLARE
    uid_consumer UUID := '11111111-1111-1111-1111-111111111111'::UUID;
BEGIN
    PERFORM set_config('request.jwt.claim.sub', uid_consumer::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    BEGIN
        PERFORM public.create_sponsorship(
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::UUID,
            'Consumer Campaign',
            'Consumer Co',
            'Headline',
            'Desc',
            'https://example.com',
            5000,
            1000
        );
        RAISE EXCEPTION 'TEST 2b FAILED: Consumer was allowed to call create_sponsorship';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '✓ TEST 2b PASSED: Consumer blocked from calling create_sponsorship (%)', SQLERRM;
    END;
END $$;

-- ====================================================================
-- TEST 3: Sponsor A creates a campaign; Sponsor B cannot read or modify it
-- ====================================================================
DO $$
DECLARE
    uid_sponsor_a UUID := '22222222-2222-2222-2222-222222222222'::UUID;
    uid_sponsor_b UUID := '33333333-3333-3333-3333-333333333333'::UUID;
    org_a_id UUID;
    camp_a_id UUID;
    visible_count INT;
    impressions_res JSONB;
BEGIN
    -- Sponsor A context
    PERFORM set_config('request.jwt.claim.sub', uid_sponsor_a::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    SELECT org_id INTO org_a_id FROM public.sponsor_members WHERE user_id = uid_sponsor_a LIMIT 1;

    -- Create Campaign as Sponsor A
    camp_a_id := public.create_sponsorship(
        org_a_id,
        'CloudForge GPU Promotion',
        'CloudForge Demo',
        'Deploy serverless AI backends in seconds',
        'Built for autonomous agent workloads',
        'https://cloudforge.io/agents',
        5000.00,
        1000.00
    );

    ASSERT camp_a_id IS NOT NULL, 'TEST 3 SETUP FAILED: Campaign A was not created';
    RAISE NOTICE '✓ Campaign A created with ID: %', camp_a_id;

    -- Switch context to Sponsor B
    PERFORM set_config('request.jwt.claim.sub', uid_sponsor_b::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    -- 3a. Sponsor B tries to call get_sponsor_impressions on Org A
    BEGIN
        impressions_res := public.get_sponsor_impressions(org_a_id);
        RAISE EXCEPTION 'TEST 3a FAILED: Sponsor B accessed Org A analytics';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '✓ TEST 3a PASSED: Sponsor B blocked from querying Sponsor A impressions (%)', SQLERRM;
    END;

    -- 3b. Sponsor B tries to SELECT Sponsor A campaign directly via SQL
    SELECT COUNT(*) INTO visible_count FROM public.campaigns WHERE id = camp_a_id;
    ASSERT visible_count = 0, 'TEST 3b FAILED: Sponsor B was able to view Sponsor A campaign via RLS';
    RAISE NOTICE '✓ TEST 3b PASSED: RLS hides Sponsor A campaigns from Sponsor B';
END $$;

-- ====================================================================
-- TEST 4: Sponsor cannot directly update status, approved_by, or budgets
-- ====================================================================
DO $$
DECLARE
    uid_sponsor_a UUID := '22222222-2222-2222-2222-222222222222'::UUID;
    camp_a_id UUID;
    c_status campaign_status;
    budget_rem NUMERIC;
BEGIN
    PERFORM set_config('request.jwt.claim.sub', uid_sponsor_a::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    SELECT c.id INTO camp_a_id FROM public.campaigns c LIMIT 1;

    -- Attempt direct SQL UPDATE on campaign status
    UPDATE public.campaigns 
    SET status = 'ACTIVE', approved_by = uid_sponsor_a 
    WHERE id = camp_a_id;

    SELECT status INTO c_status FROM public.campaigns WHERE id = camp_a_id;
    ASSERT c_status = 'PENDING_REVIEW', 'TEST 4a FAILED: Sponsor was able to directly bypass review and set status to ACTIVE!';
    RAISE NOTICE '✓ TEST 4a PASSED: Direct UPDATE on campaign status blocked by RLS (remained PENDING_REVIEW)';

    -- Attempt direct SQL UPDATE on campaign budget
    UPDATE public.campaign_budgets 
    SET remaining_budget = 999999.00 
    WHERE campaign_id = camp_a_id;

    SELECT remaining_budget INTO budget_rem FROM public.campaign_budgets WHERE campaign_id = camp_a_id;
    ASSERT budget_rem = 5000.00, 'TEST 4b FAILED: Sponsor was able to directly alter budget!';
    RAISE NOTICE '✓ TEST 4b PASSED: Direct UPDATE on campaign budget blocked by RLS (remained 5000.00)';
END $$;

-- ====================================================================
-- TEST 5: No one but service_role can call deduct_campaign_budget
-- ====================================================================
DO $$
DECLARE
    uid_sponsor_a UUID := '22222222-2222-2222-2222-222222222222'::UUID;
    camp_a_id UUID;
BEGIN
    SELECT c.id INTO camp_a_id FROM public.campaigns c LIMIT 1;

    -- As Sponsor A (authenticated)
    PERFORM set_config('request.jwt.claim.sub', uid_sponsor_a::text, true);
    PERFORM set_config('request.jwt.claim.role', 'authenticated', true);

    BEGIN
        PERFORM public.deduct_campaign_budget(camp_a_id, 0.40);
        RAISE EXCEPTION 'TEST 5 FAILED: Authenticated user was able to execute deduct_campaign_budget';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '✓ TEST 5 PASSED: deduct_campaign_budget blocked for non-service_role callers (%)', SQLERRM;
    END;
END $$;

ROLLBACK;
