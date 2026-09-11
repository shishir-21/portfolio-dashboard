import { readPortfolioExcel } from "./excel.service";
import { fetchYahooCMP } from "./yahoo.service";
import { fetchGoogleFinanceData } from "./google-finance.service";
import { PortfolioStock } from "../types/portfolio";

const LIVE_CACHE_TTL_MS = 15 * 1000;

let cachedPortfolio: PortfolioStock[] | null = null;
let cacheExpiresAt = 0;
let cacheIncludesGoogleFinance = false;

let inFlightRequestGF: Promise<PortfolioStock[]> | null = null;
let inFlightRequestBasic: Promise<PortfolioStock[]> | null = null;

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

            const effectiveCMP = liveCMP;

            let updatedStock: PortfolioStock = {
                ...stock,
                cmpSource:
                    liveCMP !== null ? "yahoo" : "error",
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
            } else {
                updatedStock = {
                    ...updatedStock,
                    cmp: null,
                    presentValue: null,
                    gainLoss: null,
                    gainLossPercent: null,
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
        cacheExpiresAt > now &&
        (!includeGoogleFinance || cacheIncludesGoogleFinance)
    ) {
        return cachedPortfolio;
    }

    if (includeGoogleFinance && inFlightRequestGF) {
        return inFlightRequestGF;
    }
    
    if (!includeGoogleFinance && inFlightRequestBasic) {
        return inFlightRequestBasic;
    }

    const promise = fetchLivePortfolio(includeGoogleFinance).then((portfolio) => {
        // Only update cache if it's an upgrade (GF) or if cache is expired
        if (includeGoogleFinance || cacheExpiresAt <= Date.now()) {
            cachedPortfolio = portfolio;
            cacheExpiresAt = Date.now() + LIVE_CACHE_TTL_MS;
            cacheIncludesGoogleFinance = includeGoogleFinance;
        }

        return portfolio;
    });

    if (includeGoogleFinance) {
        inFlightRequestGF = promise;
        promise.then(
            () => { inFlightRequestGF = null; },
            () => { inFlightRequestGF = null; }
        );
    } else {
        inFlightRequestBasic = promise;
        promise.then(
            () => { inFlightRequestBasic = null; },
            () => { inFlightRequestBasic = null; }
        );
    }

    return promise;
}
