from fastapi.testclient import TestClient
from app.main import app
from app.campaigns import validate_url_safety

client = TestClient(app)


def test_get_campaign():
    response = client.get("/v1/campaign")
    assert response.status_code == 200
    data = response.json()
    assert "campaign_id" in data
    assert "headline" in data
    assert "destination_url" in data


def test_validate_url_safety():
    assert validate_url_safety("https://example.com") is True
    assert validate_url_safety("http://example.com") is True
    assert validate_url_safety("javascript:alert(1)") is False
    assert validate_url_safety("data:text/html,hack") is False
    assert validate_url_safety("file:///etc/passwd") is False
