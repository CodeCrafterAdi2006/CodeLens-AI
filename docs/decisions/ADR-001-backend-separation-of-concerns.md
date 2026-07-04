# ADR-001: Backend Separation of Concerns & Folder Structure

**Date**: July 3, 2026  
**Status**: Accepted  
**Author**: Aditya

---

## Context
The original codebase had all server logic (database queries, AI calls, scraping, and route definitions) inside a single root-level `server.ts` file. As new features (auth, rate-limiting, health endpoints) were added, this single file would become unreadable and untestable.

## Decision
We restructured the backend into a layered folder hierarchy under `/server`:

server/ ├── config/ → Boot-time configuration (env validation) ├── db/ → Database connection and queries ├── services/ → Business logic (AI analysis, scraping) ├── routes/ → API endpoint URL definitions (Phase 3) ├── controllers/ → Request/response handlers (Phase 3) └── middleware/ → Reusable request interceptors (Phase 3)


We also configured TypeScript `paths` aliases (`@server/*`) and an esbuild native `alias` mapping to allow clean, absolute-style imports across the backend.

## Consequences
**Positive:**
- Each file has a single clear responsibility
- Services (`scraperService`, `aiService`) are independently importable without pulling in Express
- Path aliases prevent fragile `../../../` relative import chains
- New engineers can navigate the codebase without reading every file

**Negative / Deferred:**
- `server.ts` still contains inline route definitions (not yet split into `/routes` and `/controllers`). This is deliberately deferred to Phase 3 (Days 8-9) when auth endpoints are built.

## Alternatives Considered
- **Monolithic single file**: Rejected. Grows unmaintainable beyond ~200 lines.
- **Microservices**: Rejected. Premature for a student-scale project at this stage.

## Rejected Approaches
### esbuild-plugin-tsconfig-paths
*   **Tried**: Install `esbuild-plugin-tsconfig-paths` and pass it via the `plugins` array in `build-server.mjs`.
*   **Failed**: The plugin uses TypeScript's internal transformer API (`isImportDeclaration`). Our TypeScript version (5.8.x) is newer than the plugin expected, causing the transformer to receive `undefined` node objects and crash immediately.
*   **Resolution**: Replaced with esbuild's native `alias` config option, which is stable, has zero external dependencies, and resolves path mappings at bundle-time without touching the TypeScript compiler API.