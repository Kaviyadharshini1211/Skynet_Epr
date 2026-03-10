import express from "express";
import {
  getEprs,
  getEpr,
  createEprController,
  updateEprController,
  assistEpr
} from "../controllers/epr.controller";
import { getEprSummaryController } from "../controllers/eprSummary.controller";

const router = express.Router();
router.get("/epr/summary/:personId", getEprSummaryController);
router.get("/epr", getEprs);
router.get("/epr/:id", getEpr);
router.post("/epr/assist", assistEpr);
router.post("/epr", createEprController);
router.patch("/epr/:id", updateEprController);

export default router;