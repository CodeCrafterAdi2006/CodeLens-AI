// knexfile.ts
// Single responsibility: Knex database connection configuration.
// This file is read by Knex CLI (for running migrations) and by our
// db connection module at runtime. We use better-sqlite3 as the driver
// because it is synchronous, zero-config, and ideal for single-server
// deployments without a separate database process to manage

import type { Knex } from 'knex';
import path from 'path';

// 1. Detect if we are running in the Knex CLI context (working dir ends with 'db')
const isDbFolder = process.cwd().endsWith('db') || process.cwd().endsWith('db/');

// 2. Resolve database, migrations, and seeds paths dynamically
const dbPath = isDbFolder
    ? path.join(process.cwd(), '../../codelens.db')
    : path.join(process.cwd(), 'codelens.db');

const migrationsPath = isDbFolder
    ? path.join(process.cwd(), 'migrations')
    : path.join(process.cwd(), 'server/db/migrations');

const seedsPath = isDbFolder
    ? path.join(process.cwd(), 'seeds')
    : path.join(process.cwd(), 'server/db/seeds');

const config: Knex.Config = {
    client: 'better-sqlite3',
    connection: {
        filename: dbPath,
    },
    useNullAsDefault: true,

    pool: {
        afterCreate: (conn: any, cb: any) => {
            try {
                // Force SQLite to enforce foreign key constraints at connection creation
                conn.pragma('foreign_keys = ON');
                cb(null, conn);
            } catch (err) {
                cb(err, conn);
            }
        },
    },

    migrations: {
        directory: migrationsPath,
        extension: 'ts',
    },

    seeds: {
        directory: seedsPath,
        extension: 'ts',
    },


};

export default config;