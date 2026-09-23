from fastapi import Header, HTTPException, status
import uuid

# Demo user storage
demo_users = {
    "dev_demo_id": {
        "id": "dev_demo_id",
        "email": "developer@example.com",
        "full_name": "Demo Developer",
        "role": "developer"
    }
}


def get_current_user(authorization: str = Header(None)):
    """Extract authenticated user or fallback to demo user if authorization header is provided"""
    if not authorization:
        # Fallback to demo user for simple testing
        return demo_users["dev_demo_id"]

    token = authorization.replace("Bearer ", "").strip()
    if token in demo_users:
        return demo_users[token]

    # Return default demo user if token is present
    return {
        "id": f"user_{token[:8]}",
        "email": f"user_{token[:6]}@example.com",
        "full_name": "Authenticated Developer",
        "role": "developer"
    }


def verify_admin(x_admin_secret: str = Header(None)):
    """Verify admin secret key"""
    if not x_admin_secret or x_admin_secret != "super-secret-admin-key":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing X-Admin-Secret header"
        )
    return True
