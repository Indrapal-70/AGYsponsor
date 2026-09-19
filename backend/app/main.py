from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.installations import router as installations_router
from app.campaigns import router as campaigns_router
from app.sessions import router as events_router
from app.advertisers import router as advertisers_router
from app.admin import router as admin_router

app = FastAPI(
    title="AgentSponsor API",
    version="0.1.0",
    description="AgentSponsor Backend Service - Monetize AI agent working time safely."
)

# Enable CORS for local web dashboard and extension communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


@app.get("/health", response_model=HealthResponse)
def health_check():
    return {
        "status": "ok",
        "service": "agentsponsor-api",
        "version": "0.1.0"
    }


# Include Routers
app.include_router(installations_router)
app.include_router(campaigns_router)
app.include_router(events_router)
app.include_router(advertisers_router)
app.include_router(admin_router)
