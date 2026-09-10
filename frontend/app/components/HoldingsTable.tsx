"use client";

import { useMemo, useState } from "react";
import StockDetails from "./StockDetails";

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

export default function HoldingsTable({
    portfolio,
}: {
    portfolio: PortfolioStock[];
}) {
    const [view, setView] = useState<"holdings" | "sold">("holdings");
    const [selectedSector, setSelectedSector] = useState("All");
    const [selectedStock, setSelectedStock] = useState<PortfolioStock | null>(null);

    const currentPortfolio = useMemo(() => {
        return portfolio.filter((stock) =>
            view === "holdings"
                ? stock.status === "active"
                : stock.status === "sold"
        );
    }, [portfolio, view]);

    const sectors = useMemo(() => {
        return Array.from(
            new Set(currentPortfolio.map((stock) => stock.sector))
        );
    }, [currentPortfolio]);

    const filteredPortfolio = useMemo(() => {
        if (selectedSector === "All") {
            return currentPortfolio;
        }

        return currentPortfolio.filter(
            (stock) => stock.sector === selectedSector
        );
    }, [currentPortfolio, selectedSector]);

    const overallSummary = calculateSummary(filteredPortfolio);

    const handleViewChange = (newView: "holdings" | "sold") => {
        setView(newView);
        setSelectedSector("All");
    };

    return (
        <section className="holdings-section">
            <div className="section-header">
                <div>
                    <p className="eyebrow">PORTFOLIO</p>
                    <h2>
                        {view === "holdings" ? "Holdings" : "Sold Investments"}
                    </h2>
                </div>

                <p className="section-description">
                    {filteredPortfolio.length}{" "}
                    {view === "holdings" ? "holdings" : "sold investments"}
                </p>
            </div>

            {/* Holdings / Sold */}
            <div className="holdings-toggle">
                <button
                    className={
                        view === "holdings"
                            ? "toggle-button active"
                            : "toggle-button"
                    }
                    onClick={() => handleViewChange("holdings")}
                >
                    Holdings
                </button>

                <button
                    className={
                        view === "sold"
                            ? "toggle-button active"
                            : "toggle-button"
                    }
                    onClick={() => handleViewChange("sold")}
                >
                    Sold
                </button>
            </div>

            {/* Sector filters */}
            <div className="sector-filters">
                <button
                    className={
                        selectedSector === "All"
                            ? "sector-filter active"
                            : "sector-filter"
                    }
                    onClick={() => setSelectedSector("All")}
                >
                    All ({currentPortfolio.length})
                </button>

                {sectors.map((sector) => {
                    const count = currentPortfolio.filter(
                        (stock) => stock.sector === sector
                    ).length;

                    return (
                        <button
                            key={sector}
                            className={
                                selectedSector === sector
                                    ? "sector-filter active"
                                    : "sector-filter"
                            }
                            onClick={() => setSelectedSector(sector)}
                        >
                            {formatSectorName(sector)} ({count})
                        </button>
                    );
                })}
            </div>

            {/* ALL VIEW */}
            {selectedSector === "All" ? (
                <div className="all-holdings-container">
                    <SummaryBanner
                        title={
                            view === "holdings"
                                ? "All Holdings"
                                : "All Sold Investments"
                        }
                        count={filteredPortfolio.length}
                        summary={overallSummary}
                    />

                    <HoldingsDataTable
                        stocks={filteredPortfolio}
                        onStockClick={setSelectedStock}
                    />
                </div>
            ) : (
                /* SECTOR VIEW */
                <SectorGroup
                    sector={selectedSector}
                    stocks={filteredPortfolio}
                    onStockClick={setSelectedStock}
                />
            )}

            <StockDetails
                stock={selectedStock}
                onClose={() => setSelectedStock(null)}
            />
        </section>
    );
}

function SummaryBanner({
    title,
    count,
    summary,
}: {
    title: string;
    count: number;
    summary: {
        investment: number;
        presentValue: number;
        gainLoss: number;
    };
}) {
    const returnPercent =
        summary.investment > 0
            ? (summary.gainLoss / summary.investment) * 100
            : 0;

    const isPositive = summary.gainLoss >= 0;

    return (
        <div className="summary-banner">
            <div className="summary-banner-title">
                <div>
                    <h3>{title}</h3>
                    <p>
                        {count} {count === 1 ? "Holding" : "Holdings"}
                    </p>
                </div>
            </div>

            <div className="summary-banner-metrics">
                <div>
                    <span>Investment</span>
                    <strong>
                        {formatCurrency(summary.investment)}
                    </strong>
                </div>

                <div>
                    <span>Current Value</span>
                    <strong>
                        {formatCurrency(summary.presentValue)}
                    </strong>
                </div>

                <div className={isPositive ? "table-positive" : "table-negative"}>
                    <span>P&L</span>
                    <strong>
                        {isPositive ? "+" : "-"}
                        {formatCurrency(Math.abs(summary.gainLoss))}
                    </strong>
                </div>

                <div className={isPositive ? "table-positive" : "table-negative"}>
                    <span>Return</span>
                    <strong>
                        {isPositive ? "+" : ""}
                        {returnPercent.toFixed(2)}%
                    </strong>
                </div>
            </div>
        </div>
    );
}

