

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional
from datetime import datetime

class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str
    database_connected: bool


# Authentication schemas
class UserRegister(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Scholarship schemas
class ScholarshipCreate(BaseModel):
    name: str
    provider: Optional[str] = None
    description: Optional[str] = None
    eligibility: Optional[str] = None
    deadline: Optional[str] = None
    official_url: Optional[str] = None
    is_verified: bool = False


class ScholarshipResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    provider: Optional[str] = None
    description: Optional[str] = None
    eligibility: Optional[str] = None
    deadline: Optional[str] = None
    official_url: Optional[str] = None
    is_verified: Optional[bool] = False
# Application schemas
class ApplicationCreate(BaseModel):
    scholarship_id: int


class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    scholarship_id: Optional[int] = None
    status: str
    submitted_at: Optional[datetime] = None
    created_at: Optional[datetime] = None