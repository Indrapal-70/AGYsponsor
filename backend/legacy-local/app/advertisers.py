from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime, timezone
import uuid
from app.database import db_campaigns, db_advertisers
from app.campaigns import validate_url_safety

router = APIRouter(prefix="/v1", tags=["Advertisers"])


class CampaignCreateRequest(BaseModel):
    company_name: str
    campaign_name: str
    headline: str
    description: str
    destination_url: str
    budget: float = 10000.0


@router.post("/advertisers/campaigns")
def create_campaign(req: CampaignCreateRequest):
    """Submit a new campaign for review"""
    if not validate_url_safety(req.destination_url):
        raise HTTPException(
            status_code=400,
            detail="Invalid or unsafe destination URL. Must start with http:// or https://"
        )

    cid = f"cmp_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()

    campaign = {
        "id": cid,
        "advertiser_id": "adv_demo_100",
        "advertiser_name": req.company_name,
        "campaign_name": req.campaign_name,
        "headline": req.headline,
        "description": req.description,
        "destination_url": req.destination_url,
        "creative_version": 1,
        "budget": req.budget,
        "status": "PENDING_REVIEW",  # Default status for new campaigns
        "created_at": now
    }

    db_campaigns[cid] = campaign
    return {"status": "success", "campaign": campaign}


@router.get("/advertisers/campaigns")
def list_advertiser_campaigns():
    """List all campaigns submitted by advertiser"""
    return list(db_campaigns.values())
