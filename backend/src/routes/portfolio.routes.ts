import { Router } from "express";
import {
  getPortfolio,
  getPortfolioSummary,
  getSectorSummary,
} from "../controllers/portfolio.controller";

const router = Router();

router.get("/", getPortfolio);
router.get("/summary", getPortfolioSummary);
router.get("/sectors", getSectorSummary);

export default router;
