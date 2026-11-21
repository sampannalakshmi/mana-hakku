
import logging

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from config import get_settings
from schemas import (
    HealthResponse,
    ScholarshipCreate,
    ScholarshipResponse,
)
from database import engine, get_db
from models import Scholarship

settings = get_settings()
logger = logging.getLogger("mana_hakku.health")

app = FastAPI(
    title=settings.app_name,
    version="0.2.0",
    description="Mana Hakku Scholarship API - Development",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse, tags=["health"])
def health() -> HealthResponse:
    """Confirms the backend is running and runs SELECT 1 against the database.

    Always returns HTTP 200 so the health endpoint itself stays reachable.
    Error details are logged by exception class name only, never the message,
    because messages can contain hostnames or credentials.
    """
    database_connected = False
    if engine is not None:
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            database_connected = True
        except Exception as exc:  # any failure means not connected
            logger.warning("Health check: database check failed (%s)", type(exc).__name__)
    return HealthResponse(
        status="ok" if database_connected else "degraded",
        service=settings.app_name,
        environment=settings.environment,
        database_connected=database_connected,
    )


@app.get(
    "/api/scholarships",
    response_model=list[ScholarshipResponse],
    tags=["scholarships"],
)
def get_scholarships(db: Session = Depends(get_db)):
    return db.query(Scholarship).order_by(Scholarship.id.desc()).all()


@app.get(
    "/api/scholarships/{scholarship_id}",
    response_model=ScholarshipResponse,
    tags=["scholarships"],
)
def get_scholarship(scholarship_id: int, db: Session = Depends(get_db)):
    scholarship = db.query(Scholarship).filter(
        Scholarship.id == scholarship_id
    ).first()

    if scholarship is None:
        raise HTTPException(status_code=404, detail="Scholarship not found")

    return scholarship


@app.post(
    "/api/scholarships",
    response_model=ScholarshipResponse,
    status_code=201,
    tags=["scholarships"],
)
def create_scholarship(
    scholarship_data: ScholarshipCreate,
    db: Session = Depends(get_db),
):
    scholarship = Scholarship(**scholarship_data.model_dump())

    db.add(scholarship)
    db.commit()
    db.refresh(scholarship)

    return scholarship
