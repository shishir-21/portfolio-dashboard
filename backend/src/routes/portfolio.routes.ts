import { Router } from "express";
import {
  getPortfolio,
  getPortfolioSummary,
  getSectorSummary,
  getPortfolioPerformance,
} from "../controllers/portfolio.controller";

const router = Router();

router.get("/", getPortfolio);
router.get("/summary", getPortfolioSummary);
router.get("/sectors", getSectorSummary);
router.get("/performance", getPortfolioPerformance);

export default router;
