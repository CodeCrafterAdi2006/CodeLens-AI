# Developer Diary: Day 7 (Phase 2 Review & Break-and-Fix)
**Date**: July 9, 2026

## 1. What We Accomplished Today
Today was a study and validation checkpoint. We deliberately broke our database constraints, documented our architectural choices, and practiced translating our code into clear technical explanations.

*   **Break-and-Fix Experiment**: Ran a back-to-back verification testing SQLite's foreign key checks:
    *   **Break State**: Forced `PRAGMA foreign_keys = OFF` and watched SQLite silently save corrupted/orphaned database entries.
    *   **Fix State**: Enforced `PRAGMA foreign_keys = ON` and verified the database blocks bad writes with a clean `FOREIGN KEY constraint failed` error.
*   **ADR #2**: Created `docs/decisions/ADR-002-relational-database-selection-and-migrations.md` documenting database selection, SQLite concurrency tradeoffs, JSON serialization tradeoffs, and our environment configuration strategy.
*   **Interview Explain-Back**: Prepared conceptual reviews covering SQLite vs Postgres, migration portability across environments, and the metadata role of `knex_migrations` tables.

---

## 2. Core Concepts Learned
*   **Compile-Time Defaults**: Realized that modern `better-sqlite3` driver compilations enable foreign keys by default, but learned why explicitly setting the pragma in our code is still necessary to maintain environment portability.
*   **Environmental Replication**: Understanding that Knex migrations aren't just for multi-developer teams, but are critical for solo projects to ensure development, containerized, and cloud-production instances run identical layouts.
*   **SQLite Concurrency Constraints**: Understanding that SQLite locks the database file on writes, making it ideal for low-concurrency local platforms but problematic under heavy production traffic.
*   **Migration Semaphore Lock**: The `knex_migrations_lock` table physically holds a row containing an `is_locked` column. Knex sets this column to `1` when a migration run starts and updates it back to `0` when it finishes, acting as a semaphore lock to block concurrent database writes.


---

## 3. Student Review & Notes
*(Add your notes and thoughts about Phase 2 here)*

---

## 4. Q&A (Questions & Answers)

### Q1: Why is a migrations table necessary?
The database needs a way to know what schema modifications it has already applied. The `knex_migrations` table acts as a log. When `knex migrate:latest` runs, Knex reads this log and only runs files that are newer than the last log entry, protecting our database from running old blueprints on existing data.
