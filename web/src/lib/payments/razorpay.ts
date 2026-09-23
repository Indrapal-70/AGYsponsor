import crypto from 'crypto';
import { IPaymentProvider, CreateOrderParams, PaymentOrderResult, PaymentVerificationParams, WebhookVerificationParams, WebhookEventResult } from './types';

export class RazorpayPaymentProvider implements IPaymentProvider {
  name = 'RAZORPAY';
  private keyId: string;
  private keySecret: string;

  constructor(keyId?: string, keySecret?: string) {
    this.keyId = keyId || process.env.PAYMENT_PUBLIC_KEY || '';
    this.keySecret = keySecret || process.env.PAYMENT_SECRET_KEY || '';
  }

  async createOrder(params: CreateOrderParams): Promise<PaymentOrderResult> {
    if (!this.keyId || !this.keySecret) {
      throw new Error('Razorpay credentials not configured in environment (PAYMENT_PUBLIC_KEY / PAYMENT_SECRET_KEY)');
    }

    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
    const amountInPaise = Math.round(params.amountInr * 100);

    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: params.currency || 'INR',
        receipt: params.receipt,
        notes: params.notes || {}
      })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Razorpay order creation failed: ${err}`);
    }

    const data = await res.json();
    return {
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      provider: 'RAZORPAY',
      keyId: this.keyId
    };
  }

  async verifyPayment(params: PaymentVerificationParams): Promise<boolean> {
    if (!this.keySecret) {
      throw new Error('Payment secret key missing for signature verification');
    }
    const text = `${params.orderId}|${params.paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(text)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(params.signature)
    );
  }

  async verifyWebhook(params: WebhookVerificationParams): Promise<boolean> {
    const secret = params.webhookSecret || process.env.PAYMENT_WEBHOOK_SECRET || '';
    if (!secret) return false;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(params.rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(params.signature)
    );
  }

  parseWebhookEvent(rawBody: string): WebhookEventResult {
    const parsed = JSON.parse(rawBody);
    return {
      eventType: parsed.event,
      providerEventId: parsed.id || `evt_rzp_${Date.now()}`,
      orderId: parsed.payload?.payment?.entity?.order_id,
      paymentId: parsed.payload?.payment?.entity?.id,
      amount: (parsed.payload?.payment?.entity?.amount || 0) / 100,
      status: parsed.payload?.payment?.entity?.status === 'captured' ? 'SUCCESS' : 'PENDING',
      rawPayload: parsed
    };
  }
}
