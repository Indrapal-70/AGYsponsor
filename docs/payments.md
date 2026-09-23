# Payments & Campaign Funding Architecture

AgentSponsor uses a provider-agnostic payment abstraction layer supporting Indian payment methods (UPI, NetBanking, Cards) and recurring sponsor subscription packages.

---

## 1. Provider Abstraction Architecture

Payment logic is isolated under [`web/src/lib/payments/`](file:///home/inder/agysponsor/web/src/lib/payments/) with an interface contract:

```typescript
export interface IPaymentProvider {
  name: string;
  createOrder(params: CreateOrderParams): Promise<PaymentOrderResult>;
  verifyPayment(params: PaymentVerificationParams): Promise<boolean>;
  verifyWebhook(params: WebhookVerificationParams): Promise<boolean>;
  parseWebhookEvent(rawBody: string): WebhookEventResult;
}
```

### Supported Providers
- **`MOCK`**: Default development and test provider for local testing and CI/CD without credentials.
- **`RAZORPAY`**: Production provider for India with native UPI, Net Banking, and Cards.

Select the active provider via environment variable:
```ini
PAYMENT_PROVIDER=MOCK  # or RAZORPAY
```

---

## 2. Sponsor Packages & Pricing

Packages are dynamically configured in the database table `sponsor_plans`:

| Plan Slug | Monthly INR | Included Budget | Active Campaigns | Creatives |
| :--- | :--- | :--- | :--- | :--- |
| `starter` | ₹4,999 | ₹4,000 | 1 | 2 |
| `growth` | ₹14,999 | ₹12,500 | 3 | 6 |
| `scale` | ₹39,999 | ₹35,000 | 10 | 20 |

---

## 3. Webhook Signature Verification & Idempotency

All payment events are ingested via `POST /api/v1/webhooks/payments`:

1. **HMAC Signature Check**: Request payload is verified against `PAYMENT_WEBHOOK_SECRET` using `crypto.timingSafeEqual`. Unsigned or tampered requests are rejected with 401.
2. **Idempotency**: Event IDs are recorded in `payment_webhook_events`. Duplicates are skipped without double-crediting campaign budgets.
3. **Budget Activation**: On `payment.captured` or `order.paid`, campaign budgets are credited via atomic database transactions.
