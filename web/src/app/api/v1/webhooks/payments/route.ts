import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPaymentProvider } from '@/lib/payments';
import { getServiceSupabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || req.headers.get('x-signature') || '';
    const provider = getPaymentProvider();

    // 1. Verify webhook signature
    const isValid = await provider.verifyWebhook({
      rawBody,
      signature,
      webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || ''
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const event = provider.parseWebhookEvent(rawBody);
    const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex');

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = getServiceSupabase();

      // 2. Check idempotency (duplicate provider_event_id)
      const { data: existingEvent } = await supabase
        .from('payment_webhook_events')
        .select('id, processing_status')
        .eq('provider_event_id', event.providerEventId)
        .maybeSingle();

      if (existingEvent) {
        return NextResponse.json({
          status: 'ignored',
          reason: 'duplicate_event',
          eventId: event.providerEventId
        });
      }

      // Record webhook event as PENDING
      const { data: recordedEvent } = await supabase
        .from('payment_webhook_events')
        .insert({
          provider: provider.name,
          provider_event_id: event.providerEventId,
          event_type: event.eventType,
          payload_hash: payloadHash,
          payload: event.rawPayload,
          processing_status: 'PENDING'
        })
        .select('id')
        .single();

      // Process payment event
      if (event.eventType === 'payment.captured' || event.eventType === 'order.paid') {
        const orderId = event.orderId;
        const amount = event.amount || 0;

        // If associated with a campaign order, credit campaign budget
        if (orderId) {
          const { data: tx } = await supabase
            .from('payment_transactions')
            .select('campaign_id, org_id')
            .eq('provider_payment_id', orderId)
            .maybeSingle();

          if (tx?.campaign_id) {
            await supabase
              .from('campaign_budgets')
              .update({
                remaining_budget: supabase.rpc('increment_budget', { amount }),
                total_budget: supabase.rpc('increment_budget', { amount })
              })
              .eq('campaign_id', tx.campaign_id);
          }
        }
      }

      // Mark event PROCESSED
      if (recordedEvent?.id) {
        await supabase
          .from('payment_webhook_events')
          .update({
            processing_status: 'PROCESSED',
            processed_at: new Date().toISOString()
          })
          .eq('id', recordedEvent.id);
      }
    }

    return NextResponse.json({
      status: 'success',
      received: true,
      eventId: event.providerEventId
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}
