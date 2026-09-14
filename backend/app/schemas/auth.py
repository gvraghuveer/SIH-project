from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserRegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    badge_id: str
    station_code: str
    clearance: str = "Tier 1 - Unit Attribution"
    role: str = "investigator"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    badge_id: str
    station_code: str
    clearance: str
    role: str
    status: str
    created_at: str

class RoleUpdateRequest(BaseModel):
    role: str
    status: Optional[str] = None
    clearance: Optional[str] = None
