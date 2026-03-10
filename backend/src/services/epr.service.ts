import db from "../db/knex";

/* ---------------- GET EPRS BY PERSON AND EVALUATOR ---------------- */

export async function getEprsByPersonAndEvaluator(
  personId: string,
  evaluatorId: string
) {
  return db("epr_records")
    .select(
      "id",
      "person_id",
      "evaluator_id",
      "role_type",
      "period_start",
      "period_end",
      "overall_rating",
      "technical_skills_rating",
      "non_technical_skills_rating",
      "remarks",
      "status",
      "created_at",
      "updated_at"
    )
    .where({
      person_id: personId,
      evaluator_id: evaluatorId
    })
    .orderBy("period_start", "desc");
}
export async function getEprByPerson(personId: string) {
  return db("epr_records")
    .where("person_id", personId)
    .orderBy("period_start", "desc");
}
/* ---------------- GET SINGLE EPR ---------------- */

export async function getEprById(id: string) {
  return db("epr_records")
    .where("id", id)
    .first();
}

/* ---------------- CREATE EPR ---------------- */

export async function createEpr(data: any) {
  const [epr] = await db("epr_records")
    .insert(data)
    .returning("*");

  return epr;
}

/* ---------------- UPDATE EPR ---------------- */

export async function updateEpr(id: string, data: any) {
  const [epr] = await db("epr_records")
    .where("id", id)
    .update(data)
    .returning("*");

  return epr;
}
