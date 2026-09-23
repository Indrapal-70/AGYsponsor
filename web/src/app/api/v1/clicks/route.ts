import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServiceSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destinationUrl = searchParams.get('url') || 'https://agentsponsor.com';
    const campaignId = searchParams.get('campaign_id');
    const exposureId = searchParams.get('exposure_id');
    const installationId = searchParams.get('installation_id');

    // Only allow valid http or https protocols
    try {
      const parsed = new URL(destinationUrl);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return NextResponse.redirect('https://agentsponsor.com');
      }
    } catch {
      return NextResponse.redirect('https://agentsponsor.com');
    }

    // Record click asynchronously if Supabase is configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && campaignId) {
      try {
        const supabase = getServiceSupabase();
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);

        await supabase.from('ad_clicks').insert({
          campaign_id: campaignId,
          exposure_id: exposureId || null,
          installation_id: installationId || null,
          referrer: req.headers.get('referer') || null,
          ip_hash: ipHash
        });
      } catch (err) {
        // Log error but don't disrupt user redirect
      }
    }

    return NextResponse.redirect(destinationUrl);
  } catch (error) {
    return NextResponse.redirect('https://agentsponsor.com');
  }
}
