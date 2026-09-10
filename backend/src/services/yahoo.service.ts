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

function getYahooSymbol(
  symbol: string,
  exchange: "NSE" | "BSE"
): string {
  return exchange === "NSE"
    ? `${symbol}.NS`
    : `${symbol}.BO`;
}

export async function fetchYahooCMP(
  symbol: string,
  exchange: "NSE" | "BSE"
): Promise<number | null> {
  const yahooSymbol = getYahooSymbol(symbol, exchange);

  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/` +
    `${encodeURIComponent(yahooSymbol)}?range=1d&interval=1d`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Yahoo Finance request failed: ${response.status}`
      );
    }

    const data =
      (await response.json()) as YahooChartResponse;

    const price =
      data.chart?.result?.[0]?.meta?.regularMarketPrice;

    return typeof price === "number" ? price : null;
  } catch (error) {
    console.error(
      `Failed to fetch Yahoo CMP for ${yahooSymbol}:`,
      error
    );

    return null;
  }
}
