const API_BASE_URL = "http://127.0.0.1:5000/api";

export async function getPortfolioSummary() {
  const response = await fetch(`${API_BASE_URL}/portfolio/summary`);

  if (!response.ok) {
    throw new Error("Failed to fetch portfolio summary");
  }

  return response.json();
}

export async function getSectorSummary() {
  const response = await fetch(`${API_BASE_URL}/portfolio/sectors`);

  if (!response.ok) {
    throw new Error("Failed to fetch sector summary");
  }

  return response.json();
}

export async function getPortfolioPerformance() {
  const response = await fetch(`${API_BASE_URL}/portfolio/performance`);

  if (!response.ok) {
    throw new Error("Failed to fetch portfolio performance");
  }

  return response.json();
}
