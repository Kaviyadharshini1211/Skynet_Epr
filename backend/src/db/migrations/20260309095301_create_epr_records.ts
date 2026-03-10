import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("epr_records", (table) => {

    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    table
      .uuid("person_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .uuid("evaluator_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .enu("role_type", ["student", "instructor"])
      .notNullable();

    table.date("period_start");
    table.date("period_end");

    table.integer("overall_rating");
    table.integer("technical_skills_rating");
    table.integer("non_technical_skills_rating");

    table.text("remarks");

    table
      .enu("status", ["draft", "submitted", "archived"])
      .defaultTo("draft");

    table.timestamps(true, true);

  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("epr_records");
}