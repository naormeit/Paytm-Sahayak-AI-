import json
import os
from google import genai
from pydantic import BaseModel
from typing import List

class DashboardSummaryResponse(BaseModel):
    top_debtors: List[str]
    credit_health_score: int
    morning_briefing: str

class SahayakAnalyst:
    def __init__(self, data_path: str = "merchant_data.json"):
        self.data_path = data_path
        self.client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    def analyze(self) -> dict:
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Data file {self.data_path} not found.")
            
        with open(self.data_path, 'r') as f:
            data = json.load(f)
            
        transactions = data.get("transactions", [])
        
        prompt = f"""
        You are an AI financial analyst for a Kirana store in Bangalore. 
        Here is the store's recent transaction data:
        {json.dumps(transactions)}
        
        Analyze this data and return:
        1. The top 3 debtors (customers with the highest total unpaid Khata amount). The format must be precise with 2 decimal places: 'Name: ₹Amount'.
        2. A Credit Health Score (0-100), where 100 means no pending debts, and heavily penalize large overdue amounts.
        3. A "Morning Briefing", e.g. "Good morning! You have ₹4,200.00 pending in Khata. 3 customers are overdue." Ensure everything is dynamically calculated from the provided data.
        
        Output strictly as JSON matching this schema:
        {{
            "top_debtors": ["Name1: ₹100.00", "Name2: ₹50.00"],
            "credit_health_score": 85,
            "morning_briefing": "..."
        }}
        """
        
        response = self.client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=DashboardSummaryResponse,
            )
        )
        return json.loads(response.text)
