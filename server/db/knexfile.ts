// knexfile.ts
// Single responsibility: Knex database connection configuration.
// This file is read by Knex CLI (for running migrations) and by our
// db connection module at runtime. We use better-sqlite3 as the driver
// because it is synchronous, zero-config, and ideal for single-server
// deployments without a separate database process to manage

import type { Knex } from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: Knex.Config = {
    // Use better-sqlite3 driver (faster and more reliable than the legacy sqlite3 package)
    client: 'better-sqlite3',

    connection: {
        // Use __dirname to navigate up to the root folder so it resolves consistently
        filename: path.join(__dirname, '../../codelens.db'),
    },

    //Knex requires this flag for SQLite to prevent it from inserting "undefined" values when
    //a column is not explicitly set
    useNullAsDefault: true,

    migrations: {
        //__dirname points to the server/db folder, so we just join it with 'migrations'
        directory: path.join(__dirname, 'migrations'),
        // Use Typescript migrations files
        extension: 'ts',
    },

    seeds: {
        // Seed files for populating the database with test data
        directory: path.join(__dirname, 'seeds'),
        extension: 'ts',
    },

};

export default config;