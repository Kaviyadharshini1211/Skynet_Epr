import { Request, Response } from "express";
import { getEprSummaryByPerson } from "../services/eprSummary.service";

export async function getEprSummaryController(req: Request, res: Response) {

  try {

    const personIdParam = req.params.personId;

    if (!personIdParam) {
      return res.status(400).json({
        message: "personId parameter is required"
      });
    }

    const personId = personIdParam as string;

    const summary = await getEprSummaryByPerson(personId);

    return res.json(summary);

  } catch (error) {

    console.error("Error fetching EPR summary:", error);

    return res.status(500).json({
      message: "Failed to fetch EPR summary"
    });

  }

}