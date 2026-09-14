from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, status
from typing import Dict, Any, List
from app.core.security import (
    DEMO_USERS,
    AUDIT_LOGS,
    create_access_token,
    get_current_user,
    get_current_active_user,
    require_admin
)
from app.schemas.auth import (
    UserLoginRequest,
    UserRegisterRequest,
    TokenResponse,
    UserProfileResponse,
    RoleUpdateRequest
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login(req: UserLoginRequest):
    email = req.email.strip().lower()
    user = DEMO_USERS.get(email)
    
    if not user or user["password"] != req.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid departmental officer email or password"
        )
        
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    
    # Audit trail entry
    AUDIT_LOGS.insert(0, {
        "id": len(AUDIT_LOGS) + 1,
        "actor_email": user["email"],
        "action": "account.signin",
        "target": user["email"],
        "created_at": datetime.utcnow().isoformat() + "Z"
    })
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )

@router.post("/register", response_model=TokenResponse)
async def register(req: UserRegisterRequest):
    email = req.email.strip().lower()
    if email in DEMO_USERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An officer account is already registered with this email"
        )
        
    new_user = {
        "id": f"u-io-{len(DEMO_USERS) + 1}",
        "email": email,
        "password": req.password,
        "full_name": req.full_name,
        "badge_id": req.badge_id,
        "station_code": req.station_code,
        "clearance": req.clearance,
        "role": req.role,
        "status": "active",
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    DEMO_USERS[email] = new_user
    
    access_token = create_access_token(data={"sub": new_user["email"], "role": new_user["role"]})
    
    AUDIT_LOGS.insert(0, {
        "id": len(AUDIT_LOGS) + 1,
        "actor_email": new_user["email"],
        "action": "account.registered",
        "target": new_user["badge_id"],
        "created_at": datetime.utcnow().isoformat() + "Z"
    })
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=new_user
    )

@router.get("/me", response_model=UserProfileResponse)
async def get_my_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    return UserProfileResponse(
        id=current_user["id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        badge_id=current_user["badge_id"],
        station_code=current_user["station_code"],
        clearance=current_user["clearance"],
        role=current_user["role"],
        status=current_user["status"],
        created_at=current_user["created_at"]
    )

@router.get("/users", response_model=List[UserProfileResponse])
async def list_officers(current_user: Dict[str, Any] = Depends(require_admin)):
    return [
        UserProfileResponse(
            id=u["id"],
            email=u["email"],
            full_name=u["full_name"],
            badge_id=u["badge_id"],
            station_code=u["station_code"],
            clearance=u["clearance"],
            role=u["role"],
            status=u["status"],
            created_at=u["created_at"]
        )
        for u in DEMO_USERS.values()
    ]

@router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    req: RoleUpdateRequest,
    current_user: Dict[str, Any] = Depends(require_admin)
):
    target_user = None
    for u in DEMO_USERS.values():
        if u["id"] == user_id:
            target_user = u
            break
            
    if not target_user:
        raise HTTPException(status_code=404, detail="Officer account not found")
        
    target_user["role"] = req.role
    if req.status:
        target_user["status"] = req.status
    if req.clearance:
        target_user["clearance"] = req.clearance
        
    AUDIT_LOGS.insert(0, {
        "id": len(AUDIT_LOGS) + 1,
        "actor_email": current_user["email"],
        "action": "user.role_changed",
        "target": target_user["email"],
        "created_at": datetime.utcnow().isoformat() + "Z"
    })
    
    return {"message": "Officer clearance & role updated successfully", "user": target_user}

@router.get("/audit-log")
async def get_audit_trail(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    return AUDIT_LOGS
