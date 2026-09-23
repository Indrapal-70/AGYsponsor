import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pairing_code, device_name, user_id } = body;

    if (!pairing_code) {
      return NextResponse.json(
        { success: false, error: 'Pairing code is required' },
        { status: 400 }
      );
    }

    const cleanCode = pairing_code.trim().toUpperCase();

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = getServiceSupabase();

      // Check pairing code record
      const { data: codeRecord, error: codeErr } = await supabase
        .from('installation_pairing_codes')
        .select('*')
        .eq('pairing_code', cleanCode)
        .eq('status', 'PENDING')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (codeErr || !codeRecord) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired pairing code' },
          { status: 404 }
        );
      }

      // Mark pairing code claimed
      await supabase
        .from('installation_pairing_codes')
        .update({
          status: 'CLAIMED',
          claimed_by: user_id || null,
          claimed_at: new Date().toISOString()
        })
        .eq('id', codeRecord.id);

      // Link installation to user profile
      await supabase
        .from('installations')
        .upsert({
          installation_uuid: codeRecord.installation_uuid,
          user_id: user_id || null,
          device_name: device_name || 'AgentSponsor CLI',
          is_paired: true,
          paired_at: new Date().toISOString(),
          status: 'ACTIVE',
          last_seen_at: new Date().toISOString()
        }, { onConflict: 'installation_uuid' });

      return NextResponse.json({
        success: true,
        installation_uuid: codeRecord.installation_uuid,
        message: 'Installation paired successfully'
      });
    }

    // Mock fallback response for demo mode
    return NextResponse.json({
      success: true,
      installation_uuid: 'demo-uuid-' + Math.random().toString(36).substring(2, 9),
      message: 'Demo installation linked successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to claim pairing code', details: error.message },
      { status: 500 }
    );
  }
}
