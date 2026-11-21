
from pydantic import BaseModel, ConfigDict
from typing import Optional


class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str
    database_connected: bool


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
