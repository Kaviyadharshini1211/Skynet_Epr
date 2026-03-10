import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("courses", (table) => {

    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    table.string("name").notNullable();

    table.string("license_type").notNullable();

    table.integer("total_required_hours").notNullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("courses");
}