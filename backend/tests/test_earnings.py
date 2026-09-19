from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_earnings():
    resp = client.get("/v1/me/earnings")
    assert resp.status_code == 200
    data = resp.json()
    assert "total_earnings_inr" in data
    assert "recent_activity" in data
