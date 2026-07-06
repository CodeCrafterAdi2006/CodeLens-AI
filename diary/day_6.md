# Developer Diary: Day 6 (Relational Integrity & Enforcing Constraints)
**Date**: July 6, 2026

## 1. What We Accomplished Today
Today, we enforced database constraints in SQLite and refactored our core query service layer to interface with our new relational schema.

*   **Enforced Relational Integrity**: Configured the Knex connection pool `afterCreate` callback to run `PRAGMA foreign_keys = ON;` in SQLite.
*   **Resolved Bundling Path Mismatch**: Troubleshooting a compiler warning and runtime crash caused by `import.meta.url` in CommonJS. Resolved it by building a warning-free, context-aware path detector using `process.cwd()`.
*   **Refactored Query Service Layer**: Rewrote `/server/db/db.ts` to replace flat-file JSON operations with clean Knex SQL queries.
*   **Structured Data Serialization**: Implemented a JSON helper (`parseReportJSON`) to serialize complex arrays (like lists of architecture nodes and improvements) into text columns for database writes and deserialize them back for reads.
*   **Failure-State Verification**: Wrote a diagnostic test script to prove SQLite rejects invalid records, catching a connection-level false positive before getting a genuine `FOREIGN KEY constraint failed` database lock error.

---

## 2. Core Concepts Learned
*   **SQLite Foreign Key Defaults**: Understanding that SQLite disables foreign key validation by default to maintain backwards compatibility, requiring explicit connection pragma configuration.
*   **Context-Aware Folder Paths**: Why `process.cwd()` resolves differently in CLI scripts (context is the CLI directory) vs. runtime applications (context is the root directory), and how to model path detection around it.
*   **Diagnostic Integrity**: Why inspecting the *actual* error trace in a test catch-block prevents accepting false positives (e.g. database connection crashing vs database constraint rejecting).

---

## 3. Student Review & Notes
*(Add your notes and thoughts about today's work here)*

---

## 4. Q&A (Questions & Answers)

### Q1: What is a "false positive" verification test, and why did it happen in our first test execution?
A false positive occurs when a test reports a "success" (e.g. the write was blocked) but does so for the wrong reason. In our first test, the script reported a successful block because the database connection had crashed entirely (`TypeError: conn.run is not a function`), rather than triggering the expected relational constraint violation. We caught it by inspecting the actual error message.

### Q2: What is the difference between SQLite's `better-sqlite3` and `sqlite3` connection callback syntaxes?
`sqlite3` uses async callbacks (e.g. `conn.run('PRAGMA...', callback)`), whereas `better-sqlite3` operates synchronously, providing a direct Database class instance where we run pragmas synchronously (e.g. `conn.pragma('foreign_keys = ON')`) without needing standard callbacks.
