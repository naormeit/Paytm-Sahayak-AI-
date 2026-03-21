<div align="center">

# Revolutionizing SMB Credit with Agentic AI 🚀

**Sahayak AI**: The Autonomous Khata for Bharat's Kirana Stores

<img src="https://img.shields.io/badge/Frontend-Next.js_15-black?style=for-the-badge&logo=next.js" />
<img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/AI_Engine-Gemini_1.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />

</div>

---

## 💡 The "Why"
India's MSME sector faces a staggering **₹25 Trillion credit gap**. Millions of local shopkeepers (Kiranas) rely on disorganized, paper-based "Kacha Bills" (informal ledgers) limiting their ability to track debt, recover funds, or prove creditworthiness to formal lending institutions. 

**Sahayak AI** bridges this gap. By instantly digitizing physical receipts and utilizing agentic workflows to chase down outstanding debts, Sahayak acts as a financial co-pilot—empowering local merchants to secure their cash flows effortlessly.

---

## ✨ Feature Showcase

- **📸 Vision-to-Ledger**: Simply snap a photo of any handwritten receipt. Our multi-modal Gemini 1.5 Flash integration instantly extracts the customer name, itemized lists, and total amount—logging it as a structured digital Khata entry securely.
- **🤖 Agentic Briefing**: Wake up to a dynamic "Morning Briefing." The AI analyzes your active ledgers to summarize outstanding debts, total sales, and prioritize which customers need targeted WhatsApp payment reminders.
- **📈 Dynamic Credit Scoring**: Stop guessing who to lend to. Sahayak AI synthetically calculates real-time creditworthiness (0-100) for local customers based strictly on their historical repayment velocity.

---

## 🏗️ System Architecture

Sahayak AI is engineered as a highly modular, decoupled Monorepo:
- **`apps/web`**: A bleeding-edge **Next.js 15** frontend. Client-side rendered dashboards featuring animated SVG visualizations, smooth Tailwind CSS styling, and strict crash-preventing error boundaries.
- **`apps/server`**: The **FastAPI** backend routing core. It manages the REST interfaces (`/scan-bill`, `/dashboard-summary`, `/chat`) and strictly enforces Pydantic schema validation.
- **`packages/ai-engine`**: Our isolated Python package containing the pure intelligence layer. This cleanly abstracts the `google-genai` configurations, Voice Intent mapping, and Vision OCR processing away from the routing logic.

---

## 🚀 Installation Guide

Run the full stack locally in 3 simple steps:

### 1. Set Up the AI Engine Backend
```bash
cd apps/server
pip install -r requirements.txt

# Export your actual Gemini Key!
export GEMINI_API_KEY="your-gemini-key-here"  
# (Use $env:GEMINI_API_KEY="..." on Windows PowerShell)

uvicorn main:app --reload
```

### 2. Boot the Frontend Client
Open a new terminal window:
```bash
cd apps/web
npm install
npm run dev
```

### 3. Open the Dashboard!
Visit **[http://localhost:3000](http://localhost:3000)** in your browser to experience the Sahayak AI dashboard. The API server runs autonomously on port `8000` handling all AI bridging.

---

## 👨‍💻 Author

Created with ❤️ by **Naorem Ngathoiba Singh**
- 💼 LinkedIn: [Connect on LinkedIn](https://linkedin.com/in/) *(Add your link here!)*
- 🌐 Portfolio: [naormeit.dev](https://github.com/naormeit) *(Add your link here!)*
- 🐙 GitHub: [@naormeit](https://github.com/naormeit)