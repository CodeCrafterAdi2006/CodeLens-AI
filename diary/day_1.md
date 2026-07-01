# Developer Diary: Day 1 (Folder Decoupling)
**Date**: June 30, 2026

## 1. What We Accomplished Today
Today was focused on cleaning up the project root and setting up a production-grade folder structure to separate different parts of our server.

*   **Folder Structure Created**:
    *   `/server/db/` (For database connections)
    *   `/server/services/` (For scrapers and AI agents)
    *   `/server/routes/` (For URL endpoints - *currently empty*)
    *   `/server/controllers/` (For request handling logic - *currently empty*)
    *   `/server/middleware/` (For security checkers - *currently empty*)
*   **Moved Files**:
    *   Root `server.ts` &rarr; `server/server.ts`
    *   Root `db.ts` &rarr; `server/db/db.ts`
    *   Root `collector.ts` &rarr; `server/services/scraperService.ts` (Renamed to reflect it is a service)
    *   Root `ai.ts` &rarr; `server/services/aiService.ts` (Renamed to reflect it is a service)
*   **Path Correction**:
    *   Updated the relative imports in `server/server.ts` to locate their dependencies in their new subfolders.
    *   Updated `server/services/aiService.ts` to look back one level (`../db/db`) for the database models.
*   **Build Configs Updated**:
    *   Updated `package.json` scripts (`server` and `build:server`) to target `server/server.ts` instead of `server.ts` in the root.
*   **Verification**:
    *   Compiled the server using `npm run build:server` (creates `server.cjs`).
    *   Successfully ran the compiled bundle using `npm run start` and verified the server starts on Port 3001.

---

## 2. Core Concepts Learned
*   **Separation of Concerns**: Dividing a program into separate sections so that each section handles one specific task (e.g., database storage is completely separate from API endpoint routing).
*   **Compiler Bundling (esbuild)**: Why we bundle. Node.js v25 has a bug running typescript loaders (`tsx`) when folder paths contain spaces. By using `esbuild` to compile our code into a single, standard JavaScript file (`server.cjs`), we bypass loaders entirely and Node runs it natively.

---

## 3. Student Review & Notes
*(Add your notes and thoughts about today's work here)*

---

## 4. Q&A (Questions & Answers)
### Q1: Is PowerShell a replacement for Linux?
No. Cloud systems run on Linux, but for local Windows development, basic PowerShell is completely fine. Commands like `git`, `npm`, and `node` behave identically across OS platforms.
### Q2: Why this folder structure? Can it be improved?
It is the standard Layered Architecture (separating routes, controllers, services, and db). In large applications, this can be improved by switching to Feature-based folders (grouping routes, controllers, and services for a single feature together), but our current structure is clean and perfect for medium-sized projects.
### Q3: Do I need to learn all folders today?
No. Today was about organization. We will study them one by one as we write code inside them in the coming days.
### Q4: Explain Compiler Bundling simply.
Our code is split into chapters (files). Node.js v25 has a bug where spaces in folder paths cause it to crash when jumping between files. A bundler (esbuild) reads all the chapters and prints them onto one single combined file (`server.cjs`), so Node doesn't need to jump files anymore.
### Q5: If server.ts still has inline routes, is Day 1 incomplete?
No. Day 1 was physical folder restructuring and module relocation. Splitting routes and controllers out of `server.ts` is scheduled for Phase 3 (Days 8-9) as we build and secure the login and analysis endpoints.
### Q6: Explain the Node 25 path spaces bug.
Node.js resolves ES module paths using percent-encoded URLs (e.g. `%20` for spaces). TSX intercepts this process, but in Node 25's new loader hooks, it had a bug encoding/decoding spaces when passing paths back to Node, causing module resolution crashes.
### Q7: Why is the esbuild output 1.6MB?
Because we did not mark `@google/genai` (the Gemini SDK) as external. Esbuild compiled and pasted the entire SDK code directly inside `server.cjs`.
### Q8: Why does `aiService` import `scraperService` and not the reverse?
Because of the "Producer-Consumer" decoupling rule: data producers should never know about their consumers. `scraperService` produces raw web data, and `aiService` consumes it. Keeping the dependency one-directional (consumer imports producer) ensures that `scraperService` remains modular, testable, and reusable in future projects that might not use AI at all, while preventing circular dependency cycles.

---

## 5. Clarifications (Breaking Down the AI Debate)

Here is what the discussion between the system auditors actually meant:

### 1. The "Express Routes" Debate (Moving Boxes vs. Unpacking)
*   **The Auditor's Point**: They pointed out that while we created folders like `/routes` and `/controllers`, we haven't actually moved our endpoint code (like `/api/analyze`) into them yet. It's still sitting in `server.ts`.
*   **Our Defense**: Today was about "moving the boxes" (setting up folders and moving services). We will "unpack the boxes" (splitting routes out of `server.ts` into routes/controllers) in Phase 3 when we secure those routes. We owned this gap instead of pretending it was fully done.

### 2. The "Producer-Consumer" Debate (The Baker and the Customer)
The other AI didn't like our "smart vs. dumb" analogy because it sounded like one file is more important than another. Instead, they wanted us to think of it as a **Baker** and a **Customer**:
*   **The Scraper is the Baker (The Producer)**: They make the bread (raw website data). The baker doesn't need to know *who* eats the bread or *how* they eat it. The baker just bakes and places it on the shelf.
*   **The AI Service is the Customer (The Consumer)**: They buy the bread, slice it, and make a sandwich (runs the data through Gemini). The customer depends on the baker to exist.
*   **Why it matters**: The baker should *never* depend on the customer's sandwich recipe to bake. Because the baker is independent, you can reuse the baker in a completely different shop (another app) without carrying the customer's kitchen tools (Gemini SDK) with you.

### 3. Terms Breakdown
*   **Endpoint**: A specific URL path on our server that can receive requests (e.g., `/api/auth/register`).
*   **Endpoint Code**: The logic block containing instructions on what to do when that URL is hit (checking credentials, reading parameters, and sending a response).
*   **Router File**: A file that acts purely as a map directory linking URLs to their handlers.
*   **Controller File**: A file that houses the actual request-response handler logic, decoupled from the main server setup.
### 4. Why is the Gemini SDK 1.6MB?
The Gemini model itself runs in the cloud (on Google's servers), not locally. The 1.6MB file size is for the Client SDK code, which contains the helper libraries, API request builders, and extensive TypeScript type definitions needed to talk to Google's API.