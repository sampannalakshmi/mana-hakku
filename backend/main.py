
import logging

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from config import get_settings
from schemas import (
    HealthResponse,
    ScholarshipCreate,
    ScholarshipResponse,
    UserRegister,
    UserResponse,
    UserLogin,
    TokenResponse,
    ApplicationCreate,
    ApplicationResponse,
)

from database import engine, get_db
from models import Scholarship, User, Application
from security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_admin,
)

settings = get_settings()
logger = logging.getLogger("mana_hakku.health")

app = FastAPI(
    title=settings.app_name,
    version="0.3.0",
    description="Mana Hakku Scholarship API",
    docs_url="/docs" if settings.environment == "development" else None,
    redoc_url="/redoc" if settings.environment == "development" else None,
    openapi_url="/openapi.json" if settings.environment == "development" else None,
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
    database_connected = False

    if engine is not None:
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            database_connected = True
        except Exception as exc:
            logger.warning(
                "Health check: database check failed (%s)",
                type(exc).__name__,
            )

    return HealthResponse(
        status="ok" if database_connected else "degraded",
        service=settings.app_name,
        environment=settings.environment,
        database_connected=database_connected,
    )


# Student registration
@app.post(
    "/api/auth/register",
    response_model=UserResponse,
    status_code=201,
    tags=["authentication"],
)
def register_student(
    user_data: UserRegister,
    db: Session = Depends(get_db),
):
    normalized_email = str(user_data.email).strip().lower()

    existing_user = db.query(User).filter(
        func.lower(func.trim(User.email)) == normalized_email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )

    user = User(
        full_name=user_data.full_name.strip(),
        email=normalized_email,
        password_hash=hash_password(user_data.password),
        role="student",
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="The account could not be created. Please check the email and try again.",
        )

    return user


@app.get(
    "/api/scholarships",
    response_model=list[ScholarshipResponse],
    tags=["scholarships"],
)
def get_scholarships(db: Session = Depends(get_db)):
    return db.query(Scholarship).order_by(
        Scholarship.id.desc()
    ).all()


@app.get(
    "/api/scholarships/{scholarship_id}",
    response_model=ScholarshipResponse,
    tags=["scholarships"],
)
def get_scholarship(
    scholarship_id: int,
    db: Session = Depends(get_db),
):
    scholarship = db.query(Scholarship).filter(
        Scholarship.id == scholarship_id
    ).first()

    if scholarship is None:
        raise HTTPException(
            status_code=404,
            detail="Scholarship not found",
        )

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
    current_user: User = Depends(require_admin),
):
    scholarship = Scholarship(**scholarship_data.model_dump())

    db.add(scholarship)
    db.commit()
    db.refresh(scholarship)

    return scholarship

@app.post(
    "/api/auth/login",
    response_model=TokenResponse,
    tags=["authentication"],
)
def login_student(
    login_data: UserLogin,
    db: Session = Depends(get_db),
):
    normalized_email = str(login_data.email).strip().lower()

    user = db.query(User).filter(
        func.lower(func.trim(User.email)) == normalized_email
    ).first()

    if user is None or not verify_password(
        login_data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password.",
        )

    access_token = create_access_token(str(user.id))

    return TokenResponse(access_token=access_token)
@app.get(
    "/api/auth/me",
    response_model=UserResponse,
    tags=["authentication"],
)
def get_my_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user
@app.post(
    "/api/applications",
    response_model=ApplicationResponse,
    status_code=201,
    tags=["applications"],
)
def create_application(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scholarship = db.query(Scholarship).filter(
        Scholarship.id == application_data.scholarship_id
    ).first()

    if scholarship is None:
        raise HTTPException(
            status_code=404,
            detail="Scholarship not found.",
        )

    existing = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.scholarship_id == application_data.scholarship_id,
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="You have already applied for this scholarship.",
        )

    application = Application(
        user_id=current_user.id,
        scholarship_id=application_data.scholarship_id,
        status="draft",
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


@app.get(
    "/api/applications",
    response_model=list[ApplicationResponse],
    tags=["applications"],
)
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Application).filter(
        Application.user_id == current_user.id
    ).order_by(Application.id.desc()).all()