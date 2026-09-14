from datetime import datetime, timedelta
import jwt
from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

# Pre-seeded Demo Officer Accounts (Ready out of the box)
DEMO_USERS: Dict[str, Dict[str, Any]] = {
    "admin@chakravyuh.in": {
        "id": "u-admin",
        "email": "admin@chakravyuh.in",
        "password": "admin123",
        "full_name": "Inspector A. Sharma",
        "badge_id": "I4C-IND-88219",
        "station_code": "CYBER-PS-I4C-DELHI",
        "clearance": "Tier 3 - Cross-Border / FIU",
        "role": "admin",
        "status": "active",
        "created_at": "2026-06-02T09:15:00Z"
    },
    "r.iyer@police.gov.in": {
        "id": "u-io-1",
        "email": "r.iyer@police.gov.in",
        "password": "demo1234",
        "full_name": "SI R. Iyer",
        "badge_id": "MH-CYB-4417",
        "station_code": "CID-CYBER-MUMBAI",
        "clearance": "Tier 2 - National Attribution",
        "role": "investigator",
        "status": "active",
        "created_at": "2026-07-19T06:40:00Z"
    },
    "k.menon@police.gov.in": {
        "id": "u-io-2",
        "email": "k.menon@police.gov.in",
        "password": "demo1234",
        "full_name": "ASI K. Menon",
        "badge_id": "KA-STF-2290",
        "station_code": "STF-CYBER-BENGALURU",
        "clearance": "Tier 1 - Unit Attribution",
        "role": "investigator",
        "status": "active",
        "created_at": "2026-08-30T11:05:00Z"
    },
    "audit.cell@fiuind.gov.in": {
        "id": "u-view-1",
        "email": "audit.cell@fiuind.gov.in",
        "password": "demo1234",
        "full_name": "FIU Audit Cell",
        "badge_id": "FIU-OBS-0031",
        "station_code": "FIU-IND-NODAL-CELL",
        "clearance": "Tier 1 - Unit Attribution",
        "role": "viewer",
        "status": "active",
        "created_at": "2026-09-01T14:22:00Z"
    }
}

AUDIT_LOGS = [
    { "id": 1, "actor_email": "admin@chakravyuh.in", "action": "system.init", "target": "CHAKRAVYUH_CORE", "created_at": "2026-09-10T08:00:00Z" },
    { "id": 2, "actor_email": "admin@chakravyuh.in", "action": "dossier.approved", "target": "SIH/2026/00412", "created_at": "2026-09-12T10:12:00Z" },
    { "id": 3, "actor_email": "r.iyer@police.gov.in", "action": "account.signin", "target": "r.iyer@police.gov.in", "created_at": "2026-09-14T06:41:00Z" },
]

security_bearer = HTTPBearer(auto_error=False)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None

async def get_current_user(auth: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)) -> Dict[str, Any]:
    if not auth or not auth.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    email = payload["sub"]
    user = DEMO_USERS.get(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Officer account not found"
        )
    return user

async def get_current_active_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    if current_user.get("status") != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Officer account is pending departmental verification"
        )
    return current_user

async def require_admin(current_user: Dict[str, Any] = Depends(get_current_active_user)) -> Dict[str, Any]:
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative clearance required for this operation"
        )
    return current_user
