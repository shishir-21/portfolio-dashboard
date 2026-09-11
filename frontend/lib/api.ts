const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:5000/api";

async function fetchAPI(url: string) {
    const response = await fetch(url, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
    }

    return response.json();
}

export async function getPortfolioSummary() {
    return fetchAPI(
        `${API_BASE_URL}/portfolio/summary`
    );
}

export async function getSectorSummary() {
    return fetchAPI(
        `${API_BASE_URL}/portfolio/sectors`
    );
}

export async function getPortfolioPerformance() {
    return fetchAPI(
        `${API_BASE_URL}/portfolio/performance`
    );
}

export async function getPortfolio() {
    return fetchAPI(
        `${API_BASE_URL}/portfolio`
    );
}
