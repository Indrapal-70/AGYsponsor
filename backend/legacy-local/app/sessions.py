from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
import uuid
from app.database import (
    db_sessions, db_impressions, db_earnings, db_events, db_installations, db_campaigns
)

router = APIRouter(prefix="/v1", tags=["Events & Earnings"])


class SessionStartRequest(BaseModel):
    event_id: str
    installation_id: str
    conversation_id: Optional[str] = None


class SessionEndRequest(BaseModel):
    event_id: str
    installation_id: str
    session_id: str


class ImpressionRequest(BaseModel):
    event_id: str
    installation_id: str
    session_id: str
    campaign_id: str
    exposure_duration_seconds: float = 5.0


class GenericEventRequest(BaseModel):
    event_id: str
    installation_id: str
    event_type: str
    timestamp: Optional[float] = None
    campaign_id: Optional[str] = None
    conversation_id: Optional[str] = None
    session_id: Optional[str] = None
    exposure_duration_seconds: Optional[float] = 5.0


@router.post("/events")
def handle_generic_event(req: GenericEventRequest):
    """Handle generic telemetry and impression events from the plugin with idempotency"""
    if req.event_id in db_events:
        return {"status": "duplicate", "event_id": req.event_id}

    now = datetime.now(timezone.utc).isoformat()
    db_events.add(req.event_id)

    event_type = req.event_type.lower().replace("-", "_")

    if event_type in ("session_started", "session_start"):
        session_id = req.session_id or f"sess_{uuid.uuid4().hex[:12]}"
        db_sessions[session_id] = {
            "id": session_id,
            "installation_id": req.installation_id,
            "conversation_id": req.conversation_id,
            "status": "active",
            "started_at": now,
            "ended_at": None
        }
        return {"status": "success", "session_id": session_id, "event_id": req.event_id}

    elif event_type in ("session_ended", "session_end"):
        matched = False
        for s in db_sessions.values():
            if (req.session_id and s["id"] == req.session_id) or (req.conversation_id and s.get("conversation_id") == req.conversation_id):
                s["status"] = "ended"
                s["ended_at"] = now
                matched = True
        return {"status": "success", "event_id": req.event_id}

    elif event_type in ("eligible_impression", "impression"):
        campaign_id = req.campaign_id or "cmp_demo_001"
        session_key = req.session_id or req.conversation_id or req.installation_id

        # Check for duplicate impressions within same session/conversation
        for imp in db_impressions.values():
            if imp.get("campaign_id") == campaign_id and (
                imp.get("installation_id") == req.installation_id and
                (imp.get("session_id") == session_key or imp.get("conversation_id") == req.conversation_id)
            ):
                return {"status": "duplicate_impression", "event_id": req.event_id, "campaign_id": campaign_id}

        duration = req.exposure_duration_seconds if req.exposure_duration_seconds is not None else 5.0
        is_eligible = duration >= 2.0
        imp_id = f"imp_{uuid.uuid4().hex[:12]}"

        imp_record = {
            "id": imp_id,
            "event_id": req.event_id,
            "session_id": session_key,
            "conversation_id": req.conversation_id,
            "campaign_id": campaign_id,
            "installation_id": req.installation_id,
            "exposure_duration_seconds": duration,
            "is_eligible": is_eligible,
            "created_at": now
        }
        db_impressions[imp_id] = imp_record

        developer_share = 0.0
        if is_eligible:
            gross_revenue = 0.40
            developer_share = round(gross_revenue * 0.30, 2)
            user_id = "dev_demo_id"
            if req.installation_id in db_installations and db_installations[req.installation_id].get("user_id"):
                user_id = db_installations[req.installation_id]["user_id"]

            campaign_name = db_campaigns.get(campaign_id, {}).get("advertiser_name", "CloudForge Demo")
            earning_record = {
                "id": f"earn_{uuid.uuid4().hex[:12]}",
                "user_id": user_id,
                "installation_id": req.installation_id,
                "campaign_id": campaign_id,
                "campaign_name": campaign_name,
                "impression_id": imp_id,
                "gross_revenue": gross_revenue,
                "developer_share": developer_share,
                "currency": "INR",
                "created_at": now
            }
            db_earnings.append(earning_record)

        return {
            "status": "success",
            "event_id": req.event_id,
            "impression_id": imp_id,
            "is_eligible": is_eligible,
            "developer_share": developer_share
        }

    return {"status": "success", "event_id": req.event_id}


