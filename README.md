# AWAAZ – Voice for the Invisible Woman (Digital Sister)

**Hackathon Problem Statement:** "The Invisible Woman"  
*An AI tool that empowers a first-time woman user — with zero English, no tech background, and no one to ask — to independently discover and access essential government schemes and services through voice in her own native language.*

---

## 🌸 The Problem: "The Invisible Woman"
Over 300 million Indian women lack access to life-changing government benefits (maternity support, free sewing machines, subsidized cooking gas, educational savings for daughters, and interest-free livelihood loans) simply because:
1. **The Digital Language Barrier:** Most government portals are designed in complex English or dense bureaucratic Hindi/Tamil.
2. **Zero Prior Tech Literacy:** Forms, OTPs, CAPTCHAs, and navigating multi-tier menus intimidate first-time users.
3. **The "No One to Ask" Dilemma:** Middlemen often exploit rural and semi-urban women or charge fraudulent commissions for free government services.

---

## 💡 The Solution: AWAAZ
**AWAAZ is not a generic chatbot; she is an elder sister providing a voice to the voiceless.**  
A compassionate, voice-first companion with large tactile controls, empathetic tone, zero confusing jargon, and strict grounding in curated, verified government programs.

### Core User Journey (60–90 Second Hackathon Demo):
1. **Language Choice:** 1-tap selection across 12 Indian languages (*Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, Urdu, English*).
2. **Warm Greeting:** "I am Saheli. Tell me what help you need. You can speak or type."
3. **Spoken Voice Input:** Press the large pulsing microphone button and speak naturally (e.g., *"எனக்கு பெண்களுக்கு அரசு உதவி திட்டம் வேண்டும்"* or *"मुझे सिलाई मशीन की जानकारी चाहिए"*).
4. **AI Understanding (Gemini 3.8 Flash):** Gemini understands user intent in any Indian dialect or mixed language, matches against verified curated schemes, and extracts structured guidance.
5. **Clear, Sisterly Response:**
   - **What it is:** 1-sentence plain-language summary.
   - **Who can apply:** Simple eligibility checkmarks.
   - **What you will get:** Tangible cash/equipment benefits (e.g. ₹15,000 sewing machine voucher, ₹5,000 maternity cash).
   - **Documents to keep ready:** Visual checklist (Aadhaar, Ration card, Bank passbook).
   - **Step-by-step how to apply:** Simple action steps (visit nearest CSC or Anganwadi).
   - **Official resource button & 24x7 helpline.**
6. **Voice Output:** Listen to Saheli speak the entire explanation in the selected native language.
7. **Follow-Up Questions:** Ask clarifying questions (*"What if I don't have a bank passbook?"* or *"Where is my nearest centre?"*) and receive immediate answers.

---

## 🛠️ Architecture & Tech Stack

```
┌───────────────────────────────────────────────────────────┐
│                     FRONTEND (REACT)                     │
│  - Mobile-First Tactile UI (Tailwind CSS v4)             │
│  - Multilingual Engine (12 Indian Languages)              │
│  - Web Speech API (Recognition + Synthesis)               │
│  - Accessibility Font Controls (A / A+ / A++)             │
│  - Canvas Confetti Celebration on Scheme Discovery        │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                  FULL-STACK SERVER (EXPRESS)              │
│  - POST /api/gemini/understand                            │
│  - POST /api/gemini/followup                              │
│  - Secure Server-Side Gemini API Key Handling             │
└─────────────────────────────┬─────────────────────────────┘
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│   GEMINI 3.8 FLASH      │       │  CURATED SCHEMES STORE  │
│ - Zero Hallucination    │       │ - PM Vishwakarma Tailor │
│ - Structured JSON Output│       │ - PM Matru Vandana      │
│ - Sisterly Translation  │       │ - PM Ujjwala Gas        │
│ - Intent Classification │       │ - Sukanya Samriddhi     │
│                         │       │ - Lakhpati Didi (SHG)   │
│                         │       │ - Mahila Samman Savings │
└─────────────────────────┘       └─────────────────────────┘
```

---

## 🔒 Gemini Integration & Safety
- **Server-Side Security:** Calls `@google/genai` exclusively from the Node.js backend using `process.env.GEMINI_API_KEY`. No API keys are ever leaked to the browser.
- **Strict Grounding:** The system prompt injects our curated government scheme catalog. Gemini is instructed:
  - *Never invent non-existent government programs, eligibility criteria, or URLs.*
  - *If a query does not match verified services, return a gentle redirect instead of hallucinating.*
- **Structured JSON Output:** Utilizes Gemini's `responseSchema` with fallback resilience.

---

## 🗣️ Voice Pipeline (Input & Output)
- **Speech Recognition:** Binds dynamically to the selected Indian language BCP-47 tag (`ta-IN`, `hi-IN`, `te-IN`, `kn-IN`, `ml-IN`, etc.). Includes error detection for microphone permissions and unsupported browsers with an instant keyboard fallback.
- **Speech Synthesis:** Evaluates device voice availability. **Saheli never speaks Tamil or Hindi using an English accent voice.** If a compatible native voice is missing on the client device, a friendly visual message is displayed while keeping the high-contrast text available.

---

## 🚀 Running Locally

### 1. Prerequisites
- Node.js 20+

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 4. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🔮 Future Scalability
1. **Dialect Voice AI (IndicTTS / Bhashini):** Integration with Bhashini for natural regional accents across rural dialects (e.g. Kongu Tamil, Bhojpuri, Bundelkhandi).
2. **WhatsApp / IVR Voice Bot:** Enabling women with basic 2G feature phones to dial a toll-free number and speak to Saheli over a phone call.
3. **Assisted CSC Geolocation:** 1-tap GPS directions to the closest Gram Panchayat or Common Service Centre.
4. **Document Scanner (Gemini Vision):** Allow a user to point her camera at an Aadhaar or ration card to automatically verify scheme eligibility without entering text.
