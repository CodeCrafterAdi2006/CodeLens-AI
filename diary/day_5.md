# Developer Diary: Day 5 (Versioned Migrations)
**Date**: July 5, 2026

## 1. What We Accomplished Today
Today, we constructed our relational database schema using versioned migration files, troubleshooting module scope issues and path alignment constraints along the way.

*   **ESM Directory Resolution**: Resolved the ES Modules `__dirname is not defined` error in `knexfile.ts` by defining `__dirname` manually using Node's `fileURLToPath` utility.
*   **Path Alignment Fix**: Discovered and resolved a path discrepancy where the Knex CLI and our local script were pointing to separate `codelens.db` files. Standardized the connection filename to `path.join(__dirname, '../../codelens.db')` so they always point to the project root.
*   **Migration Blueprint Written**: Wrote a migration script defining `users`, `reports`, and `feedback` tables with strict data types.
*   **Decoupled Deletion Policies**:
    *   Set `onDelete('SET NULL')` for `userId` on the `reports` table (reports remain anonymous if a user deletes their profile).
    *   Set `onDelete('CASCADE')` for `reportId` on the `feedback` table (feedback is automatically deleted if the report it refers to is deleted).
*   **Rollback & Revision Exercise**: Used `migrate:rollback` to undo a migration, fixed casing conflicts (`userID` to `userId`) and duplicate columns, and re-executed `migrate:latest`.
*   **Verification Check**: Wrote and executed a Node.js diagnostic script that queried the database directly and confirmed the correct tables were created.

---

## 2. Core Concepts Learned
*   **Version-Controlled Schema**: Using migration scripts instead of manually drawing tables allows us to maintain consistent database layouts across all local environments and CI pipelines.
*   **Node.js Module Scopes**: CommonJS provides `__dirname` and `__filename` globally, whereas ES Modules require us to resolve directories manually using `import.meta.url`.
*   **Cascading Rules**: Understanding `CASCADE` (deletes children when parent is deleted) vs. `SET NULL` (keeps children but zeroes out links) to control data lifecycles.

---

## 3. Student Review & Notes
*(Add your notes and thoughts about today's schema migration work here)*

---

## 4. Q&A (Questions & Answers)

### Q1: Why must the 'down' function drop tables in the reverse order of the 'up' function?
Because of foreign key constraints. You cannot delete the `users` table if `reports` is still pointing to it. You must delete the dependent tables first (`feedback` -> `reports` -> `users`) so that no orphaned relations exist during database destruction.

### Q2: Why did we choose onDelete('SET NULL') for reports.userId instead of CASCADE?
*   **The Defense**: To preserve aggregate metrics and analytics (e.g., framework popularity stats, total scan count). If we used CASCADE, we would lose historical data.
*   **Access Control**: Our dashboard query matches specific user IDs (`WHERE userId = ?`). Since a logged-in user's ID is never null, orphaned reports are automatically hidden from all user dashboards. They can only be accessed via direct share UUID links, and only if the creator marked the report as `isShared: true` before deleting their account.

