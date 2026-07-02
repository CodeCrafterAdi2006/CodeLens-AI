# CodeLens-AI — Agent Rules & Pre-Flight Checklist

These rules are enforced by the AI mentor at the **start of every session** before any work begins.
They were established based on auditor feedback and production-grade engineering standards.

---

## 🔴 MANDATORY PRE-FLIGHT CHECKS (Run Before Every Day's Work)

### 1. Feature Branch Check
**NEVER work directly on `main`.** Before any code changes, verify the user is on a feature branch.
- Run `git branch` and confirm the current branch is NOT `main`.
- If on `main`, instruct the user to run: `git checkout -b feat/day-X-<short-description>`
- Merge to `main` only AFTER the day's verification passes auditor review.

### 2. Server Startup Verification
Before starting a new day's implementation, verify the server from the previous day still works.
- Run `npm run build:server` — must produce zero errors and zero warnings.
- Run `npm start` — must print `CodeLens AI API server running on port 3001`.

### 3. Git Status Check
Run `git status` at the start of each session to confirm no uncommitted stale changes from a previous incomplete session exist.

---

## 🟡 CODING STANDARDS (Enforce on Every File)

### 4. Code Comments Are Mandatory
Every new file must include comments explaining the **WHY**, not just the what.
- Config files: explain what each option does and why it was chosen.
- Service files: explain what the service's single responsibility is at the top.
- Middleware files: explain what requests it intercepts and what it does to them.

### 5. Conventional Commits
All commits must use a prefix:
- `feat:` — new feature or implementation
- `fix:` — bug fix
- `docs:` — documentation only (diary, ADR, comments)
- `chore:` — tooling, config changes (package.json, tsconfig, etc.)
- `refactor:` — code restructuring with no behavior change
- `test:` — adding or updating tests

### 6. Single Responsibility Per File
Each file must do exactly ONE thing. Flag any file that mixes concerns:
- Services must NOT import Express (`Request`, `Response`)
- Routes must NOT contain business logic
- Controllers must NOT contain database queries directly

---

## 🟢 END-OF-DAY CHECKLIST (Before Marking a Day Complete)

### 7. Build Must Be Clean
`npm run build:server` must complete with zero warnings and zero errors.

### 8. Diary Entry Written
`diary/day_X.md` must be created and populated with:
- What was accomplished
- Core concepts learned
- Q&A from the session

### 9. ADR Written (On Review Days)
Architecture Decision Records must be written on Phase review days (Days 3, 7, 11, 14, 17, 20, 25).

### 10. Committed and Pushed
All changes must be committed with a conventional commit message and pushed to GitHub.
- Feature branch merged into `main` only after auditor review passes.

---

## 📋 AUDITOR GAPS TRACKER

Issues flagged by the auditor that are not yet resolved:

| Gap | Flagged On | Resolution Day | Status |
|-----|-----------|---------------|--------|
| Pushing directly to `main` (no feature branches) | Day 3 | Day 4+ (start immediately) | 🔴 Open — Fix starting Day 4 |
| `server.ts` still has inline route definitions | Day 1 | Day 8-9 (Phase 3) | 🟡 Deferred (by design) |
| Gemini advisory mode not surfaced in API response | Day 2 | Day 13 (health endpoint) | 🟡 Deferred (by design) |
| APP_URL critical-in-prod check must be tested in docker | Day 2 | Day 18 (Dockerfile) | 🟡 Deferred (by design) |

---

## 📌 DAY-SPECIFIC NOTES (Pre-loaded from Auditor)

### Day 4 (Knex Setup)
- Knex auto-creates `knex_migrations` and `knex_migrations_lock` tables on first run.
- **DO NOT delete or manually edit these tables.** They track which migrations have already run.
- If unfamiliar tables appear in a database viewer (DBeaver etc.), check if they are Knex internals before touching them.
