// connection.ts
// Single responsibility: Create and export the singleton Knex database connection.
// Importing from knexfile.ts keeps all connection config in one place.
// Other modules (services, controllers) import `knex` from here — never
// from knexfile directly — so there is only ever one connection pool open.

import Knex from 'knex';
import knexConfig from '@server/db/knexfile';

//Create the single shared database connection instance

const knex = Knex(knexConfig);

export default knex;