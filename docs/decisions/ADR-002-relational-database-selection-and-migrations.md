# ADR-002: Relational Database Selection & Migration Strategy

**Date**: July 9, 2026  
**Status**: Accepted  
**Author**: Aditya

---

## Context
Our initial prototype used a flat JSON file (`database.json`) to store users, reports, and feedback. This lacked concurrent write protection, lacked relationship validation (leading to orphaned records), and lacked schema versioning. We needed a robust relational database engine and a deployment-safe schema management tool.

## Decision
1.  **SQLite Database**: We selected SQLite (via the synchronous `better-sqlite3` driver) for local and portfolio deployment.
2.  **Knex.js Query Builder**: We integrated Knex.js to write type-safe queries and manage migrations.
3.  **Connection Pragma**: We explicitly enforced foreign keys via connection-pool configuration (`PRAGMA foreign_keys = ON;`).
4.  **Environment Separation**: Decoupled `knexfile.ts` (CLI-only migration tool) from `connection.ts` (runtime database initializer) to prevent CLI bundling dependencies in production.

## Consequences
**Positive:**
*   **Zero Configuration**: No external database server process is required to be installed or run.
*   **File-Based Backups**: The entire database lives in `codelens.db` in the root folder, making backups or resets trivial.
*   **Schema Portability**: Schema changes are written as versioned migration scripts. Any environment (developer machine, Docker container, or cloud host) runs `npx knex migrate:latest` and gets the exact same layout.
*   **Safety**: Foreign key violations are blocked at the database level.

**Negative / Tradeoffs:**
*   **JSON Serialization**: SQLite lacks native nested types. Arrays and objects are serialized as JSON strings in text columns, meaning we cannot perform direct SQL search filters inside them (e.g. `WHERE techStack LIKE ...`). We accepted this tradeoff to keep the schema simple at portfolio scale.
*   **Concurrency Limits**: SQLite locks the database file during writes, which is fine for single-server portfolio setups but would lead to performance bottlenecks under heavy production traffic.

## Alternatives Considered
*   **PostgreSQL**: Rejected for development due to setup overhead (requires a separate background server). However, PostgreSQL (with an async Node driver) is the natural transition choice if we scale to high-concurrency production.
*   **MongoDB (NoSQL)**: Rejected because users, scans, and feedback are tightly relational. Enforcing strict connections in MongoDB requires complex application-level validation.
