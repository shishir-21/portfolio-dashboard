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

export function getSectorSummary(_req: Request, res: Response) {
  try {
    const portfolio = readPortfolioExcel();

    const activePortfolio = portfolio.filter(
      (stock) => stock.status === "active"
    );

    const sectorMap = new Map<
      string,
      {
        investment: number;
        presentValue: number;
      }
    >();

    for (const stock of activePortfolio) {
      const current = sectorMap.get(stock.sector) ?? {
        investment: 0,
        presentValue: 0,
      };

      current.investment += stock.investment ?? 0;
      current.presentValue += stock.presentValue ?? 0;

      sectorMap.set(stock.sector, current);
    }

    const totalInvestment = activePortfolio.reduce(
      (total, stock) => total + (stock.investment ?? 0),
      0
    );

    const data = Array.from(sectorMap.entries()).map(
      ([sector, values]) => ({
        sector,
        investment: values.investment,
        presentValue: values.presentValue,
        percentage:
          totalInvestment > 0
            ? (values.investment / totalInvestment) * 100
            : 0,
      })
    );

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Failed to calculate sector summary:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate sector summary",
    });
  }
}

export function getPortfolioPerformance(_req: Request, res: Response) {
  try {
    const portfolio = readPortfolioExcel();

    const activePortfolio = portfolio
      .filter(
        (stock) =>
          stock.status === "active" &&
          stock.gainLossPercent !== null
      )
      .map((stock) => ({
        name: stock.name,
        sector: stock.sector,
        cmp: stock.cmp,
        presentValue: stock.presentValue,
        gainLoss: stock.gainLoss,
        gainLossPercent: stock.gainLossPercent,
      }));

    const sorted = [...activePortfolio].sort(
      (a, b) =>
        (b.gainLossPercent ?? 0) -
        (a.gainLossPercent ?? 0)
    );

    const topGainers = sorted.slice(0, 5);

    const topLosers = [...activePortfolio]
      .sort(
        (a, b) =>
          (a.gainLossPercent ?? 0) -
          (b.gainLossPercent ?? 0)
      )
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        topGainers,
        topLosers,
      },
    });
  } catch (error) {
    console.error("Failed to calculate portfolio performance:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate portfolio performance",
    });
  }
}
