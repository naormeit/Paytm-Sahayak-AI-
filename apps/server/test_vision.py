from PIL import Image, ImageDraw, ImageFont
import base64
import io
import sys
import os
import json

# Add packages to path to test directly
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(os.path.dirname(current_dir))
sys.path.append(os.path.join(root_dir, 'packages', 'ai-engine'))

from ai_engine.vision_handler import SahayakVision

def generate_mock_receipt_base64():
    # Create a blank white image
    img = Image.new('RGB', (450, 300), color='white')
    d = ImageDraw.Draw(img)
    
    # Write "handwritten" note text
    text = "Customer: Ramesh Bhai\n\nItems:\n1. 5kg Aashirvaad Atta - 250.00\n2. 1L Fortune Oil - 150.00\n\nTotal Amount: 400.00"
    
    try:
        font = ImageFont.load_default()
    except:
        font = None
        
    if font:
        d.text((20, 20), text, fill=(0, 0, 0), font=font)
    else:
        d.text((20, 20), text, fill=(0, 0, 0))
        
    # Save to bytes
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str

if __name__ == "__main__":
    b64 = generate_mock_receipt_base64()
    
    if "GEMINI_API_KEY" not in os.environ:
        print("MOCK BASE64 RECEIPT GENERATED SUCCESSFULLY!")
        print("However, GEMINI_API_KEY is missing from environment, so SahayakVision cannot be tested.")
        print("\nHere is your mock base64 string to feed into POST /api/v1/scan-bill:\n")
        print("data:image/png;base64," + b64[:200] + "... (TRUNCATED)\n")
    else:
        print("Mock receipt image generated. Processing with SahayakVision via Gemini 1.5 Flash...")
        vision = SahayakVision()
        try:
            result = vision.process_receipt(b64)
            print("\n✅ EXTRACTION SUCCESS:\n")
            print(json.dumps(result, indent=2))
        except Exception as e:
            print("\n❌ Error:", e)
