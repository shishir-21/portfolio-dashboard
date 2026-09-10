interface GoogleFinanceData {
    pe: number | null;
    latestEarnings: number | null;
}

function getGoogleFinanceUrl(
    symbol: string,
    exchange: "NSE" | "BSE"
): string {
    return `https://www.google.com/finance/quote/${encodeURIComponent(
        symbol
    )}:${exchange}`;
}

function parseNumber(value: string): number | null {
    const cleaned = value
        .replace(/₹/g, "")
        .replace(/,/g, "")
        .replace(/%/g, "")
        .trim();

    const number = Number(cleaned);

    return Number.isFinite(number) ? number : null;
}

function extractMetric(
    html: string,
    label: string
): number | null {
    const escapedLabel = label.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    const pattern = new RegExp(
        `>${escapedLabel}<\\/div><div[^>]*>([^<]+)<\\/div>`,
        "i"
    );

    const match = html.match(pattern);

    if (!match) {
        return null;
    }

    return parseNumber(match[1]);
}

export async function fetchGoogleFinanceData(
    symbol: string,
    exchange: "NSE" | "BSE"
): Promise<GoogleFinanceData> {
    const url = getGoogleFinanceUrl(symbol, exchange);

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Google Finance request failed: ${response.status}`
            );
        }

        const html = await response.text();

        const pe = extractMetric(html, "P/E ratio");
        const latestEarnings = extractMetric(html, "EPS");

        return {
            pe,
            latestEarnings,
        };
    } catch (error) {
        console.error(
            `Failed to fetch Google Finance data for ${symbol}:${exchange}:`,
            error
        );

        return {
            pe: null,
            latestEarnings: null,
        };
    }
}
