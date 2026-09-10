import { readPortfolioExcel } from "./excel.service";
import { fetchYahooCMP } from "./yahoo.service";
import { fetchGoogleFinanceData } from "./google-finance.service";
import { PortfolioStock } from "../types/portfolio";

const LIVE_CACHE_TTL_MS = 15 * 1000;

let cachedPortfolio: PortfolioStock[] | null = null;
let cacheExpiresAt = 0;

let inFlightRequest: Promise<PortfolioStock[]> | null = null;

async function fetchLivePortfolio(
    includeGoogleFinance: boolean
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

            const effectiveCMP =
                liveCMP !== null ? liveCMP : stock.cmp;

            let updatedStock: PortfolioStock = {
                ...stock,
                cmpSource:
                    liveCMP !== null ? "yahoo" : "excel",
            };

            if (effectiveCMP !== null) {
                const presentValue =
                    effectiveCMP * (stock.quantity ?? 0);

                const gainLoss =
                    presentValue - (stock.investment ?? 0);

                const gainLossPercent =
                    stock.investment &&
                    stock.investment > 0
                        ? (gainLoss / stock.investment) * 100
                        : null;

                updatedStock = {
                    ...updatedStock,
                    cmp: effectiveCMP,
                    presentValue,
                    gainLoss,
                    gainLossPercent,
                };
            }

            if (googleFinanceData.pe !== null) {
                updatedStock.pe = googleFinanceData.pe;
            }

            if (
                googleFinanceData.latestEarnings !== null
            ) {
                updatedStock.latestEarnings =
                    googleFinanceData.latestEarnings;
            }

            return updatedStock;
        })
    );
}

export async function getLivePortfolio(
    includeGoogleFinance = false
): Promise<PortfolioStock[]> {
    const now = Date.now();

    if (
        cachedPortfolio &&
        cacheExpiresAt > now
    ) {
        return cachedPortfolio;
    }

    if (inFlightRequest) {
        return inFlightRequest;
    }

    inFlightRequest = fetchLivePortfolio(
        includeGoogleFinance
    )
        .then((portfolio) => {
            cachedPortfolio = portfolio;
            cacheExpiresAt =
                Date.now() + LIVE_CACHE_TTL_MS;

            return portfolio;
        })
        .finally(() => {
            inFlightRequest = null;
        });

    return inFlightRequest;
}
