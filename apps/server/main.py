import sys
import os
import json
import uuid

# Ensure the packages directory is in sys.path dynamically so no venv installation is strictly required
try:
    from ai_engine.credit_analysis import SahayakAnalyst
    from ai_engine.voice_handler import VoiceHandler
    from ai_engine.vision_handler import SahayakVision
except ImportError:
    # Append the root of the monorepo to the path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(os.path.dirname(current_dir))
    packages_dir = os.path.join(root_dir, 'packages', 'ai-engine')
    sys.path.append(packages_dir)
    from ai_engine.credit_analysis import SahayakAnalyst
    from ai_engine.voice_handler import VoiceHandler
    from ai_engine.vision_handler import SahayakVision

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

class VoiceQuery(BaseModel):
    text: str

class ScanBillRequest(BaseModel):
    image_base64: str

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Sahayak AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    except Exception as e:
        # Fallback to mock data to prevent frontend crashes if DB is missing or API fails
        print(f"Error running Agentic logic: {str(e)}")
        return {
            "top_debtors": ["Rahul (Mock): ₹1500.00", "Priya (Mock): ₹850.00", "Amit (Mock): ₹320.00"],
            "credit_health_score": 75,
            "morning_briefing": "Offline Mode: Unable to reach the database or Gemini AI Engine. displaying sample datastream. Rahul and Priya owe you roughly ₹2,350.00."
        }

@app.post("/api/v1/voice-query")
def process_voice_query(query: VoiceQuery):
    handler = VoiceHandler(data_path="merchant_data.json")
    try:
        return handler.process_voice_query(query.text)
    except FileNotFoundError:
        return {"error": "Mock data not found. Please run mock_generator.py first."}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/v1/chat")
def process_chat_query(query: VoiceQuery):
    # Route chat text through the same intelligent intent maps
    return process_voice_query(query)

@app.post("/api/v1/scan-bill")
def scan_bill(request: ScanBillRequest):
    vision = SahayakVision()
    try:
        extraction = vision.process_receipt(request.image_base64)
        
        # Append to merchant_data.json
        data_path = "merchant_data.json"
        
        if os.path.exists(data_path):
            with open(data_path, 'r') as f:
                data = json.load(f)
        else:
            data = {"transactions": []}
            
        new_txn = {
            "transaction_id": f"txn_vision_{uuid.uuid4().hex[:8]}",
            "timestamp": datetime.now().isoformat(),
            "amount": round(float(extraction.get("total_amount", 0.0)), 2),
            "payment_method": "Cash",
            "customer_name": extraction.get("customer_name", "Unknown"),
            "is_khata": True,
            "is_paid": False,
            "items": extraction.get("items", [])
        }
        
        data.setdefault("transactions", []).append(new_txn)
        
        with open(data_path, 'w') as f:
            json.dump(data, f, indent=2)
            
        return {
            "status": "success",
            "message": "Bill scanned and added to Khata successfully.",
            "extracted_data": extraction,
            "transaction": new_txn
        }
    except Exception as e:
        return {"error": str(e)}
