// connection.ts
// Single responsibility: Create and export the singleton Knex database connection.
// This connection is used by our Express application at runtime. It constructs
// its connection pool directly from validated environment variables (DATABASE_PATH)
// instead of importing knexfile.ts. This decouples our runtime database pipeline
// from our CLI migration configuration, preventing bundler CJS/ESM warnings.

import Knex from 'knex';
import { env } from '@server/config/env';
import path from 'path';

// Create the singleton Knex database connection instance
const knex = Knex({
  client: 'better-sqlite3',
  connection: {
    // Resolve the database path relative to process.cwd() (which is the project root at runtime)
    filename: path.resolve(process.cwd(), env.DATABASE_PATH),
  },
  useNullAsDefault: true,
  // pool: {
  //   afterCreate: (conn: any, cb: any) => {
  //     try {
  //       // Enforce SQLite foreign key constraints on connection boot
  //       conn.pragma('foreign_keys = ON');
  //       cb(null, conn);
  //     } catch (err) {
  pool: {
    afterCreate: (conn: any, cb: any) => {
      try {
        // Enforce SQLite foreign key constraints on connection boot
        conn.pragma('foreign_keys = ON');
        cb(null, conn);
      } catch (err) {
        cb(err, conn);
      }
    },
  },
});

export default knex;