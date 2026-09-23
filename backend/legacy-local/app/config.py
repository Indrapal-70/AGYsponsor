import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "AgentSponsor API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/v1"

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./agentsponsor.db")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    ADMIN_SECRET: str = os.getenv("ADMIN_SECRET", "super-secret-admin-key")

    # Financial configurations
    DEVELOPER_REVENUE_SHARE_PERCENT: float = 30.0  # 30% developer share

    class Config:
        case_sensitive = True


settings = Settings()
