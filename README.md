# CodeLens AI

CodeLens AI is an AI-powered educational platform designed to help students and developers understand the probable architecture and technology stack behind existing websites and applications. 

---

## Key Features

- **Website URL Analysis**: Collects headers, DNS patterns, and HTML markup signals to reverse engineer public web pages.
- **Multimodal Screenshot Uploads**: Drag-and-drop screenshots to scan and analyze interfaces that require authentication or lack public URLs.
- **System Specifications Synthesis**: Input plain-text product requirements to synthesize system architectures.
- **System Architecture Visualizer**: Generates graphical system node maps (Client, API, DB layers).
- **Hypothesized Database Relational Schema**: Generates data tables, constraints, and custom Mermaid class diagrams.
- **Dynamic Learning Roadmaps**: Builds interactive, milestone-based timeline roadmaps centered on identified tech stacks.
- **Academic Honesty Disclosures**: Displays disclaimers and flags unobserved/undetermined fields.
- **Interactive Ratings & Feedback**: Star-based feedback system logged directly to a local JSON database.

---

## Technical Architecture

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS (v4) + Lucide Icons.
- **Backend API**: Node.js + Express (handling authentication, URL scraping, and AI routes).
- **Database**: Local async JSON database (`database.json`) for zero-dependency portability.
- **AI Integrations**: Gemini API (`gemini-1.5-flash` model) with a robust heuristic-based rule engine fallback.

---

## Setup & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and configure your Gemini API Key:
```env
GEMINI_API_KEY="your_actual_gemini_api_key"
```
*Note: If no API key is specified, CodeLens AI automatically triggers the heuristics engine to generate educational reports.*

### 3. Run in Development Mode
Vite hot-reloading dev server runs on port 3000, proxying API calls to Express on port 3001.
- Start API Server:
  ```bash
  npm run server
  ```
- Start React Client:
  ```bash
  npm run dev
  ```

### 4. Build and Run in Production Mode
Builds static assets and compiles the backend into `server.cjs` (running on port 3001).
```bash
npm run build:all
npm start
```
