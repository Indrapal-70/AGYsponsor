import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServiceSupabase } from '@/lib/supabase/server';

function generateShortCode(): string {
  // 8 uppercase alphanumeric chars without ambiguous 0/O/1/I
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let part1 = '';
  let part2 = '';
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 4; i++) {
    part1 += chars[bytes[i] % chars.length];
    part2 += chars[bytes[i + 4] % chars.length];
  }
  return `${part1}-${part2}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { installation_uuid, os, client_version } = body;

    if (!installation_uuid) {
      return NextResponse.json(
        { error: 'installation_uuid is required' },
        { status: 400 }
      );
    }

    const pairingCode = generateShortCode();
    const expiresInSeconds = 900; // 15 minutes
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = getServiceSupabase();

        // 1. Ensure installation record exists
        await supabase
          .from('installations')
          .upsert({
            installation_uuid,
            os: os || 'linux',
            client_version: client_version || '1.0.0',
            status: 'ACTIVE',
            last_seen_at: new Date().toISOString()
          }, { onConflict: 'installation_uuid' });

        // 2. Insert pairing code
        await supabase
          .from('installation_pairing_codes')
          .insert({
            installation_uuid,
            pairing_code: pairingCode,
            status: 'PENDING',
            expires_at: expiresAt
          });
      } catch (dbErr) {
        // Continue with generated code
      }
    }

    const host = req.headers.get('host') || 'agentsponsor.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const connectUrl = `${protocol}://${host}/connect?code=${pairingCode}`;

    return NextResponse.json({
      success: true,
      pairing_code: pairingCode,
      connect_url: connectUrl,
      expires_in_seconds: expiresInSeconds,
      expires_at: expiresAt
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to initialize pairing', details: error.message },
      { status: 500 }
    );
  }
}
