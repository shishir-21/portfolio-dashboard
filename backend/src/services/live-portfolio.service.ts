import { readPortfolioExcel } from "./excel.service";
import { fetchYahooCMP } from "./yahoo.service";
import { fetchGoogleFinanceData } from "./google-finance.service";
import { PortfolioStock } from "../types/portfolio";

export async function getLivePortfolio(
    includeGoogleFinance = false
): Promise<PortfolioStock[]> {
    const portfolio = readPortfolioExcel();

    return Promise.all(
        portfolio.map(async (stock) => {
            if (!stock.symbol || !stock.exchange) {
                return stock;
            }

            const yahooPromise = fetchYahooCMP(
                stock.symbol,
                stock.exchange
            );

            const googlePromise = includeGoogleFinance
                ? fetchGoogleFinanceData(
                      stock.symbol,
                      stock.exchange
                  )
                : Promise.resolve({
                      pe: null,
                      latestEarnings: null,
                  });

            const [liveCMP, googleFinanceData] =
                await Promise.all([
                    yahooPromise,
                    googlePromise,
                ]);

            // Use Yahoo CMP when available.
            // Otherwise, use the CMP from Excel.
            const effectiveCMP =
                liveCMP !== null
                    ? liveCMP
                    : stock.cmp;

            let updatedStock: PortfolioStock = {
                ...stock,
                cmpSource:
                    liveCMP !== null
                        ? "yahoo"
                        : "excel",
            };

            // Recalculate portfolio values using
            // live Yahoo CMP or Excel fallback CMP.
            if (effectiveCMP !== null) {
                const presentValue =
                    effectiveCMP *
                    (stock.quantity ?? 0);

                const gainLoss =
                    presentValue -
                    (stock.investment ?? 0);

                const gainLossPercent =
                    stock.investment &&
                    stock.investment > 0
                        ? (gainLoss /
                              stock.investment) *
                          100
                        : null;

                updatedStock = {
                    ...updatedStock,
                    cmp: effectiveCMP,
                    presentValue,
                    gainLoss,
                    gainLossPercent,
                };
            }

            // Google Finance is only fetched when requested.
            if (googleFinanceData.pe !== null) {
                updatedStock.pe =
                    googleFinanceData.pe;
            }

            if (
                googleFinanceData.latestEarnings !==
                null
            ) {
                updatedStock.latestEarnings =
                    googleFinanceData.latestEarnings;
            }

            return updatedStock;
        })
    );
}
