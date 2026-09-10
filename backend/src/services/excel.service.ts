import XLSX from "xlsx";
import path from "path";
import { PortfolioStock } from "../types/portfolio";


const stockExchangeMap: Record<
  string,
  { symbol: string; exchange: "NSE" | "BSE" }
> = {
  "ICICI Bank": { symbol: "ICICIBANK", exchange: "NSE" },
  "Bajaj Housing": { symbol: "BAJAJHFL", exchange: "NSE" },
  "Savani Financials": { symbol: "511577", exchange: "BSE" },

  "KPIT Tech": { symbol: "KPITTECH", exchange: "NSE" },
  "Tata Tech": { symbol: "TATATECH", exchange: "NSE" },
  "BLS E-Services": { symbol: "BLSE", exchange: "NSE" },
  "Tanla": { symbol: "TANLA", exchange: "NSE" },

  "Tata Consumer": { symbol: "TATACONSUM", exchange: "NSE" },
  "Pidilite": { symbol: "PIDILITIND", exchange: "NSE" },

  "Tata Power": { symbol: "TATAPOWER", exchange: "NSE" },
  "KPI Green": { symbol: "KPIGREEN", exchange: "NSE" },
  "Suzlon": { symbol: "SUZLON", exchange: "NSE" },
  "Gensol": { symbol: "GENSOL", exchange: "NSE" },

  "Hariom Pipes": { symbol: "HARIOMPIPE", exchange: "NSE" },
  "Polycab": { symbol: "POLYCAB", exchange: "NSE" },

  "Clean Science": { symbol: "CLEAN", exchange: "NSE" },
  "Deepak Nitrite": { symbol: "DEEPAKNTR", exchange: "NSE" },
  "Fine Organic": { symbol: "FINEORG", exchange: "NSE" },
  "Gravita": { symbol: "GRAVITA", exchange: "NSE" },
  "SBI Life": { symbol: "SBILIFE", exchange: "NSE" },

  "Infy": { symbol: "INFY", exchange: "NSE" },
  "Happeist Mind": { symbol: "HAPPSTMNDS", exchange: "NSE" },
  "Easemytrip": { symbol: "EASEMYTRIP", exchange: "NSE" },
};

const excelPath = path.join(
  process.cwd(),
  "data",
  "F9001561_ADDBA737E8_B72562937A.xlsx"
);

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return null;
}

function toStringValue(value: unknown): string | null {
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }

  return null;
}

export function readPortfolioExcel(): PortfolioStock[] {
  const workbook = XLSX.readFile(excelPath);

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("No sheet found in Excel");
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) throw new Error("Worksheet not found");

  const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: null,
  });

  const stocks: PortfolioStock[] = [];

  let currentSector = "Others";

  // Row 0 = merged heading row
  // Row 1 = actual column headers
  // Data starts from row 2
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    const no = toNumber(row[0]);
    const particulars = toStringValue(row[1]);

    // Skip completely empty rows
    if (row.every((value) => value === null)) {
      continue;
    }

    // Sector rows have text in Particulars
    if (no === null && particulars) {
      currentSector = particulars;
      continue;
    }

    // Ignore rows that are not stock records
    if (no === null || !particulars) {
      continue;
    }

    const salePrice = toNumber(row[33]);

    const excelSymbol = toStringValue(row[6]);
    const mappedStock = stockExchangeMap[particulars];

    const symbol = excelSymbol ?? mappedStock?.symbol ?? null;

    const exchange =
      excelSymbol !== null
        ? "NSE"
        : mappedStock?.exchange ?? null;

    stocks.push({
      no,
      name: particulars,
      sector: currentSector,

      purchasePrice: toNumber(row[2]),
      quantity: toNumber(row[3]),
      investment: toNumber(row[4]),
      portfolioPercent: toNumber(row[5]),

      symbol,
      exchange,
      
      cmp: toNumber(row[7]),
      presentValue: toNumber(row[8]),

      gainLoss: toNumber(row[9]),
      gainLossPercent: toNumber(row[10]),

      marketCap: toNumber(row[11]),
      pe: toNumber(row[12]),
      latestEarnings: toNumber(row[13]),

      revenueTTM: toNumber(row[14]),
      ebitdaTTM: toNumber(row[15]),
      ebitdaPercent: toNumber(row[16]),

      pat: toNumber(row[17]),
      patPercent: toNumber(row[18]),

      cfoMarch24: toNumber(row[19]),
      cfo5Years: toNumber(row[20]),
      freeCashFlow5Years: toNumber(row[21]),

      debtToEquity: toNumber(row[22]),
      bookValue: toNumber(row[23]),

      revenueGrowth: toNumber(row[24]),
      ebitdaGrowth: toNumber(row[25]),
      profitGrowth: toNumber(row[26]),
      marketCapGrowth: toNumber(row[27]),

      priceToSales: toNumber(row[28]),
      cfoToEbitda: toNumber(row[29]),
      cfoToPat: toNumber(row[30]),
      priceToBook: toNumber(row[31]),

      stage2: toStringValue(row[32]),
      salePrice,
      abhishek: toStringValue(row[34]),

      status: salePrice !== null ? "sold" : "active",
    });
  }

  return stocks;
}
