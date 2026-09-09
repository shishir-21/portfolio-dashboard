import { getPortfolioSummary } from "../lib/api";

export default async function Home() {
  const summary = await getPortfolioSummary();

  return (
    <main>
      <h1>Portfolio Dashboard</h1>

      <pre>{JSON.stringify(summary, null, 2)}</pre>
    </main>
  );
}
