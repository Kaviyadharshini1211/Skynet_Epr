import db from "../db/knex";

export async function getEprSummaryByPerson(personId: string) {

  const stats = await db("epr_records")
    .where("person_id", personId)
    .avg("overall_rating as averageOverallRating")
    .avg("technical_skills_rating as averageTechnicalRating")
    .avg("non_technical_skills_rating as averageNonTechnicalRating")
    .count("* as eprCount")
    .first();

  const lastThree = await db("epr_records")
    .where("person_id", personId)
    .orderBy("period_start", "desc")
    .limit(3)
    .select(
      "period_start",
      "period_end",
      "overall_rating"
    );

  return {
    personId,
    averageOverallRating: Number(stats?.averageOverallRating || 0).toFixed(2),
    averageTechnicalRating: Number(stats?.averageTechnicalRating || 0).toFixed(2),
    averageNonTechnicalRating: Number(stats?.averageNonTechnicalRating || 0).toFixed(2),
    eprCount: Number(stats?.eprCount || 0),
    lastThreePeriods: lastThree
  };

}