import {
  getPortfolioSummary,
  getSectorSummary,
  getPortfolioPerformance,
} from "../lib/api";

export default async function Home() {
  const [
    summaryResponse,
    sectorResponse,
    performanceResponse,
  ] = await Promise.all([
    getPortfolioSummary(),
    getSectorSummary(),
    getPortfolioPerformance(),
  ]);

  const summary = summaryResponse.data;
  const sectors = sectorResponse.data;
  const performance = performanceResponse.data;

  console.log("Portfolio performance:", performance);

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">PORTFOLIO OVERVIEW</p>
          <h1>Portfolio Dashboard</h1>
          <p className="subtitle">
            Track your investments, performance, and portfolio allocation.
          </p>
        </div>
      </div>

      <section className="summary-grid">
        <SummaryCard
          title="Total Investment"
          value={`₹${summary.totalInvestment.toLocaleString("en-IN")}`}
        />

        <SummaryCard
          title="Current Value"
          value={`₹${summary.presentValue.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}`}
        />

        <SummaryCard
          title="Total Gain / Loss"
          value={`₹${summary.totalGainLoss.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}`}
          positive={summary.totalGainLoss >= 0}
        />

        <SummaryCard
          title="Overall Return"
          value={`${summary.gainLossPercent.toFixed(2)}%`}
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
          {sectors.map(
            (sector: {
              sector: string;
              investment: number;
              presentValue: number;
              percentage: number;
            }) => (
              <div className="sector-row" key={sector.sector}>
                <div className="sector-info">
                  <div>
                    <p className="sector-name">{sector.sector}</p>
                    <p className="sector-value">
                      ₹
                      {sector.presentValue.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
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
            )
          )}
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
              <span className="performance-label positive">Gainers</span>
            </div>

            <div className="performance-list">
              {performance.topGainers.map(
                (stock: {
                  name: string;
                  gainLossPercent: number;
                  gainLoss: number;
                }) => (
                  <div className="performance-row" key={stock.name}>
                    <div>
                      <p className="performance-name">{stock.name}</p>
                      <p className="performance-gain">
                        +₹
                        {stock.gainLoss.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <span className="performance-percent positive">
                      +{(stock.gainLossPercent * 100).toFixed(2)}%
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="performance-card">
            <div className="performance-card-header">
              <h3>Top Losers</h3>
              <span className="performance-label negative">Losers</span>
            </div>

            <div className="performance-list">
              {performance.topLosers.map(
                (stock: {
                  name: string;
                  gainLossPercent: number;
                  gainLoss: number;
                }) => (
                  <div className="performance-row" key={stock.name}>
                    <div>
                      <p className="performance-name">{stock.name}</p>
                      <p className="performance-loss">
                        ₹
                        {stock.gainLoss.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <span className="performance-percent negative">
                      {(stock.gainLossPercent * 100).toFixed(2)}%
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
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
      <p className="card-value">{value}</p>

      {positive !== undefined && (
        <p
          className={
            positive ? "card-status positive" : "card-status negative"
          }
        >
          {positive ? "Positive performance" : "Negative performance"}
        </p>
      )}
    </div>
  );
}
