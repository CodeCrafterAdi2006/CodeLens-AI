import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    // 1. Create the Users Table
    await
        knex.schema.createTable('users', (table) => {
            table.text('id').primary(); // Primary Key

            table.text('email').unique().notNullable(); // Indexed, unique login email

            table.text('passwordHash').notNullable();

            table.text('name').notNullable();

            table.text('createdAt').notNullable();
        });

    await
        knex.schema.createTable('reports', (table) => {
            table.text('id').primary(); // Primary Key

            //Foriegn Key: links report to the user who ran it.
            //If a user deletes their profile, we keep the report but set userID to NULL (onDelete('SET NULL'))
            table.text('userId').references('id').inTable('users').onDelete('SET NULL').nullable();

            table.text('title').notNullable();

            table.text('domain').notNullable();

            table.text('inputType').notNullable();

            table.text('inputValue').notNullable();

            // SQLite doesn't support raw arrays or sub-objects natively.
            // We store arrays/objects (like techStack and workflow) as serialized JSON strings.

            table.text('techStack').notNullable();

            table.text('architectureSummary').notNullable();

            table.text('architectureNodes').notNullable();

            table.text('uiUxAnalysis').notNullable();

            table.text('databaseHypothesis').notNullable();

            table.text('developmentWorkflow').notNullable();

            table.text('learningRoadmap').notNullable();

            table.text('improvementSuggestions').notNullable();

            table.text('missingInferences').notNullable();

            table.boolean('isShared').defaultTo(false).notNullable();

            table.text('createdAt').notNullable();
        });

    // 3. Create the Feedback Table
    await
        knex.schema.createTable('feedback', (table) => {
            table.text('id').primary(); // Primary Key

            // Foreign Key: links to the report.
            // If a report is deleted, all feedback attached to it is wiped too (onDelete('CASCADE'))
            table.text('reportId').references('id').inTable('reports').onDelete('CASCADE').notNullable();

            table.text('userId').references('id').inTable('users').onDelete('SET NULL').nullable();

            table.text('userName').notNullable();

            table.integer('rating').notNullable();

            table.text('comments').notNullable();

            table.text('createdAt').notNullable();
        });

}


export async function down(knex: Knex): Promise<void> {
    // When undoing/rolling back, we must drop tables in reverse order of their relationships.
    // We cannot drop 'users' first because 'reports' is still pointing to it!
    await knex.schema.dropTableIfExists('feedback');
    await knex.schema.dropTableIfExists('reports');
    await knex.schema.dropTableIfExists('users');
}

