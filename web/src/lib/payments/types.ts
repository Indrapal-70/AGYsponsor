export interface CreateOrderParams {
  amountInr: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  provider: string;
  keyId?: string;
}

export interface PaymentVerificationParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface WebhookVerificationParams {
  rawBody: string;
  signature: string;
  webhookSecret: string;
}

export interface WebhookEventResult {
  eventType: string;
  providerEventId: string;
  orderId?: string;
  paymentId?: string;
  amount?: number;
  status: string;
  rawPayload: any;
}

export interface IPaymentProvider {
  name: string;
  createOrder(params: CreateOrderParams): Promise<PaymentOrderResult>;
  verifyPayment(params: PaymentVerificationParams): Promise<boolean>;
  verifyWebhook(params: WebhookVerificationParams): Promise<boolean>;
  parseWebhookEvent(rawBody: string): WebhookEventResult;
}
