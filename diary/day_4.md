# Developer Diary: Day 4 (Knex & SQLite Database Setup)
**Date**: July 4, 2026

## 1. What We Accomplished Today
Today, we replaced our flat JSON file storage system with a modern relational database setup using Knex.js and SQLite.

*   **Feature Branching Enforced**: Started our day by checking out the feature branch `feat/day-4-knex-setup` and committing leftover files first to keep our git history clean.
*   **Database Packages Installed**: Installed `knex` (SQL query builder) and `better-sqlite3` (SQLite engine driver).
*   **Configuration Hub**: Created `/server/db/knexfile.ts` to configure database paths, migrations, and seeds.
*   **Singleton connection**: Created `/server/db/connection.ts` to initialize and export a single shared Knex database connection instance.
*   **Bundler Fix**: Configured `build-server.mjs` to treat `knex` and `better-sqlite3` as external dependencies, preventing esbuild from trying to compile C++ binary code.

---

## 2. Core Concepts Learned
*   **Relational vs. Non-Relational**: SQL databases use tables with fixed columns and strict relationships, protecting us from corrupted data, whereas NoSQL is schema-less and doesn't enforce relationship constraints.
*   **SQLite Efficiency**: SQLite compiles the database engine directly into the application, saving it to a single local file (`codelens.db`) instead of requiring an external database server to run.
*   **Native Binary Bundling**: Why bundlers cannot compile C++ binary files (`.node` extensions) and why they must be marked as external in the build script.

---

## 3. Student Review & Notes
*(Add your notes and thoughts about today's database configuration here)*

---

## 4. Q&A (Questions & Answers)

### Q1: What are `knex_migrations` and `knex_migrations_lock`?
These are internal tables automatically created by Knex. 
*   `knex_migrations` tracks which database structure files (migrations) have already run, preventing Knex from running them twice.
*   `knex_migrations_lock` prevents multiple server instances from running migrations at the exact same time, which could corrupt the database.
*   **Rule**: These must never be deleted or manually edited.

### Q2: Why do we use a singleton connection pool?
Creating a database connection is expensive. If we imported Knex configuration directly in every route file and created new instances, each file would open separate connection pools. In SQLite, this would lead to "database is locked" errors during simultaneous writes. A singleton guarantees only one connection pool exists.
