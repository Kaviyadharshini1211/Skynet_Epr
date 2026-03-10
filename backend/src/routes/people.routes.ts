import express from "express";
import { getPeopleController } from "../controllers/people.controller";

const router = express.Router();

router.get("/people", getPeopleController);

export default router;