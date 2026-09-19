from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)


def test_session_lifecycle_and_idempotency():
    evt_id = f"evt_{uuid.uuid4().hex}"
    inst_id = f"inst_{uuid.uuid4().hex}"

    # Start session
    resp1 = client.post("/v1/events/session-start", json={
        "event_id": evt_id,
        "installation_id": inst_id
    })
    assert resp1.status_code == 200
    data1 = resp1.json()
    assert data1["status"] == "success"
    session_id = data1["session_id"]

    # Duplicate start session check
    resp1_dup = client.post("/v1/events/session-start", json={
        "event_id": evt_id,
        "installation_id": inst_id
    })
    assert resp1_dup.json()["status"] == "duplicate"

    # Impression record
    imp_evt = f"evt_imp_{uuid.uuid4().hex}"
    resp_imp = client.post("/v1/events/impression", json={
        "event_id": imp_evt,
        "installation_id": inst_id,
        "session_id": session_id,
        "campaign_id": "cmp_demo_001",
        "exposure_duration_seconds": 5.0
    })
    assert resp_imp.status_code == 200
    assert resp_imp.json()["is_eligible"] is True
    assert resp_imp.json()["developer_share"] > 0
