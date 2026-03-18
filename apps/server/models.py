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
