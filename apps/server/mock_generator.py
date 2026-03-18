import json
import random
from datetime import datetime, timedelta

def generate_mock_data():
    names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Ravi", "Anjali", "Suresh", "Ramesh", "Kiran"]
    payment_methods = ["UPI", "Cash", "Wallet"]
    transactions = []
    
    # constraint: At least 15% of transactions are marked as is_khata: true with an is_paid: false
    # 15% of 200 is 30.
    
    for i in range(200):
        is_khata_unpaid = i < 30
        
        is_khata = True if is_khata_unpaid else random.random() < 0.1
        is_paid = False if is_khata_unpaid else (True if not is_khata else random.choice([True, False]))
        
        amount = round(random.uniform(50.0, 5000.0), 2)
        days_ago = random.randint(0, 30)
        timestamp = (datetime.now() - timedelta(days=days_ago)).isoformat()
        
        transactions.append({
            "transaction_id": f"txn_{i+1:04d}",
            "timestamp": timestamp,
            "amount": amount,
            "payment_method": random.choice(payment_methods),
            "customer_name": random.choice(names),
            "is_khata": is_khata,
            "is_paid": is_paid
        })
        
    random.shuffle(transactions)
    
    data = {"transactions": transactions}
    with open("merchant_data.json", "w") as f:
        json.dump(data, f, indent=2)
    print("merchant_data.json generated with 200 realistic transactions.")

if __name__ == "__main__":
    generate_mock_data()
