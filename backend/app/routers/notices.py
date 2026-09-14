from datetime import datetime
from fastapi import APIRouter, Depends
from typing import Dict, Any
from app.core.security import get_current_active_user
from app.data.vasp_labels import lookup_vasp

router = APIRouter(prefix="/notices", tags=["Statutory Legal Notices"])

@router.post("/generate")
async def generate_notice(
    payload: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    fir_number = payload.get("fir_number", "CR-CYBER/2026/0891")
    target_wallet = payload.get("target_wallet", "0x28c6c06298d514db089934071355e5743bf21d60")
    notice_type = payload.get("notice_type", "BNSS_94_FREEZE")  # BNSS_94_FREEZE | CRPC_91_PRESERVE
    vasp_name = payload.get("vasp_name", "Binance International")
    
    vasp_info = lookup_vasp(target_wallet) or {
        "exchange_name": vasp_name,
        "compliance_email": "law-enforcement@binance.com",
        "nodal_officer": "Nodal Officer / Legal Operations",
        "country": "International"
    }
    
    act_title = "Section 94 of Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023" if "BNSS" in notice_type else "Section 91 of the Code of Criminal Procedure (CrPC), 1973"
    
    notice_text = f"""
OFFICE OF THE INVESTIGATING OFFICER
CYBER CRIME POLICE STATION, {current_user['station_code']}
======================================================================
NOTICE UNDER {act_title.upper()}

To:
The Nodal Officer / Legal Compliance Unit
{vasp_info['exchange_name']}
Email: {vasp_info['compliance_email']}

Subject: STATUTORY DIRECTIVE TO FREEZE AND PRESERVE FRAUDULENT FUNDS
FIR No.: {fir_number} | Investigation Reference: I4C-IND-ATTRIBUTION-2026

1. In connection with the ongoing criminal investigation in FIR No. {fir_number}, this office has established on-chain attribution linking illicit proceeds to deposit endpoint:
   TARGET WALLET ADDRESS: {target_wallet}

2. You are hereby directed under {act_title} to:
   a) IMMEDIATELY FREEZE all withdrawals, transfers, and liquidation associated with the subject UID/Account.
   b) FURNISH complete KYC dossiers, IP login logs, associated bank account details, and withdrawal destinations within 24 hours.
   c) ISSUE an acknowledgement of preservation to this office.

3. Failure to comply attracts penal action under Section 223/226 of the Bharatiya Nyaya Sanhita (BNS) / Section 175/176 IPC.

Issued under the hand and seal of the Investigating Officer:
Officer: {current_user['full_name']}
Badge ID: {current_user['badge_id']}
Station: {current_user['station_code']}
Timestamp: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}
"""
    return {
        "success": True,
        "fir_number": fir_number,
        "notice_type": notice_type,
        "act_title": act_title,
        "recipient_vasp": vasp_info["exchange_name"],
        "recipient_email": vasp_info["compliance_email"],
        "target_wallet": target_wallet,
        "issuing_officer": {
            "name": current_user["full_name"],
            "badge_id": current_user["badge_id"],
            "station": current_user["station_code"]
        },
        "notice_text": notice_text.strip(),
        "generated_at": datetime.utcnow().isoformat() + "Z"
    }
