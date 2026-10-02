import httpx
import json
import uuid

BASE_URL = "http://127.0.0.1:8000"
client = httpx.Client(base_url=BASE_URL)

print("=== 1. Health Check ===")
r = client.get("/health")
print(f"[{r.status_code}]", json.dumps(r.json(), indent=2))

print("\n=== 2. Register Installation UUID ===")
inst_id = "inst_sample_tok_9912"
r = client.post("/v1/installations", json={
    "installation_id": inst_id,
    "os": "windows",
    "client_version": "0.1.0"
})
print(f"[{r.status_code}]", json.dumps(r.json(), indent=2))

print("\n=== 3. Link Installation to User Account ===")
r = client.post("/v1/installations/link", json={
    "installation_id": inst_id,
    "user_id": "dev_demo_id"
})
print(f"[{r.status_code}]", json.dumps(r.json(), indent=2))

print("\n=== 4. Fetch Active Campaign ===")
r = client.get("/v1/campaign", params={"installation_id": inst_id})
print(f"[{r.status_code}]", json.dumps(r.json(), indent=2))

print("\n=== 5. Session Start Event ===")
sess_event_id = f"evt_sess_{uuid.uuid4().hex[:8]}"
r = client.post("/v1/events/session-start", json={
    "event_id": sess_event_id,
    "installation_id": inst_id,
    "conversation_id": "conv_agent_123"
})
print(f"[{r.status_code}]", json.dumps(r.json(), indent=2))

print("\n=== 6. Record Eligible Impression (5s Exposure) ===")
imp_event_id = f"evt_imp_{uuid.uuid4().hex[:8]}"
r = client.post("/v1/events/impression", json={
    "event_id": imp_event_id,
    "installation_id": inst_id,
    "session_id": "sess_conv_123",
    "campaign_id": "cmp_demo_001",
    "exposure_duration_seconds": 5.0
})
print(f"[{r.status_code}]", json.dumps(r.json(), indent=2))

print("\n=== 7. Developer Earnings Ledger (Bearer Token) ===")
r = client.get("/v1/me/earnings", headers={"Authorization": "Bearer dev_demo_id"})
print(f"[{r.status_code}]", json.dumps(r.json(), indent=2))

print("\n=== 8. Advertiser Create Campaign ===")
r = client.post("/v1/advertisers/campaigns", json={
    "company_name": "Supabase",
    "campaign_name": "Postgres Vector Launch",
    "headline": "Vector DB for Agentic AI",
    "description": "Scale your agent memory with pgvector on Supabase.",
    "destination_url": "https://supabase.com",
    "budget": 15000.0
})
print(f"[{r.status_code}]", json.dumps(r.json(), indent=2))
new_cid = r.json()["campaign"]["id"]

print("\n=== 9. Admin Review & Approve Campaign (Admin Secret) ===")
r = client.post(f"/v1/admin/campaigns/{new_cid}/approve", headers={"X-Admin-Secret": "super-secret-admin-key"})
print(f"[{r.status_code}]", json.dumps(r.json(), indent=2))

print("\n=== 10. Admin Platform Metrics (Admin Secret) ===")
r = client.get("/v1/admin/stats", headers={"X-Admin-Secret": "super-secret-admin-key"})
print(f"[{r.status_code}]", json.dumps(r.json(), indent=2))
