from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, HttpUrl
from typing import Optional
from app.database import db_campaigns
import re

router = APIRouter(prefix="/v1", tags=["Campaigns"])


class CampaignResponse(BaseModel):
    campaign_id: str
    advertiser_name: str
    headline: str
    description: str
    destination_url: str
    creative_version: int


def validate_url_safety(url: str) -> bool:
    """Validate destination URL safety - prevent javascript:, data:, file: schemes"""
    lowered = url.strip().lower()
    if lowered.startswith("javascript:") or lowered.startswith("data:") or lowered.startswith("file:"):
        return False
    if not (lowered.startswith("http://") or lowered.startswith("https://")):
        return False
    return True


@router.get("/campaign", response_model=CampaignResponse)
def get_campaign(installation_id: Optional[str] = Query(None)):
    """Fetch an active campaign for display in the plugin"""
    # Filter active campaigns
    active_campaigns = [c for c in db_campaigns.values() if c.get("status") == "ACTIVE"]

    if not active_campaigns:
        # Fallback default campaign if no active campaigns
        return {
            "campaign_id": "cmp_fallback_000",
            "advertiser_name": "AgentSponsor",
            "headline": "Support open source developers",
            "description": "Monetize AI agent thinking time safely.",
            "destination_url": "https://github.com/Indrapal-70/AGYsponsor",
            "creative_version": 1
        }

    # Select first active campaign
    campaign = active_campaigns[0]
    dest = campaign["destination_url"]
    if not validate_url_safety(dest):
        dest = "https://example.com"

    return {
        "campaign_id": campaign["id"],
        "advertiser_name": campaign["advertiser_name"],
        "headline": campaign["headline"],
        "description": campaign["description"],
        "destination_url": dest,
        "creative_version": campaign.get("creative_version", 1)
    }
