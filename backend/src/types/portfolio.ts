export interface PortfolioStock {
  no: number;
  name: string;
  sector: string;

  purchasePrice: number | null;
  quantity: number | null;
  investment: number | null;
  portfolioPercent: number | null;

  symbol: string | null;
  exchange: "NSE" | "BSE" | null;
  
  cmp: number | null;
  presentValue: number | null;

  gainLoss: number | null;
  gainLossPercent: number | null;

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

  status: "active" | "sold";
}
