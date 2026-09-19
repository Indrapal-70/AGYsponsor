from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List
from app.database import db_campaigns, db_installations, db_impressions, db_earnings
from app.auth import verify_admin

router = APIRouter(prefix="/v1/admin", tags=["Admin"])


@router.get("/campaigns")
def list_admin_campaigns(verified: bool = Depends(verify_admin)):
    """List all submitted campaigns for moderation (Admin only)"""
    return list(db_campaigns.values())


@router.post("/campaigns/{campaign_id}/approve")
def approve_campaign(campaign_id: str, verified: bool = Depends(verify_admin)):
    """Approve a campaign to set status to ACTIVE"""
    if campaign_id not in db_campaigns:
        raise HTTPException(status_code=404, detail="Campaign not found")

    db_campaigns[campaign_id]["status"] = "ACTIVE"
    return {"status": "success", "campaign": db_campaigns[campaign_id]}


@router.post("/campaigns/{campaign_id}/pause")
def pause_campaign(campaign_id: str, verified: bool = Depends(verify_admin)):
    """Pause an active campaign"""
    if campaign_id not in db_campaigns:
        raise HTTPException(status_code=404, detail="Campaign not found")

    db_campaigns[campaign_id]["status"] = "PAUSED"
    return {"status": "success", "campaign": db_campaigns[campaign_id]}


@router.post("/campaigns/{campaign_id}/reject")
def reject_campaign(campaign_id: str, verified: bool = Depends(verify_admin)):
    """Reject a campaign"""
    if campaign_id not in db_campaigns:
        raise HTTPException(status_code=404, detail="Campaign not found")

    db_campaigns[campaign_id]["status"] = "REJECTED"
    return {"status": "success", "campaign": db_campaigns[campaign_id]}


@router.get("/stats")
def get_admin_stats(verified: bool = Depends(verify_admin)):
    """System-wide admin metrics"""
    total_revenue = sum(e["gross_revenue"] for e in db_earnings)
    dev_payouts = sum(e["developer_share"] for e in db_earnings)

    return {
        "total_installations": len(db_installations),
        "total_campaigns": len(db_campaigns),
        "total_impressions": len(db_impressions),
        "gross_platform_revenue_inr": round(total_revenue, 2),
        "developer_rewards_paid_inr": round(dev_payouts, 2),
        "platform_net_revenue_inr": round(total_revenue - dev_payouts, 2)
    }
