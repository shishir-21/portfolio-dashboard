import { Request, Response } from "express";
import { readPortfolioExcel } from "../services/excel.service";

export function getPortfolio(_req: Request, res: Response) {
  try {
    const portfolio = readPortfolioExcel();

    res.json({
      success: true,
      count: portfolio.length,
      data: portfolio,
    });
  } catch (error) {
    console.error("Failed to load portfolio:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load portfolio data",
    });
  }
}

export function getPortfolioSummary(_req: Request, res: Response) {
  try {
    const portfolio = readPortfolioExcel();

    const activePortfolio = portfolio.filter(
      (stock) => stock.status === "active"
    );

    const totalInvestment = activePortfolio.reduce(
      (total, stock) => total + (stock.investment ?? 0),
      0
    );

    const presentValue = activePortfolio.reduce(
      (total, stock) => total + (stock.presentValue ?? 0),
      0
    );

    const totalGainLoss = presentValue - totalInvestment;

    const gainLossPercent =
      totalInvestment > 0
        ? (totalGainLoss / totalInvestment) * 100
        : 0;

    res.json({
      success: true,
      data: {
        totalInvestment,
        presentValue,
        totalGainLoss,
        gainLossPercent,
        totalHoldings: activePortfolio.length,
      },
    });
  } catch (error) {
    console.error("Failed to calculate portfolio summary:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate portfolio summary",
    });
  }
}
