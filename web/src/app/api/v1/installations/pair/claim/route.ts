import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pairing_code, installation_id, device_name, user_id } = body;

    const inputCode = (pairing_code || installation_id || '').trim();

    if (!inputCode) {
      return NextResponse.json(
        { success: false, error: 'Pairing code or Installation UUID is required' },
        { status: 400 }
      );
    }

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in to link your installation.' },
        { status: 401 }
      );
    }

    const cleanCode = inputCode.toUpperCase();
    const supabase = getServiceSupabase();

    // Case 1: If input is a UUID (direct installation pairing)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(inputCode);
    if (isUuid) {
      const { error: upsertErr } = await supabase
        .from('installations')
        .upsert({
          installation_uuid: inputCode.toLowerCase(),
          user_id: user_id,
          device_name: device_name || 'My Workstation CLI',
          is_paired: true,
          paired_at: new Date().toISOString(),
          status: 'ACTIVE',
          last_seen_at: new Date().toISOString()
        }, { onConflict: 'installation_uuid' });

      if (upsertErr) {
        return NextResponse.json(
          { success: false, error: 'Failed to link installation UUID', details: upsertErr.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        installation_uuid: inputCode.toLowerCase(),
        message: 'CLI installation linked directly to your developer account.'
      });
    }

    // Case 2: Short-lived pairing code check
    const { data: codeRecord, error: codeErr } = await supabase
      .from('installation_pairing_codes')
      .select('*')
      .eq('pairing_code', cleanCode)
      .eq('status', 'PENDING')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (codeErr || !codeRecord) {
      // If code was not found in database, still check if installation exists or register cleanly
      return NextResponse.json(
        { success: false, error: 'Invalid or expired pairing code. You can also paste your full Installation UUID from ~/.agentsponsor/config.json.' },
        { status: 404 }
      );
    }

    // Mark pairing code claimed
    await supabase
      .from('installation_pairing_codes')
      .update({
        status: 'CLAIMED',
        claimed_by: user_id,
        claimed_at: new Date().toISOString()
      })
      .eq('id', codeRecord.id);

    // Link installation to user profile
    await supabase
      .from('installations')
      .upsert({
        installation_uuid: codeRecord.installation_uuid,
        user_id: user_id,
        device_name: device_name || 'AgentSponsor CLI',
        is_paired: true,
        paired_at: new Date().toISOString(),
        status: 'ACTIVE',
        last_seen_at: new Date().toISOString()
      }, { onConflict: 'installation_uuid' });

    return NextResponse.json({
      success: true,
      installation_uuid: codeRecord.installation_uuid,
      message: 'Installation paired successfully with your personal earnings ledger.'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to process pairing request', details: error.message },
      { status: 500 }
    );
  }
}
