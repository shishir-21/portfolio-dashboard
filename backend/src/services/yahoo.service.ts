interface YahooChartResponse {
    chart?: {
        result?: Array<{
            meta?: {
                regularMarketPrice?: number;
            };
        }>;
        error?: {
            description?: string;
        };
    };
}

interface CachedCMP {
    value: number | null;
    expiresAt: number;
}

const cache = new Map<string, CachedCMP>();
const inFlight = new Map<string, Promise<number | null>>();

const CACHE_TTL_MS = 30 * 1000;

const YAHOO_SYMBOL_MAP: Record<string, string> = {
    "LTIM": "LTM",
};

function getYahooSymbol(
    symbol: string,
    exchange: "NSE" | "BSE"
): string {
    const mappedSymbol = YAHOO_SYMBOL_MAP[symbol] || symbol;
    return exchange === "NSE"
        ? `${mappedSymbol}.NS`
        : `${mappedSymbol}.BO`;
}

export async function fetchYahooCMP(
    symbol: string,
    exchange: "NSE" | "BSE"
): Promise<number | null> {
    const yahooSymbol = getYahooSymbol(symbol, exchange);

    const cached = cache.get(yahooSymbol);
    if (cached && cached.expiresAt > Date.now()) {
        return cached.value;
    }

    if (inFlight.has(yahooSymbol)) {
        return inFlight.get(yahooSymbol)!;
    }

    const url =
        `https://query2.finance.yahoo.com/v8/finance/chart/` +
        `${encodeURIComponent(yahooSymbol)}?range=1d&interval=1d`;

    const promise = (async () => {
        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(
                    `Yahoo Finance request failed: ${response.status} ${response.statusText}`
                );
            }

            const data =
                (await response.json()) as YahooChartResponse;

            const price =
                data.chart?.result?.[0]?.meta?.regularMarketPrice;

            const cmp =
                typeof price === "number"
                    ? price
                    : null;

            cache.set(yahooSymbol, {
                value: cmp,
                expiresAt: Date.now() + CACHE_TTL_MS,
            });

            return cmp;
        } catch (error) {
            console.error(
                `Yahoo CMP unavailable for ${yahooSymbol}: ${(error as Error).message}`
            );

            cache.set(yahooSymbol, {
                value: null,
                expiresAt: Date.now() + CACHE_TTL_MS,
            });

            return null;
        }
    })();

    inFlight.set(yahooSymbol, promise);

    promise.then(
        () => inFlight.delete(yahooSymbol),
        () => inFlight.delete(yahooSymbol)
    );

    return promise;
}
