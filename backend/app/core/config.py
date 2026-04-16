from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database — Render gives postgresql://, we need postgresql+asyncpg://
    DATABASE_URL: str = "postgresql+asyncpg://agripulse:agripulse@localhost:5432/agripulse"

    # External APIs
    NASA_POWER_BASE_URL: str = "https://power.larc.nasa.gov/api/temporal/daily/point"
    OPEN_METEO_BASE_URL: str = "https://api.open-meteo.com/v1"
    SENTINEL_CDSE_BASE_URL: str = "https://opbs.sentinel-hub.com"
    SMAP_BASE_URL: str = "https://n5eil01u.eosdis.nasa.gov"
    NOAA_VHI_BASE_URL: str = "https://www.star.nesdis.noaa.gov/smcd/emb/vci/VH"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # App Settings
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    APP_NAME: str = "AgriPulse Intelligence"
    API_PREFIX: str = "/api/v1"

    # CORS
    CORS_ORIGINS: str = "http://localhost,http://localhost:3000,http://localhost:8000"

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        """Convert standard postgresql:// URL to asyncpg format."""
        url = self.DATABASE_URL
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        return url

    @property
    def ALLOWED_ORIGINS(self) -> list:
        """Parse comma-separated CORS origins string into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
