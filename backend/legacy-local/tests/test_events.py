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


def test_generic_events_endpoint_and_deduplication():
    inst_id = f"inst_gen_{uuid.uuid4().hex}"
    convo_id = f"convo_{uuid.uuid4().hex}"

    # 1. Test generic session_started
    start_evt_id = f"evt_start_{uuid.uuid4().hex}"
    resp_start = client.post("/v1/events", json={
        "event_id": start_evt_id,
        "installation_id": inst_id,
        "event_type": "session_started",
        "conversation_id": convo_id
    })
    assert resp_start.status_code == 200
    assert resp_start.json()["status"] == "success"

    # Duplicate event_id should return duplicate status
    resp_start_dup = client.post("/v1/events", json={
        "event_id": start_evt_id,
        "installation_id": inst_id,
        "event_type": "session_started",
        "conversation_id": convo_id
    })
    assert resp_start_dup.json()["status"] == "duplicate"

    # 2. Test generic eligible_impression
    imp_evt_id = f"evt_imp_{uuid.uuid4().hex}"
    resp_imp = client.post("/v1/events", json={
        "event_id": imp_evt_id,
        "installation_id": inst_id,
        "event_type": "eligible_impression",
        "campaign_id": "cmp_demo_001",
        "conversation_id": convo_id,
        "exposure_duration_seconds": 5.0
    })
    assert resp_imp.status_code == 200
    data_imp = resp_imp.json()
    assert data_imp["status"] == "success"
    assert data_imp["is_eligible"] is True
    assert data_imp["developer_share"] > 0

    # 3. Test duplicate impression prevention in same conversation
    imp_evt_id_2 = f"evt_imp_{uuid.uuid4().hex}"
    resp_imp_dup = client.post("/v1/events", json={
        "event_id": imp_evt_id_2,
        "installation_id": inst_id,
        "event_type": "eligible_impression",
        "campaign_id": "cmp_demo_001",
        "conversation_id": convo_id,
        "exposure_duration_seconds": 5.0
    })
    assert resp_imp_dup.status_code == 200
    assert resp_imp_dup.json()["status"] == "duplicate_impression"

    # 4. Test generic session_ended
    end_evt_id = f"evt_end_{uuid.uuid4().hex}"
    resp_end = client.post("/v1/events", json={
        "event_id": end_evt_id,
        "installation_id": inst_id,
        "event_type": "session_ended",
        "conversation_id": convo_id
    })
    assert resp_end.status_code == 200
    assert resp_end.json()["status"] == "success"

