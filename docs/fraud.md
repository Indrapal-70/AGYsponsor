# Anti-Fraud & Qualified Exposure Security

AgentSponsor enforces multi-layered fraud prevention to guarantee sponsors only pay for genuine developer dwell attention.

---

## 1. What Qualifies an Exposure?

A simple terminal status-line refresh does **not** constitute an impression. To qualify:

1. **Active Agent State**: The agent must be actively processing (`thinking`, `working`, or `tool_use`).
2. **Minimum Dwell Duration**: The sponsor message must remain exposed for at least 5.0 seconds (`exposure_duration_seconds >= 5.0`).
3. **Signed Exposure Token**: The request must supply a valid HMAC token issued by the server within the last 60 minutes.
4. **Frequency Capping**: Capped at 1 exposure per campaign per conversation window (1-hour cooldown).
5. **Campaign Budget Check**: The target campaign must be `ACTIVE` with remaining prepaid budget.

---

## 2. Cryptographic Exposure Token

Server issues tokens signed with HMAC-SHA256:
```
Token = Base64Url(installation_id:campaign_id:creative_id:issued_timestamp) . HMAC_SHA256
```
Attempts to replay expired tokens or forge signatures fail with `403 Forbidden` (`INVALID_TOKEN`).

---

## 3. Automated Anomaly Signals

The platform records suspicious behaviors into the `fraud_signals` table:
- **`BURST_DWELL_ANOMALY`**: High volumes of impressions reporting exact synthetic dwell times within sub-minute intervals.
- **`SUSPICIOUS_TOKEN_REPLAY`**: Replaying tokens across different installations.
- **`MULTI_INSTALL_BURST`**: Multiple installations reporting impressions from identical IP addresses simultaneously.

Anomalous installations can be suspended immediately from the Admin Portal.
