from datetime import datetime, timezone
import uuid

# In-Memory Database Store for MVP
db_users = {}
db_installations = {}
db_campaigns = {
    "cmp_demo_001": {
        "id": "cmp_demo_001",
        "advertiser_id": "adv_demo_100",
        "advertiser_name": "CloudForge Demo",
        "headline": "Deploy your AI backend in seconds",
        "description": "GPU infrastructure built for developers.",
        "destination_url": "https://example.com",
        "creative_version": 1,
        "budget": 10000.0,
        "status": "ACTIVE",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
}
db_sessions = {}
db_impressions = {}
db_earnings = []
db_advertisers = {
    "adv_demo_100": {
        "id": "adv_demo_100",
        "company_name": "CloudForge Demo",
        "contact_email": "advertiser@cloudforge.example",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
}
db_events = set()  # Event ID set for idempotency check


def get_db():
    """Yield database context"""
    yield {
        "users": db_users,
        "installations": db_installations,
        "campaigns": db_campaigns,
        "sessions": db_sessions,
        "impressions": db_impressions,
        "earnings": db_earnings,
        "advertisers": db_advertisers,
        "events": db_events,
    }
