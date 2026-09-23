from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
import uuid
from app.database import db_installations, db_users

router = APIRouter(prefix="/v1", tags=["Installations"])


class InstallationRegisterRequest(BaseModel):
    installation_id: str
    os: Optional[str] = "linux"
    client_version: Optional[str] = "0.1.0"


class InstallationLinkRequest(BaseModel):
    installation_id: str
    user_id: str


@router.post("/installations")
def register_installation(req: InstallationRegisterRequest):
    """Register or heartbeat an installation UUID"""
    inst_id = req.installation_id.strip()
    if not inst_id:
        raise HTTPException(status_code=400, detail="installation_id is required")

    now = datetime.now(timezone.utc).isoformat()
    if inst_id in db_installations:
        db_installations[inst_id]["last_seen_at"] = now
        db_installations[inst_id]["status"] = "active"
    else:
        db_installations[inst_id] = {
            "id": inst_id,
            "installation_uuid": inst_id,
            "user_id": None,
            "os": req.os,
            "client_version": req.client_version,
            "status": "active",
            "created_at": now,
            "last_seen_at": now
        }

    return {
        "status": "success",
        "installation_id": inst_id,
        "is_linked": db_installations[inst_id]["user_id"] is not None
    }


@router.post("/installations/link")
def link_installation(req: InstallationLinkRequest):
    """Link an installation UUID to an authenticated developer account"""
    inst_id = req.installation_id.strip()
    if inst_id not in db_installations:
        # Auto-register if missing
        now = datetime.now(timezone.utc).isoformat()
        db_installations[inst_id] = {
            "id": inst_id,
            "installation_uuid": inst_id,
            "user_id": req.user_id,
            "os": "unknown",
            "client_version": "0.1.0",
            "status": "active",
            "created_at": now,
            "last_seen_at": now
        }

    db_installations[inst_id]["user_id"] = req.user_id
    return {
        "status": "success",
        "message": f"Installation {inst_id} linked to user {req.user_id}",
        "installation_id": inst_id,
        "user_id": req.user_id
    }
