# Developer Diary: Day 3 (Clean Paths & ADR #1)
**Date**: July 3, 2026

## 1. What We Accomplished Today
*   **TypeScript Path Aliases**: Added `@server/*` alias to `tsconfig.json` pointing to `./server/*`. This allows all backend imports to use clean absolute-style paths instead of fragile `../../../` relative chains.
*   **esbuild Native Alias**: Replaced the broken `esbuild-plugin-tsconfig-paths` (TypeScript version incompatibility) with esbuild's built-in `alias` config option inside `build-server.mjs`. This wires the alias at bundle-time so the compiled output also resolves correctly.
*   **Build Script Upgrade**: Replaced the raw CLI `esbuild` command in `package.json` with `node build-server.mjs` — a proper JS config file that can grow to include source maps, minification, and other production settings cleanly.
*   **Refactored Imports**: Updated all relative imports in `server/server.ts` to use `@server/*` aliases. Verified the server still compiles and starts correctly.
*   **ADR #1**: Wrote the first Architecture Decision Record documenting the folder separation decision, its trade-offs, and the deferred items.

---

## 2. Core Concepts Learned
*   **tsconfig paths vs. esbuild alias**: `tsconfig.json` paths only affect the TypeScript type-checker (red underlines in VS Code). They have no effect on the runtime bundle — esbuild needs to be told separately.
*   **ADR (Architecture Decision Record)**: A short formal document capturing WHY a major technical decision was made, what alternatives were rejected, and what trade-offs were accepted. Used by engineering teams to onboard new members and avoid re-debating settled decisions.
*   **Conventional Commits**: Using prefixes like `feat:`, `fix:`, `docs:`, `chore:` to categorize commits for readable history.

---

## 3. Q&A (Questions & Answers)

### Q1: Why did the esbuild-plugin-tsconfig-paths crash?
The plugin uses TypeScript's internal transformer API (`isImportDeclaration`). Our project's TypeScript version was newer than the plugin expected, causing the TypeScript node object to be `undefined` at the transformer step. Using esbuild's native `alias` option bypassed this entirely.

### Q2: Why are path aliases set up in TWO places (tsconfig.json AND build-server.mjs)?
Because they serve two completely different audiences:
*   **`tsconfig.json`**: Tells VS Code's language server how to resolve imports for **type-checking** (red underlines, autocompletion).
*   **`build-server.mjs`**: Tells esbuild how to resolve imports when **compiling** the actual JavaScript bundle.
Both must be kept in sync, otherwise you get "works in VS Code but crashes at runtime" bugs.
