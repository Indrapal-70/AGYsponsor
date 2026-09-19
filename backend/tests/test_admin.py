from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_admin_unauthorized_without_header():
    resp = client.get("/v1/admin/campaigns")
    assert resp.status_code == 401


def test_admin_authorized_with_header():
    resp = client.get("/v1/admin/campaigns", headers={"X-Admin-Secret": "super-secret-admin-key"})
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
