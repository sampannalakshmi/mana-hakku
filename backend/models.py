from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, func, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), default="student")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    education_level = Column(String(100))
    institution = Column(String(200))
    category = Column(String(100))
    state = Column(String(100))
    annual_family_income = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    provider = Column(String(200))
    description = Column(Text)
    eligibility = Column(Text)
    deadline = Column(String(100))
    official_url = Column(Text)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (
        UniqueConstraint("user_id", "scholarship_id", name="uq_applications_user_scholarship"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scholarship_id = Column(Integer, ForeignKey("scholarships.id"))
    status = Column(String(50), default="draft")
    submitted_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_name = Column(String(255), nullable=False)
    file_reference = Column(Text)
    verification_status = Column(String(50), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ApplicationTracking(Base):
    __tablename__ = "application_tracking"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    status = Column(String(100), nullable=False)
    remarks = Column(Text)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
