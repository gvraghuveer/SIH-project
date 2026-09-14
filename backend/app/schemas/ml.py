from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class WalletRiskRequest(BaseModel):
    address: str
    chain: str = "ethereum"  # ethereum | tron | polygon | bitcoin | bsc
    fir_number: Optional[str] = None
    acknowledgement_id: Optional[str] = None
    deep_trace: bool = True

class FeatureMetrics(BaseModel):
    peel_chain_ratio: float
    sweep_velocity_seconds: int
    dispersion_entropy: float
    fan_out_degree: int
    mixer_proximity_hops: int
    exchange_proximity_hops: int
    bot_signature_detected: bool

class MatchedVASP(BaseModel):
    exchange_name: str
    deposit_address: str
    country: str
    confidence: float
    compliance_email: str
    nodal_officer: str

class WalletRiskResponse(BaseModel):
    address: str
    chain: str
    risk_score: int  # 0 to 100
    risk_level: str  # CRITICAL | HIGH | MEDIUM | LOW
    is_illicit: bool
    confidence: float
    matched_vasp: Optional[MatchedVASP] = None
    features: FeatureMetrics
    reasons: List[str]
    statutory_action: str
    timestamp: str

class BatchScoreRequest(BaseModel):
    addresses: List[str]
    chain: str = "ethereum"

class BatchScoreResponse(BaseModel):
    results: List[WalletRiskResponse]
    high_risk_count: int
    critical_count: int
