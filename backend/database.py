
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from config import get_settings


settings = get_settings()


class Base(DeclarativeBase):
    pass


engine = None
SessionLocal = None

if settings.database_url:
    engine = create_engine(
        settings.database_url,
        pool_pre_ping=True,
        connect_args={"connect_timeout": 5},
    )

    SessionLocal = sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
    )


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a database session."""

    if SessionLocal is None:
        raise RuntimeError(
            "DATABASE_URL is not set. The database is not configured."
        )

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
