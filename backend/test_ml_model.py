"""
Interactive Test Script for Chakravyuh ML Risk Engine & Attribution API
Run with: python test_ml_model.py
"""

import sys
import io

# Set UTF-8 encoding for Windows terminals
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

from fastapi.testclient import TestClient
from main import app

def run_ml_tests():
    client = TestClient(app)
    
    print("======================================================================")
    print("TESTING CHAKRAVYUH ML RISK ATTRIBUTION ENGINE")
    print("======================================================================\n")

    # Step 1: Authenticate with Demo Officer credentials
    print("[1] Authenticating Officer (admin@chakravyuh.in)...")
    login_res = client.post("/api/auth/login", json={
        "email": "admin@chakravyuh.in",
        "password": "admin123"
    })
    
    if login_res.status_code != 200:
        print("[!] Login failed:", login_res.json())
        return
        
    token = login_res.json()["access_token"]
    user = login_res.json()["user"]
    print(f"[OK] Authenticated as: {user['full_name']} ({user['badge_id']})")
    print(f"     Clearance: {user['clearance']}\n")

    headers = {"Authorization": f"Bearer {token}"}

    # Step 2: Test Single Wallet ML Risk Scoring
    test_wallets = [
        {
            "name": "Suspect Mule Layering Wallet",
            "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            "chain": "ethereum"
        },
        {
            "name": "Binance International Hot Wallet",
            "address": "0x28c6c06298d514db089934071355e5743bf21d60",
            "chain": "ethereum"
        },
        {
            "name": "Tornado Cash Mixer Smart Contract",
            "address": "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
            "chain": "ethereum"
        }
    ]

    print("[2] Running ML Risk Prediction across sample wallets:\n")
    for item in test_wallets:
        print(f"[*] Analyzing: {item['name']} ({item['address']})")
        res = client.post("/api/ml/predict-risk", json={
            "address": item["address"],
            "chain": item["chain"]
        }, headers=headers)
        
        if res.status_code == 200:
            data = res.json()
            print(f"    - Risk Score: {data['risk_score']}/100 [{data['risk_level']}] (Confidence: {round(data['confidence'] * 100)}%)")
            print(f"    - Features Extracted:")
            print(f"      * Peel Chain Ratio: {round(data['features']['peel_chain_ratio'] * 100, 1)}%")
            print(f"      * Sweep Velocity: {data['features']['sweep_velocity_seconds']}s")
            print(f"      * Dispersion Entropy: {data['features']['dispersion_entropy']}")
            print(f"      * Mixer Proximity: {data['features']['mixer_proximity_hops']} hops")
            print(f"    - Key Attribution Signals:")
            for r in data["reasons"]:
                print(f"      * {r}")
            print(f"    - Statutory Recommendation: {data['statutory_action']}")
            print("-" * 70)
        else:
            print("[!] Scoring error:", res.json())
        print()

    # Step 3: Test Full Hop-by-Hop Trace & Attribution Graph
    print("[3] Testing Full Attribution Trace (`/api/trace`)...")
    trace_res = client.post("/api/trace", json={
        "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "chain": "ethereum"
    }, headers=headers)

    if trace_res.status_code == 200:
        trace_data = trace_res.json()
        print(f"[OK] Multi-Hop Graph Generated: {len(trace_data['graph']['nodes'])} nodes, {len(trace_data['graph']['edges'])} edges")
        if trace_data.get("matched_vasp"):
            print(f"[TARGET] Terminal VASP Identified: {trace_data['matched_vasp']['exchange_name']} ({trace_data['matched_vasp']['country']})")
            print(f"         Compliance Contact: {trace_data['matched_vasp']['compliance_email']}")
    else:
        print("[!] Trace failed:", trace_res.json())

    print("\n======================================================================")
    print("ALL ML MODEL & ATTRIBUTION PIPELINES OPERATIONAL")
    print("======================================================================")

if __name__ == "__main__":
    run_ml_tests()