@router.post("/events/session-start")
def session_start(req: SessionStartRequest):
    """Register agent session start with server-side idempotency"""
    if req.event_id in db_events:
        return {"status": "duplicate", "event_id": req.event_id, "session_id": f"sess_{req.event_id[:8]}"}

    db_events.add(req.event_id)
    session_id = f"sess_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc).isoformat()

    db_sessions[session_id] = {
        "id": session_id,
        "installation_id": req.installation_id,
        "conversation_id": req.conversation_id,
        "status": "active",
        "started_at": now,
        "ended_at": None
    }

    return {"status": "success", "session_id": session_id, "event_id": req.event_id}


@router.post("/events/session-end")
def session_end(req: SessionEndRequest):
    """Register agent session end"""
    if req.event_id in db_events:
        return {"status": "duplicate", "event_id": req.event_id}

    db_events.add(req.event_id)
    now = datetime.now(timezone.utc).isoformat()

    if req.session_id in db_sessions:
        db_sessions[req.session_id]["status"] = "ended"
        db_sessions[req.session_id]["ended_at"] = now

    return {"status": "success", "session_id": req.session_id, "event_id": req.event_id}


@router.post("/events/impression")
def record_impression(req: ImpressionRequest):
    """Register eligible impression and compute developer revenue share server-side"""
    if req.event_id in db_events:
        return {"status": "duplicate", "event_id": req.event_id}

    db_events.add(req.event_id)
    now = datetime.now(timezone.utc).isoformat()
    imp_id = f"imp_{uuid.uuid4().hex[:12]}"

    # Validate eligibility: minimum exposure time = 2.0s
    is_eligible = req.exposure_duration_seconds >= 2.0

    imp_record = {
        "id": imp_id,
        "event_id": req.event_id,
        "session_id": req.session_id,
        "campaign_id": req.campaign_id,
        "installation_id": req.installation_id,
        "exposure_duration_seconds": req.exposure_duration_seconds,
        "is_eligible": is_eligible,
        "created_at": now
    }
    db_impressions[imp_id] = imp_record

    # Calculate revenue share server-side if eligible
    developer_share = 0.0
    if is_eligible:
        gross_revenue = 0.40  # ₹0.40 per eligible impression
        developer_share = round(gross_revenue * 0.30, 2)  # 30% dev share = ₹0.12

        # Link to user if installation is linked
        user_id = "dev_demo_id"
        if req.installation_id in db_installations and db_installations[req.installation_id].get("user_id"):
            user_id = db_installations[req.installation_id]["user_id"]

        campaign_name = db_campaigns.get(req.campaign_id, {}).get("advertiser_name", "CloudForge")

        earning_record = {
            "id": f"earn_{uuid.uuid4().hex[:12]}",
            "user_id": user_id,
            "installation_id": req.installation_id,
            "campaign_id": req.campaign_id,
            "campaign_name": campaign_name,
            "impression_id": imp_id,
            "gross_revenue": gross_revenue,
            "developer_share": developer_share,
            "currency": "INR",
            "created_at": now
        }
        db_earnings.append(earning_record)

    return {
        "status": "success",
        "impression_id": imp_id,
        "is_eligible": is_eligible,
        "developer_share": developer_share
    }


@router.get("/me/earnings")
def get_user_earnings():
    """Fetch aggregated earnings ledger for current user"""
    total_earnings = sum(item["developer_share"] for item in db_earnings)
    eligible_impressions = len(db_earnings)
    total_sessions = len(db_sessions)

    return {
        "total_earnings_inr": round(total_earnings, 2),
        "total_sessions": total_sessions,
        "eligible_impressions": eligible_impressions,
        "monthly_earnings_inr": round(total_earnings, 2),
        "currency": "INR",
        "recent_activity": db_earnings[-10:]  # Last 10 earnings items
    }


@router.get("/me")
def get_user_profile():
    """Fetch user profile"""
    return {
        "user_id": "dev_demo_id",
        "email": "developer@example.com",
        "full_name": "Demo Developer",
        "role": "developer"
    }
