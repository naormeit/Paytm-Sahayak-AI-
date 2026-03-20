import os
import json
import urllib.parse
from google import genai
from pydantic import BaseModel
from typing import List

class IntentOutput(BaseModel):
    intent: str
    confidence: float

def generate_whatsapp_link(customer_name: str, amount: float) -> str:
    """
    Generates a pre-filled WhatsApp wa.me link with a polite reminder in Hindi and English.
    """
    message = (
        f"Namaste {customer_name}! 🙏\n\n"
        f"This is a gentle reminder from your Kirana store. "
        f"Your pending Khata amount is ₹{amount:.2f}.\n"
        f"Aapse anurodh hai ki kripya apna bakaaya ₹{amount:.2f} jald hi jama karein. "
        f"Thank you for your business!"
    )
    encoded_message = urllib.parse.quote(message)
    return f"https://wa.me/?text={encoded_message}"

class VoiceHandler:
    def __init__(self, data_path: str = "merchant_data.json"):
        self.data_path = data_path
        self.client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    def process_voice_query(self, text_query: str) -> dict:
        """
        Receives transcribed text, maps it to an intent using Gemini,
        and returns a spoken summary & actionable WhatsApp links.
        """
        prompt = f"""
        Classify the intent of the following user query from a kirana store owner:
        Query: "{text_query}"
        
        Possible intents:
        - "DEBT_QUERY": Asking about who owes money, khata balances, or pending payments.
        - "UNKNOWN": Anything else.
        
        Respond with strictly JSON matching this structure.
        """
        
        response = self.client.models.generate_content(
            model='gemini-1.5-flash',
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=IntentOutput,
            )
        )
        
        intent_data = json.loads(response.text)
        intent = intent_data.get("intent")
        
        if intent == "DEBT_QUERY":
            return self._handle_debt_query()
        else:
            return {
                "spoken_summary": "I'm sorry, I didn't understand that query.",
                "action_links": []
            }
            
    def _handle_debt_query(self) -> dict:
        if not os.path.exists(self.data_path):
            return {"spoken_summary": "I cannot find the merchant data.", "action_links": []}
            
        with open(self.data_path, 'r') as f:
            data = json.load(f)
            
        transactions = data.get("transactions", [])
        
        # Calculate pending amount per customer
        debtors = {}
        for t in transactions:
            if t.get("is_khata") and not t.get("is_paid"):
                name = t.get("customer_name")
                debtors[name] = debtors.get(name, 0.0) + float(t.get("amount", 0.0))
                
        if not debtors:
            return {"spoken_summary": "No one owes you money right now.", "action_links": []}
            
        # Sort by highest debt
        sorted_debtors = sorted(debtors.items(), key=lambda x: x[1], reverse=True)
        top_two = sorted_debtors[:2]
        total_owed = sum(debtors.values())
        
        if len(top_two) == 1:
            spoken_summary = f"{top_two[0][0]} owes you a total of ₹{total_owed:,.2f}."
        elif len(sorted_debtors) == 2:
            spoken_summary = f"{top_two[0][0]} and {top_two[1][0]} owe you a total of ₹{total_owed:,.2f}."
        else:
            spoken_summary = f"{top_two[0][0]} and {top_two[1][0]} and others owe you a total of ₹{total_owed:,.2f}."
            
        action_links = [
            {"customer": name, "whatsapp_link": generate_whatsapp_link(name, amt)}
            for name, amt in sorted_debtors
        ]
        
        return {
            "spoken_summary": spoken_summary,
            "action_links": action_links
        }
