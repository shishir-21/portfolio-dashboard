"use client";

import { useCallback, useEffect, useState } from "react";
import HoldingsTable from "./components/HoldingsTable";
import {
  getPortfolioSummary,
  getSectorSummary,
  getPortfolioPerformance,
  getPortfolio,
} from "../lib/api";

interface Summary {
  totalInvestment: number;
  presentValue: number;
  totalGainLoss: number;
  gainLossPercent: number;
  totalHoldings: number;
}

interface Sector {
  sector: string;
  investment: number;
  presentValue: number;
  percentage: number;
}

interface PerformanceStock {
  name: string;
  gainLossPercent: number;
  gainLoss: number;
}

interface Performance {
  topGainers: PerformanceStock[];
  topLosers: PerformanceStock[];
}

interface PortfolioStock {
  no: number;
  name: string;
  sector: string;
  investment: number | null;
  presentValue: number | null;
  gainLoss: number | null;
  gainLossPercent: number | null;
  symbol: string | null;
  status: "active" | "sold";

  purchasePrice: number | null;
  quantity: number | null;
  cmp: number | null;
  marketCap: number | null;
  pe: number | null;
  latestEarnings: number | null;

  revenueTTM: number | null;
  ebitdaTTM: number | null;
  ebitdaPercent: number | null;

  pat: number | null;
  patPercent: number | null;

  cfoMarch24: number | null;
  cfo5Years: number | null;
  freeCashFlow5Years: number | null;

  debtToEquity: number | null;
  bookValue: number | null;

  revenueGrowth: number | null;
  ebitdaGrowth: number | null;
  profitGrowth: number | null;
  marketCapGrowth: number | null;

  priceToSales: number | null;
  cfoToEbitda: number | null;
  cfoToPat: number | null;
  priceToBook: number | null;

  stage2: string | null;
  salePrice: number | null;
  abhishek: string | null;
}

export default function Home() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [performance, setPerformance] =
    useState<Performance | null>(null);
  const [portfolio, setPortfolio] =
    useState<PortfolioStock[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const loadDashboard = useCallback(
    async (showLoading = false) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        const [
          summaryResponse,
          sectorResponse,
          performanceResponse,
          portfolioResponse,
        ] = await Promise.all([
          getPortfolioSummary(),
          getSectorSummary(),
          getPortfolioPerformance(),
          getPortfolio(),
        ]);

        setSummary(summaryResponse.data);
        setSectors(sectorResponse.data);
        setPerformance(performanceResponse.data);
        setPortfolio(portfolioResponse.data);

        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        console.error(
          "Failed to load dashboard:",
          err
        );

        setError(
          "Failed to refresh portfolio data."
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    // Initial dashboard load
    loadDashboard(true);

    // Refresh live data every 15 seconds
    const interval = setInterval(() => {
      loadDashboard(false);
    }, 15_000);

    // Cleanup interval when component unmounts
    return () => {
      clearInterval(interval);
    };
  }, [loadDashboard]);

  if (loading || !summary || !performance) {
    return (
      <main className="dashboard">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">
              PORTFOLIO OVERVIEW
            </p>

            <h1>Portfolio Dashboard</h1>

            <p className="subtitle">
              Loading portfolio data...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">
            PORTFOLIO OVERVIEW
          </p>

          <h1>Portfolio Dashboard</h1>

          <p className="subtitle">
            Track your investments, performance, and
            portfolio allocation.
          </p>

          {lastUpdated && (
            <p className="subtitle">
              Live data · Updated at{" "}
              {lastUpdated.toLocaleTimeString("en-IN")}{" "}
              · Refreshes every 15 seconds
            </p>
          )}

          {error && (
            <p className="subtitle">
              {error}
            </p>
          )}
        </div>
      </div>

      <section className="summary-grid">
        <SummaryCard
          title="Total Investment"
          value={`₹${summary.totalInvestment.toLocaleString(
            "en-IN"
          )}`}
        />

        <SummaryCard
          title="Current Value"
          value={`₹${summary.presentValue.toLocaleString(
            "en-IN",
            {
              maximumFractionDigits: 2,
            }
          )}`}
        />

        <SummaryCard
          title="Total Gain / Loss"
          value={`₹${summary.totalGainLoss.toLocaleString(
            "en-IN",
            {
              maximumFractionDigits: 2,
            }
          )}`}
          positive={summary.totalGainLoss >= 0}
        />

        <SummaryCard
          title="Overall Return"
          value={`${summary.gainLossPercent.toFixed(
            2
          )}%`}
          positive={summary.gainLossPercent >= 0}
        />

        <SummaryCard
          title="Active Holdings"
          value={summary.totalHoldings.toString()}
        />
      </section>

      <section className="sector-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">ALLOCATION</p>
            <h2>Sector Allocation</h2>
          </div>

          <p className="section-description">
            Portfolio distribution by sector
          </p>
        </div>

        <div className="sector-list">
          {sectors.map((sector) => (
            <div
              className="sector-row"
              key={sector.sector}
            >
              <div className="sector-info">
                <div>
                  <p className="sector-name">
                    {sector.sector}
                  </p>

                  <p className="sector-value">
                    ₹
                    {sector.presentValue.toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>
                </div>

                <span className="sector-percentage">
                  {sector.percentage.toFixed(2)}%
                </span>
              </div>

              <div className="sector-bar-background">
                <div
                  className="sector-bar"
                  style={{
                    width: `${sector.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="performance-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">PERFORMANCE</p>
            <h2>Top Gainers & Losers</h2>
          </div>

          <p className="section-description">
            Best and worst performing holdings
          </p>
        </div>

        <div className="performance-grid">
          <div className="performance-card">
            <div className="performance-card-header">
              <h3>Top Gainers</h3>

              <span className="performance-label positive">
                Gainers
              </span>
            </div>

            <div className="performance-list">
              {performance.topGainers.map(
                (stock) => (
                  <div
                    className="performance-row"
                    key={stock.name}
                  >
                    <div>
                      <p className="performance-name">
                        {stock.name}
                      </p>

                      <p className="performance-gain">
                        +₹
                        {stock.gainLoss.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>
                    </div>

                    <span className="performance-percent positive">
                      +
                      {stock.gainLossPercent.toFixed(
                        2
                      )}
                      %
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="performance-card">
            <div className="performance-card-header">
              <h3>Top Losers</h3>

              <span className="performance-label negative">
                Losers
              </span>
            </div>

            <div className="performance-list">
              {performance.topLosers.map(
                (stock) => (
                  <div
                    className="performance-row"
                    key={stock.name}
                  >
                    <div>
                      <p className="performance-name">
                        {stock.name}
                      </p>

                      <p className="performance-loss">
                        ₹
                        {stock.gainLoss.toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>
                    </div>

                    <span className="performance-percent negative">
                      {stock.gainLossPercent.toFixed(
                        2
                      )}
                      %
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <HoldingsTable portfolio={portfolio} />
    </main>
  );
}

function SummaryCard({
  title,
  value,
  positive,
}: {
  title: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="summary-card">
      <p className="card-title">{title}</p>

      <p 
        className={
          positive !== undefined
            ? positive
              ? "card-value positive"
              : "card-value negative"
            : "card-value"
        }
      >
        {value}
      </p>
    </div>
  );
}