function SectorGroup({
    sector,
    stocks,
    onStockClick,
}: {
    sector: string;
    stocks: PortfolioStock[];
    onStockClick: (stock: PortfolioStock) => void;
}) {
    const [isOpen, setIsOpen] = useState(true);

    const summary = calculateSummary(stocks);

    const returnPercent =
        summary.investment > 0
            ? (summary.gainLoss / summary.investment) * 100
            : 0;

    const isPositive = summary.gainLoss >= 0;

    return (
        <div className="sector-group">
            <button
                className="sector-group-header"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="sector-group-title">
                    <span className="accordion-icon">
                        {isOpen ? "▼" : "▶"}
                    </span>

                    <div>
                        <h3>{sector}</h3>
                        <p>
                            {stocks.length}{" "}
                            {stocks.length === 1 ? "Holding" : "Holdings"}
                        </p>
                    </div>
                </div>

                <div className="sector-summary">
                    <div className="sector-summary-item">
                        <span>Investment</span>
                        <strong>
                            {formatCurrency(summary.investment)}
                        </strong>
                    </div>

                    <div className="sector-summary-item">
                        <span>Current Value</span>
                        <strong>
                            {formatCurrency(summary.presentValue)}
                        </strong>
                    </div>

                    <div
                        className={`sector-summary-item ${isPositive ? "table-positive" : "table-negative"
                            }`}
                    >
                        <span>P&L</span>
                        <strong>
                            {formatGainLoss(summary.gainLoss)}
                        </strong>
                    </div>

                    <div
                        className={`sector-summary-item ${isPositive ? "table-positive" : "table-negative"
                            }`}
                    >
                        <span>Return</span>
                        <strong>
                            {isPositive ? "+" : ""}
                            {returnPercent.toFixed(2)}%
                        </strong>
                    </div>
                </div>
            </button>

            {isOpen && (
                <HoldingsDataTable
                    stocks={stocks}
                    onStockClick={onStockClick}
                />
            )}
        </div>
    );
}

function HoldingsDataTable({
    stocks,
    onStockClick,
}: {
    stocks: PortfolioStock[];
    onStockClick: (stock: PortfolioStock) => void;
}) {
    return (
        <div className="sector-table-wrapper">
            <table className="holdings-table">
                <thead>
                    <tr>
                        <th>Stock</th>
                        <th>Investment</th>
                        <th>Current Value</th>
                        <th>Gain / Loss</th>
                        <th>Return</th>
                    </tr>
                </thead>

                <tbody>
                    {stocks.map((stock) => (
                        <tr key={`${stock.name}-${stock.no}`}>
                            <td>
                                <button
                                    type="button"
                                    className="stock-name-button"
                                    onClick={() => onStockClick(stock)}
                                >
                                    <div className="stock-name">
                                        {stock.name}
                                    </div>

                                    <div className="stock-symbol">
                                        {stock.symbol
                                            ? `NSE/BSE: ${stock.symbol}`
                                            : "Ticker unavailable"}
                                    </div>
                                </button>
                            </td>

                            <td>
                                {formatCurrency(stock.investment)}
                            </td>

                            <td>
                                {formatCurrency(stock.presentValue)}
                            </td>

                            <td
                                className={
                                    stock.gainLoss !== null &&
                                        stock.gainLoss >= 0
                                        ? "table-positive"
                                        : "table-negative"
                                }
                            >
                                {formatGainLoss(stock.gainLoss)}
                            </td>

                            <td
                                className={
                                    stock.gainLossPercent !== null &&
                                        stock.gainLossPercent >= 0
                                        ? "table-positive"
                                        : "table-negative"
                                }
                            >
                                {stock.gainLossPercent !== null
                                    ? `${stock.gainLossPercent >= 0 ? "+" : ""
                                    }${(
                                        stock.gainLossPercent * 100
                                    ).toFixed(2)}%`
                                    : "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function calculateSummary(stocks: PortfolioStock[]) {
    return stocks.reduce(
        (summary, stock) => {
            summary.investment += stock.investment ?? 0;
            summary.presentValue += stock.presentValue ?? 0;
            summary.gainLoss += stock.gainLoss ?? 0;

            return summary;
        },
        {
            investment: 0,
            presentValue: 0,
            gainLoss: 0,
        }
    );
}

function formatCurrency(value: number | null) {
    if (value === null) {
        return "-";
    }

    return `₹${value.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    })}`;
}

function formatGainLoss(value: number | null) {
    if (value === null) {
        return "-";
    }

    return `${value >= 0 ? "+" : "-"}₹${Math.abs(
        value
    ).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    })}`;
}

function formatSectorName(sector: string) {
    return sector
        .replace(" Sector", "")
        .replace("Pipe", "Pipes");
}
