import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

  await knex.schema.alterTable("epr_records", (table) => {

    table.index(["person_id"]);
    table.index(["evaluator_id"]);
    table.index(["period_start"]);
    table.index(["period_end"]);

  });

}

export async function down(knex: Knex): Promise<void> {

  await knex.schema.alterTable("epr_records", (table) => {

    table.dropIndex(["person_id"]);
    table.dropIndex(["evaluator_id"]);
    table.dropIndex(["period_start"]);
    table.dropIndex(["period_end"]);

  });

}