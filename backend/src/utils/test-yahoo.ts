import { fetchYahooCMP } from "../services/yahoo.service";

async function test() {
  const tests = [
    {
      name: "HDFC Bank",
      symbol: "HDFCBANK",
      exchange: "NSE" as const,
    },
    {
      name: "LTI Mindtree",
      symbol: "LTIM",
      exchange: "NSE" as const,
    },
    {
      name: "Bajaj Finance",
      symbol: "BAJFINANCE",
      exchange: "NSE" as const,
    },
    {
      name: "Tata Power",
      symbol: "TATAPOWER",
      exchange: "NSE" as const,
    },
    {
      name: "Savani Financials",
      symbol: "511577",
      exchange: "BSE" as const,
    },
  ];

  for (const stock of tests) {
    const cmp = await fetchYahooCMP(
      stock.symbol,
      stock.exchange
    );

    console.log(
      `${stock.name} (${stock.symbol}.${stock.exchange}):`,
      cmp
    );
  }
}

test();
