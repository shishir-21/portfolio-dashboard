import {
  getPortfolioSummary,
  getSectorSummary,
} from "../lib/api";

export default async function Home() {
  const [summaryResponse, sectorResponse] = await Promise.all([
    getPortfolioSummary(),
    getSectorSummary(),
  ]);

  const summary = summaryResponse.data;
  const sectors = sectorResponse.data;

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
