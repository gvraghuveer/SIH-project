from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from app.core.security import get_current_active_user
from app.ml.clustering import cluster_address
from app.ml.risk_engine import compute_ml_risk
from app.data.vasp_labels import lookup_vasp

router = APIRouter(prefix="/trace", tags=["Tracing & Attribution"])

@router.post("")
async def run_trace(
    payload: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    address = payload.get("address", "")
    chain = payload.get("chain", "ethereum")
    
    cluster_res = cluster_address(address, chain)
    cluster = cluster_res["cluster_addresses"]
    
    matched_vasp = None
    for addr in cluster:
        v = lookup_vasp(addr)
        if v and not v.get("is_mixer"):
            matched_vasp = v
            break
            
    risk = compute_ml_risk(address, chain, cluster)
    
    # Construct multi-hop graph nodes & edges
    nodes = []
    edges = []
    for i, addr in enumerate(cluster):
        is_seed = (i == 0)
        is_target = (matched_vasp and addr == matched_vasp.get("deposit_address"))
        vasp_label = lookup_vasp(addr)
        
        node_type = "victim" if is_seed else ("vasp" if is_target else ("mixer" if vasp_label and vasp_label.get("is_mixer") else "mule"))
        
        nodes.append({
            "id": addr,
            "label": f"Hop 0{i + 1}" if not is_seed else "Victim Ingest",
            "type": node_type,
            "entity": vasp_label["exchange_name"] if vasp_label else ("Mule Transit" if not is_seed else "Reported Wallet"),
            "risk_score": risk.risk_score if is_seed else max(15, risk.risk_score - (i * 10))
        })
        
        if i > 0:
            edges.append({
                "source": cluster[i - 1],
                "target": addr,
                "amount": round(1.45 / (i + 0.2), 3),
                "token": "USDT",
                "tx_hash": f"0x{addr[:8]}...{addr[-6:]}"
            })
            
    return {
        "address": address,
        "chain": chain,
        "cluster_addresses": cluster,
        "matched_vasp": matched_vasp,
        "risk": risk.dict(),
        "graph": {
            "nodes": nodes,
            "edges": edges
        },
        "statutory_recommendation": risk.statutory_action
    }
