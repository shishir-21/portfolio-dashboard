import { getPortfolioSummary } from "../lib/api";

export default async function Home() {
  const response = await getPortfolioSummary();
  const summary = response.data;

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
        <p className={positive ? "card-status positive" : "card-status negative"}>
          {positive ? "Positive performance" : "Negative performance"}
        </p>
      )}
    </div>
  );
}
