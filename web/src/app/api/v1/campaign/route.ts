import { NextRequest, NextResponse } from 'next/server';
import { generateExposureToken } from '@/lib/exposure/token';
import { getServiceSupabase } from '@/lib/supabase/server';

// Fallback active campaigns for local dev / demo mode
const DEMO_CAMPAIGNS = [
  {
    campaign_id: 'cmp_demo_001',
    creative_id: 'crt_demo_001',
    advertiser_name: 'CloudForge Demo',
    headline: 'Deploy your AI backend in seconds',
    description: 'GPU infrastructure built for developers.',
    destination_url: 'https://example.com/cloudforge',
    creative_version: 1,
    priority_weight: 100
  },
  {
    campaign_id: 'cmp_demo_002',
    creative_id: 'crt_demo_002',
    advertiser_name: 'VectorScale AI',
    headline: 'Instant vector search for your agents',
    description: 'Zero-latency hybrid search engine.',
    destination_url: 'https://example.com/vectorscale',
    creative_version: 1,
    priority_weight: 100
  },
  {
    campaign_id: 'cmp_demo_003',
    creative_id: 'crt_demo_003',
    advertiser_name: 'PromptShield',
    headline: 'Real-time prompt injection firewall',
    description: 'Protect your LLM apps in production.',
    destination_url: 'https://example.com/promptshield',
    creative_version: 1,
    priority_weight: 80
  }
];

let rotationIndex = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const installationId = searchParams.get('installation_id') || 'anonymous-cli-client';

    let selectedCampaign: any = null;

    // 1. Try fetching from Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = getServiceSupabase();
        const { data, error } = await supabase
          .from('active_eligible_campaigns')
          .select('*')
          .limit(10);

        if (!error && data && data.length > 0) {
          // Weighted / round-robin selection
          const idx = Math.floor(Date.now() / 60000) % data.length;
          const row = data[idx];
          selectedCampaign = {
            campaign_id: row.campaign_id,
            creative_id: row.creative_id,
            advertiser_name: row.advertiser_name,
            headline: row.headline,
            description: row.description,
            destination_url: row.destination_url,
            creative_version: row.creative_version
          };
        }
      } catch (dbErr) {
        // Fall back gracefully
      }
    }

    // 2. Fall back to rotating demo campaigns
    if (!selectedCampaign) {
      rotationIndex = (rotationIndex + 1) % DEMO_CAMPAIGNS.length;
      selectedCampaign = DEMO_CAMPAIGNS[rotationIndex];
    }

    // 3. Issue server-signed exposure token
    const exposureToken = generateExposureToken(
      installationId,
      selectedCampaign.campaign_id,
      selectedCampaign.creative_id
    );

    return NextResponse.json({
      campaign_id: selectedCampaign.campaign_id,
      creative_id: selectedCampaign.creative_id,
      advertiser_name: selectedCampaign.advertiser_name,
      headline: selectedCampaign.headline,
      description: selectedCampaign.description,
      destination_url: selectedCampaign.destination_url,
      creative_version: selectedCampaign.creative_version,
      rotation_ttl: 60, // 60 seconds rotation interval
      exposure_token: exposureToken
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve campaign', message: error.message },
      { status: 500 }
    );
  }
}
