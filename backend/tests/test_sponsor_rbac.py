import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import db_campaigns, db_installations, db_earnings, db_impressions

client = TestClient(app)


def test_sponsor_campaign_flow_and_rbac():
    # 1. Advertiser / Sponsor creates campaign -> Forced to PENDING_REVIEW
    create_payload = {
        "company_name": "VectorScale Systems",
        "campaign_name": "Q4 Vector Acceleration",
        "headline": "High-throughput vector indexing for autonomous agents",
        "description": "Enterprise pgvector deployment.",
        "destination_url": "https://vectorscale.example.com",
        "budget": 12000.0
    }
    
    resp = client.post("/v1/advertisers/campaigns", json=create_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    camp = data["campaign"]
    assert camp["status"] == "PENDING_REVIEW"
    camp_id = camp["id"]

    # 2. Verify URL safety validator rejects unsafe schemes
    unsafe_payload = dict(create_payload)
    unsafe_payload["destination_url"] = "javascript:alert(1)"
    bad_resp = client.post("/v1/advertisers/campaigns", json=unsafe_payload)
    assert bad_resp.status_code == 400

    # 3. Unapproved campaign is NOT served in public active campaign rotation
    # (Only ACTIVE campaigns with remaining budget are served)
    rot_resp = client.get("/v1/campaign")
    assert rot_resp.status_code == 200
    active_served = rot_resp.json()
    assert active_served["campaign_id"] != camp_id  # Pending campaign not served

    # 4. Non-admin cannot approve campaign without Admin Secret
    unauth_approve = client.post(f"/v1/admin/campaigns/{camp_id}/approve")
    assert unauth_approve.status_code == 401

    # 5. Admin approves campaign
    admin_approve = client.post(
        f"/v1/admin/campaigns/{camp_id}/approve",
        headers={"X-Admin-Secret": "super-secret-admin-key"}
    )
    assert admin_approve.status_code == 200
    assert admin_approve.json()["campaign"]["status"] == "ACTIVE"
