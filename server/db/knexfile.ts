// knexfile.ts
// CLI-Only configuration: This file is read exclusively by the Knex CLI
// to generate and execute migrations and seeds. It is NEVER imported by
// the Express runtime, which keeps it out of the production CJS bundle.

import type { Knex } from 'knex';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Resolve the directory where knexfile.ts lives (in ESM CLI scope)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the root-level .env file so the CLI knows where our database file is
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dbPath = process.env.DATABASE_PATH || 'codelens.db';

const config: Knex.Config = {
    client: 'better-sqlite3',
    connection: {
        // Resolve relative to the root folder (two levels up from server/db)
        filename: path.resolve(__dirname, '../../', dbPath),
    },
    useNullAsDefault: true,

    // Enforce foreign keys during CLI seeding & migrations too
    pool: {
        afterCreate: (conn: any, cb: any) => {
            try {
                conn.pragma('foreign_keys = ON');
                cb(null, conn);
            } catch (err) {
                cb(err, conn);
            }
        },
    },

    migrations: {
        directory: path.join(__dirname, 'migrations'),
        extension: 'ts',
    },
    seeds: {
        directory: path.join(__dirname, 'seeds'),
        extension: 'ts',
    },
};

export default config;
