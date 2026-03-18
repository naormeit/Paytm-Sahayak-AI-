import sys
import os

# Ensure the packages directory is in sys.path dynamically so no venv installation is strictly required
try:
    from ai_engine.credit_analysis import SahayakAnalyst
except ImportError:
    # Append the root of the monorepo to the path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(os.path.dirname(current_dir))
    packages_dir = os.path.join(root_dir, 'packages', 'ai-engine')
    sys.path.append(packages_dir)
    from ai_engine.credit_analysis import SahayakAnalyst

from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Transaction(BaseModel):
    transaction_id: str
    amount: float = Field(..., gt=0)
    currency: str = "INR"
    status: str
    timestamp: datetime
    description: Optional[str] = None

class MerchantData(BaseModel):
    merchant_id: str
    name: str
    category: str
    transactions: List[Transaction] = []
    credit_score: Optional[int] = None

app = FastAPI(title="Sahayak AI API", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Welcome to Sahayak AI Backend API"}

@app.post("/merchant/")
def process_merchant_data(data: MerchantData):
    return {"status": "success", "merchant": data.name, "transactions_count": len(data.transactions)}

@app.get("/api/v1/dashboard-summary")
def get_dashboard_summary():
    analyst = SahayakAnalyst(data_path="merchant_data.json")
    try:
        summary = analyst.analyze()
        return summary
    except FileNotFoundError:
        return {"error": "Mock data not generated. Please run mock_generator.py first."}
    except Exception as e:
        return {"error": str(e)}
