from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional


# ==================================================
# User Schemas
# ==================================================

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str
    organization: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ==========================
# Google OAuth Schemas
# ==========================

# Step 1: Verify Google Login
class GoogleLogin(BaseModel):
    token: str


# Step 2: Complete Google Registration
class GoogleRegister(BaseModel):
    token: str
    role: str
    organization: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    organization: Optional[str] = None
    auth_provider: str

    class Config:
        from_attributes = True


# ==================================================
# Textile Inventory Schemas
# ==================================================

class TextileInventoryCreate(BaseModel):
    waste_batch_id: str
    fabric_type: str
    source: str
    quantity: float
    color: Optional[str] = None
    condition: Optional[str] = None
    collection_date: date


class TextileInventoryResponse(TextileInventoryCreate):
    id: int
    created_by: int

    class Config:
        from_attributes = True

# ==========================
# Profile Update Schema
# ==========================

class ProfileUpdate(BaseModel):
    full_name: str
    organization: str