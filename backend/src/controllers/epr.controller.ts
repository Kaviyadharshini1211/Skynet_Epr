import { Request, Response } from "express";
import {
  getEprsByPersonAndEvaluator,
  getEprById,
  createEpr,
  updateEpr,
  getEprByPerson
} from "../services/epr.service";

/* ---------------- GET EPR LIST ---------------- */

export async function getEprs(req: Request, res: Response) {
  try {

    const personIdParam = req.query.personId;

    if (!personIdParam) {
      return res.status(400).json({
        message: "personId query parameter is required"
      });
    }

    const personId = personIdParam as string;

    const currentUserId = req.headers["x-user-id"] as string;
    const currentUserRole = req.headers["x-user-role"] as string;

    /* ---------------- STUDENT RULE ---------------- */

    if (currentUserRole === "student") {

      if (personId !== currentUserId) {
        return res.status(403).json({
          message: "Students can only view their own EPRs"
        });
      }

      const eprs = await getEprByPerson(personId);

      return res.json(eprs);
    }

    /* ---------------- INSTRUCTOR RULE ---------------- */

    if (currentUserRole === "instructor") {

      const eprs = await getEprsByPersonAndEvaluator(
        personId,
        currentUserId
      );

      return res.json(eprs);
    }

    return res.json([]);

  } catch (error) {

    console.error("Error fetching EPRs:", error);

    return res.status(500).json({
      message: "Failed to fetch EPRs"
    });

  }
}

/* ---------------- GET SINGLE EPR ---------------- */

export async function getEpr(req: Request, res: Response) {
  try {

    const id = req.params.id as string;

    const epr = await getEprById(id);

    if (!epr) {
      return res.status(404).json({
        message: "EPR not found"
      });
    }

    return res.json(epr);

  } catch (error) {

    console.error("Error fetching EPR:", error);

    return res.status(500).json({
      message: "Failed to fetch EPR"
    });

  }
}


/* ---------------- CREATE EPR ---------------- */

export async function createEprController(req: Request, res: Response) {
  try {

    const currentUserRole = req.headers["x-user-role"] as string;
    const currentUserId = req.headers["x-user-id"] as string;

    /* Students cannot create EPR */

    if (currentUserRole === "student") {
      return res.status(403).json({
        message: "Students cannot create EPRs"
      });
    }

    const data = req.body;

    const {
      person_id,
      evaluator_id,
      role_type,
      overall_rating,
      technical_skills_rating,
      non_technical_skills_rating,
      period_start,
      period_end
    } = data;

    /* REQUIRED FIELD VALIDATION */

    if (
      !person_id ||
      !evaluator_id ||
      !role_type ||
      !period_start ||
      !period_end
    ) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    /* Instructor must be evaluator */

    if (currentUserRole === "instructor" && evaluator_id !== currentUserId) {
      return res.status(403).json({
        message: "Instructor can only create EPRs as themselves"
      });
    }

    /* RATING VALIDATION */

    if (
      overall_rating < 1 || overall_rating > 5 ||
      technical_skills_rating < 1 || technical_skills_rating > 5 ||
      non_technical_skills_rating < 1 || non_technical_skills_rating > 5
    ) {
      return res.status(400).json({
        message: "Ratings must be between 1 and 5"
      });
    }

    /* PERIOD VALIDATION */

    if (new Date(period_end) < new Date(period_start)) {
      return res.status(400).json({
        message: "period_end must be after period_start"
      });
    }

    const epr = await createEpr(data);

    return res.status(201).json(epr);

  } catch (error) {

    console.error("Error creating EPR:", error);

    return res.status(500).json({
      message: "Failed to create EPR"
    });

  }
}


/* ---------------- UPDATE EPR ---------------- */

export async function updateEprController(req: Request, res: Response) {
  try {

    const currentUserRole = req.headers["x-user-role"] as string;

    /* Students cannot edit */

    if (currentUserRole === "student") {
      return res.status(403).json({
        message: "Students cannot edit EPRs"
      });
    }

    const id = req.params.id as string;

    const {
      overall_rating,
      technical_skills_rating,
      non_technical_skills_rating
    } = req.body;

    /* VALIDATE RATINGS */

    if (overall_rating !== undefined) {
      if (overall_rating < 1 || overall_rating > 5) {
        return res.status(400).json({
          message: "overall_rating must be between 1 and 5"
        });
      }
    }

    if (technical_skills_rating !== undefined) {
      if (technical_skills_rating < 1 || technical_skills_rating > 5) {
        return res.status(400).json({
          message: "technical_skills_rating must be between 1 and 5"
        });
      }
    }

    if (non_technical_skills_rating !== undefined) {
      if (non_technical_skills_rating < 1 || non_technical_skills_rating > 5) {
        return res.status(400).json({
          message: "non_technical_skills_rating must be between 1 and 5"
        });
      }
    }

    const epr = await updateEpr(id, req.body);

    if (!epr) {
      return res.status(404).json({
        message: "EPR not found"
      });
    }

    return res.json(epr);

  } catch (error) {

    console.error("Error updating EPR:", error);

    return res.status(500).json({
      message: "Failed to update EPR"
    });

  }
}
/* ---------------- AI ASSIST ---------------- */

export async function assistEpr(req: Request, res: Response) {

  try {

    const {
      overallRating,
      technicalSkillsRating,
      nonTechnicalSkillsRating
    } = req.body;

    let suggestedRemarks = "";

    const avg =
      (overallRating +
        technicalSkillsRating +
        nonTechnicalSkillsRating) / 3;

    if (avg >= 4) {

      suggestedRemarks =
        "The student demonstrates strong technical fundamentals and maintains good situational awareness. Communication and procedural discipline are consistent with expected standards.";

    } else if (avg >= 3) {

      suggestedRemarks =
        "The student shows adequate performance but should continue improving consistency in technical execution and cockpit communication.";

    } else {

      suggestedRemarks =
        "The student needs improvement in technical skills and checklist discipline. Additional practice and instructor guidance are recommended.";

    }

    return res.json({
      suggestedRemarks
    });

  } catch (error) {

    console.error("AI assist error:", error);

    return res.status(500).json({
      message: "AI assist failed"
    });

  }
}