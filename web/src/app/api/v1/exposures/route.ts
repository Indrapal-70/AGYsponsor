import { NextRequest, NextResponse } from 'next/server';
import { verifyExposureToken } from '@/lib/exposure/token';
import { getServiceSupabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      installation_id,
      campaign_id,
      creative_id,
      exposure_token,
      event_id,
      exposure_duration_seconds = 5.0
    } = body;

    if (!installation_id || !campaign_id || !event_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required exposure fields' },
        { status: 400 }
      );
    }

    // 1. Verify server-issued HMAC exposure token
    if (exposure_token) {
      const tokenVerification = verifyExposureToken(
        exposure_token,
        installation_id,
        campaign_id,
        creative_id || 'crt_demo_001'
      );
      if (!tokenVerification.valid) {
        return NextResponse.json({
          success: false,
          is_qualified: false,
          validation_status: 'INVALID_TOKEN',
          reason: tokenVerification.reason
        }, { status: 403 });
      }
    }

    // 2. Minimum duration check
    const minDuration = 5.0; // seconds
    if (exposure_duration_seconds < minDuration) {
      return NextResponse.json({
        success: true,
        is_qualified: false,
        validation_status: 'DURATION_TOO_SHORT',
        reason: `Dwell time ${exposure_duration_seconds}s below threshold ${minDuration}s`
      });
    }

    // 3. Database recording & ledger crediting if Supabase is active
    let isQualified = true;
    let rewardAmount = 0.20; // INR ₹0.20 per qualified exposure

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = getServiceSupabase();

        // Check duplicate event_id
        const { data: existing } = await supabase
          .from('ad_exposures')
          .select('id')
          .eq('event_id', event_id)
          .maybeSingle();

        if (existing) {
          return NextResponse.json({
            success: true,
            is_qualified: true,
            validation_status: 'DUPLICATE',
            message: 'Exposure already credited'
          });
        }

        // Check if installation is paired to a user
        const { data: installData } = await supabase
          .from('installations')
          .select('id, user_id, status')
          .eq('installation_uuid', installation_id)
          .maybeSingle();

        if (installData?.status === 'SUSPENDED') {
          return NextResponse.json({
            success: false,
            is_qualified: false,
            validation_status: 'FRAUD_SUSPECTED',
            reason: 'Installation is suspended'
          }, { status: 403 });
        }

        // Record exposure in ad_exposures
        const { data: exposureRecord, error: expError } = await supabase
          .from('ad_exposures')
          .insert({
            campaign_id,
            creative_id: creative_id || null,
            installation_id: installData?.id || null,
            exposure_token: exposure_token || 'legacy_token',
            event_id,
            exposure_duration_seconds,
            is_qualified: true,
            validation_status: 'VALID',
            reward_calculated: rewardAmount
          })
          .select('id')
          .single();

        // If installation is paired to a registered consumer, credit earnings_ledger
        if (installData?.user_id && exposureRecord?.id) {
          await supabase.from('earnings_ledger').insert({
            user_id: installData.user_id,
            installation_id: installData.id,
            exposure_id: exposureRecord.id,
            entry_type: 'EXPOSURE_REWARD',
            amount: rewardAmount,
            currency: 'INR',
            status: 'AVAILABLE',
            metadata: {
              campaign_id,
              event_id,
              duration: exposure_duration_seconds
            }
          });
        }

        // Deduct campaign spend from campaign_budgets
        await supabase.rpc('deduct_campaign_budget', {
          p_campaign_id: campaign_id,
          p_cost: 0.50
        });

      } catch (err: any) {
        // Fall back gracefully in mock/offline mode
      }
    }

    return NextResponse.json({
      success: true,
      is_qualified: isQualified,
      validation_status: 'VALID',
      reward_calculated: rewardAmount,
      currency: 'INR'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal exposure recording error', details: error.message },
      { status: 500 }
    );
  }
}
