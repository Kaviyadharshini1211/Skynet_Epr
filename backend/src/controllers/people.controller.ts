import { Request, Response } from "express";
import { getPeople } from "../services/people.service";

export async function getPeopleController(req: Request, res: Response) {

  try {

    const { role, search } = req.query;

    const people = await getPeople(
      role as string,
      search as string
    );

    res.json(people);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch people"
    });

  }

}