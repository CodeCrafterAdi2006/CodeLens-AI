// knexfile.ts
// Single responsibility: Knex database connection configuration.
// This file is read by Knex CLI (for running migrations) and by our
// db connection module at runtime. We use better-sqlite3 as the driver
// because it is synchronous, zero-config, and ideal for single-server
// deployments without a separate database process to manage

import type { Knex } from 'knex';
import path from 'path';

const config: Knex.Config = {
    // Use better-sqlite3 driver (faster and more reliable than the legacy sqlite3 package)
    client: 'better-sqlite3',

    connection: {
        // Store the database file in the project root so it is easy to find and back up
        filename: path.join(process.cwd(),
            'codelens.db'),
    },

    //Knex requires this flag for SQLite to prevent it from inserting "undefined" values when
    //a column is not explicitly set
    useNullAsDefault: true,

    migrations: {
        //All versioned migration files live here 
        directory: path.join(process.cwd(), 'server/db/migrations'),
        // Use Typescript migrations files
        extension: 'ts',
    },

    seeds: {
        // Seed files for populating the database with test data
        directory: path.join(process.cwd(), 'server/db/seeds'),
        extension: 'ts',
    },

};

export default config;