import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("enrollments", (table) => {

    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    table
      .uuid("student_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .uuid("course_id")
      .references("id")
      .inTable("courses")
      .onDelete("CASCADE");

    table.date("start_date");

    table
      .enu("status", ["active", "completed", "dropped"])
      .defaultTo("active");

  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("enrollments");
}