from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables or a local .env file.

    Secrets (database credentials, AI API keys) must come from environment
    variables or a local .env file that is never committed to Git.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Mana Hakku Backend"
    environment: str = "development"
    # Example (Supabase PostgreSQL, set in .env only):
    # postgresql+psycopg://USER:PASSWORD@HOST:5432/postgres?sslmode=require
    database_url: str = ""
    cors_origins: str = "http://127.0.0.1:8000,http://localhost:8000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
