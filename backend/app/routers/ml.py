from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from app.core.security import get_current_active_user
from app.schemas.ml import (
    WalletRiskRequest,
    WalletRiskResponse,
    BatchScoreRequest,
    BatchScoreResponse
)
from app.ml.clustering import cluster_address
from app.ml.risk_engine import compute_ml_risk

router = APIRouter(prefix="/ml", tags=["Machine Learning Risk Attribution"])

@router.post("/predict-risk", response_model=WalletRiskResponse)
async def predict_risk(
    req: WalletRiskRequest,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Evaluates risk for a given wallet address using the hybrid ML & Graph ensemble.
    """
    cluster_res = cluster_address(req.address, req.chain)
    risk_output = compute_ml_risk(
        address=req.address,
        chain=req.chain,
        cluster=cluster_res["cluster_addresses"]
    )
    return risk_output

@router.post("/batch-score", response_model=BatchScoreResponse)
async def batch_score(
    req: BatchScoreRequest,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    """
    Scores multiple suspect addresses in parallel.
    """
    results: List[WalletRiskResponse] = []
    high_risk_count = 0
    critical_count = 0
    
    for addr in req.addresses[:50]:
        cluster_res = cluster_address(addr, req.chain)
        risk = compute_ml_risk(addr, req.chain, cluster_res["cluster_addresses"])
        if risk.risk_level == "CRITICAL":
            critical_count += 1
        elif risk.risk_level == "HIGH":
            high_risk_count += 1
        results.append(risk)
        
    return BatchScoreResponse(
        results=results,
        high_risk_count=high_risk_count,
        critical_count=critical_count
    )
