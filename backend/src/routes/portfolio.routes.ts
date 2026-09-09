import { Router } from "express";
import {
  getPortfolio,
  getPortfolioSummary,
} from "../controllers/portfolio.controller";

const router = Router();

router.get("/", getPortfolio);
router.get("/summary", getPortfolioSummary);

export default router;
