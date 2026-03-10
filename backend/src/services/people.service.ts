import db from "../db/knex";

export async function getPeople(role?: string, search?: string) {

  let query = db("users")
    .leftJoin("enrollments", "users.id", "enrollments.student_id")
    .leftJoin("courses", "enrollments.course_id", "courses.id")
    .leftJoin("epr_records", "users.id", "epr_records.evaluator_id")
    .groupBy(
      "users.id",
      "courses.name",
      "enrollments.status"
    )
    .select(
      "users.id",
      "users.name",
      "users.email",
      "users.role",
      "courses.name as course_name",
      "enrollments.status"
    )
    .count("epr_records.id as total_eprs_written");

  /* FILTER BY ROLE */

  if (role) {
    query = query.where("users.role", role);
  }

  /* SEARCH BY NAME OR EMAIL */

  if (search) {
    query = query.where(function () {
      this.where("users.name", "ilike", `%${search}%`)
        .orWhere("users.email", "ilike", `%${search}%`);
    });
  }

  return query;
}