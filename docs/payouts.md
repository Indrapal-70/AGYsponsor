# Developer Payouts Architecture

AgentSponsor enables developers to monetize active coding time and withdraw earnings directly to Indian payment rails (UPI / Bank Accounts).

---

## 1. Payout Lifecycle

```
Developer Earns via Qualified Exposures
                  │
                  ▼
       earnings_ledger (AVAILABLE)
                  │
  Developer Requests Withdrawal (Min ₹50)
                  │
                  ▼
       payout_requests (PENDING_REVIEW)
       earnings_ledger (PAYOUT_RESERVATION: -₹Amount)
                  │
        Admin Review / Approval
                  │
                  ▼
       Provider Disbursement (UPI / IMPS)
                  │
                  ▼
       payout_requests (COMPLETED)
       earnings_ledger (PAYOUT_COMPLETED)
```

---

## 2. Supported India Destinations

1. **UPI (Virtual Payment Address)**:
   - Format: `^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$`
   - Example: `username@okhdfcbank`, `developer@upi`
   - Zero transaction fees for micro-withdrawals.

2. **Indian Bank Transfer (IMPS / NEFT)**:
   - Format: `IFSC:ACCOUNT_NUMBER`
   - Example: `HDFC0001234:50100234567890`
   - Automated 11-character IFSC validation.

---

## 3. Payout Safety & Anti-Double-Disburse

- **Atomic Reservation**: When a payout is initiated, an atomic debit entry (`PAYOUT_RESERVATION`) is recorded in `earnings_ledger`.
- **Database Balances Sync**: Trigger `sync_earnings_balances` instantly reduces `available_balance`, preventing concurrent double withdrawals.
- **Admin Approval Gate**: By default, payouts enter `PENDING_REVIEW` for fraud screening before programmatic disbursement.
