import os
from typing import List

class Settings:
    PROJECT_NAME: str = "Chakravyuh SETU - Real-Time Crypto Fraud Attribution"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Security / JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "chakravyuh_production_super_secret_jwt_key_2026_i4c_setu")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://chakravyuh-setu.higgsfield.app",
        "*"
    ]
    
    # Supabase (Optional)
    SUPABASE_URL: str = os.getenv("VITE_SUPABASE_URL", "https://pfwlytjcluycnoavejcz.supabase.co")
    SUPABASE_KEY: str = os.getenv("VITE_SUPABASE_ANON_KEY", "")
    
    # RPC & Explorer APIs
    ETHERSCAN_API_KEY: str = os.getenv("ETHERSCAN_API_KEY", "")
    POLYGONSCAN_API_KEY: str = os.getenv("POLYGONSCAN_API_KEY", "")
    TRONGRID_API_KEY: str = os.getenv("TRONGRID_API_KEY", "")

settings = Settings()
