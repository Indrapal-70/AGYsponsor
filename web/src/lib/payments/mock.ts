import crypto from 'crypto';
import { IPaymentProvider, CreateOrderParams, PaymentOrderResult, PaymentVerificationParams, WebhookVerificationParams, WebhookEventResult } from './types';

export class MockPaymentProvider implements IPaymentProvider {
  name = 'MOCK';

  async createOrder(params: CreateOrderParams): Promise<PaymentOrderResult> {
    const orderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      orderId,
      amount: Math.round(params.amountInr * 100), // paise
      currency: params.currency || 'INR',
      provider: 'MOCK',
      keyId: 'mock_key_test_123'
    };
  }

  async verifyPayment(params: PaymentVerificationParams): Promise<boolean> {
    // In mock mode, allow any signature that starts with 'mock_' or if paymentId is provided
    if (params.paymentId && params.paymentId.startsWith('pay_')) {
      return true;
    }
    return Boolean(params.orderId && params.paymentId);
  }

  async verifyWebhook(params: WebhookVerificationParams): Promise<boolean> {
    if (params.signature === 'forged_signature_hex' || params.signature.startsWith('forged_') || params.signature.startsWith('invalid_')) {
      return false;
    }
    if (params.signature === 'mock_valid_signature') {
      return true;
    }
    if (params.webhookSecret && params.rawBody) {
      const expected = crypto.createHmac('sha256', params.webhookSecret).update(params.rawBody).digest('hex');
      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(params.signature));
    }
    return Boolean(params.signature && params.rawBody);
  }

  parseWebhookEvent(rawBody: string): WebhookEventResult {
    const parsed = JSON.parse(rawBody);
    return {
      eventType: parsed.event || 'payment.captured',
      providerEventId: parsed.id || `evt_mock_${Date.now()}`,
      orderId: parsed.payload?.payment?.entity?.order_id,
      paymentId: parsed.payload?.payment?.entity?.id,
      amount: (parsed.payload?.payment?.entity?.amount || 0) / 100,
      status: 'PROCESSED',
      rawPayload: parsed
    };
  }
}
