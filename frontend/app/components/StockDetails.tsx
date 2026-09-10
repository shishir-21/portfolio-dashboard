"use client";

import { useEffect } from "react";

type Stock = {
    name: string;
    symbol: string | null;
    purchasePrice: number | null;
    quantity: number | null;
    investment: number | null;
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
    status: string;
};

type StockDetailsProps = {
    stock: Stock | null;
    onClose: () => void;
};

export default function StockDetails({
    stock,
    onClose,
}: StockDetailsProps) {
    useEffect(() => {
        if (!stock) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [stock, onClose]);

    if (!stock) {
        return null;
    }

    const isPositive = (stock.gainLoss ?? 0) >= 0;

    return (
        <div
            className="stock-modal-overlay"
            onClick={onClose}
        >
            <div
                className="stock-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="stock-modal-header">
                    <div>
                        <h2>{stock.name}</h2>

                        <p>
                            {stock.symbol
                                ? `NSE/BSE: ${stock.symbol}`
                                : "Ticker unavailable"}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="stock-modal-close"
                        onClick={onClose}
                        aria-label="Close stock details"
                    >
                        ×
                    </button>
                </div>

                <div className="stock-modal-content">
                    <section className="stock-detail-section">
                        <h3>Performance</h3>

                        <div className="stock-details-grid">
                            <DetailItem
                                label="Purchase Price"
                                value={formatCurrency(stock.purchasePrice)}
                            />

                            <DetailItem
                                label="Quantity"
                                value={formatNumber(stock.quantity)}
                            />

                            <DetailItem
                                label="Investment"
                                value={formatCurrency(stock.investment)}
                            />

                            <DetailItem
                                label="Current Price"
                                value={formatCurrency(stock.cmp)}
                            />

                            <DetailItem
                                label="Current Value"
                                value={formatCurrency(stock.presentValue)}
                            />

                            <DetailItem
                                label="Gain / Loss"
                                value={formatGainLoss(stock.gainLoss)}
                                valueClass={
                                    isPositive
                                        ? "table-positive"
                                        : "table-negative"
                                }
                            />

                            <DetailItem
                                label="Return"
                                value={
                                    stock.gainLossPercent !== null
                                        ? `${stock.gainLossPercent >= 0 ? "+" : ""}${stock.gainLossPercent.toFixed(2)}%`
                                        : "-"
                                }
                                valueClass={
                                    isPositive
                                        ? "table-positive"
                                        : "table-negative"
                                }
                            />

                            {stock.salePrice !== null && (
                                <DetailItem
                                    label="Sale Price"
                                    value={formatCurrency(stock.salePrice)}
                                />
                            )}

                            <DetailItem
                                label="Status"
                                value={
                                    stock.status === "sold"
                                        ? "Sold"
                                        : "Active"
                                }
                                valueClass={
                                    stock.status === "sold"
                                        ? "table-negative"
                                        : "table-positive"
                                }
                            />
                        </div>
                    </section>

                    <section className="stock-detail-section">
                        <h3>Fundamentals</h3>

                        <div className="stock-details-grid">
                            <DetailItem
                                label="Market Cap"
                                value={formatNumber(stock.marketCap)}
                            />

                            <DetailItem
                                label="P/E"
                                value={formatNumber(stock.pe)}
                            />

                            <DetailItem
                                label="Latest Earnings (EPS)"
                                value={formatNumber(stock.latestEarnings)}
                            />

                            <DetailItem
                                label="Revenue TTM"
                                value={formatNumber(stock.revenueTTM)}
                            />

                            <DetailItem
                                label="EBITDA TTM"
                                value={formatNumber(stock.ebitdaTTM)}
                            />

                            <DetailItem
                                label="EBITDA %"
                                value={formatPercent(stock.ebitdaPercent)}
                            />

                            <DetailItem
                                label="PAT"
                                value={formatNumber(stock.pat)}
                            />

                            <DetailItem
                                label="PAT %"
                                value={formatPercent(stock.patPercent)}
                            />

                            <DetailItem
                                label="CFO March 24"
                                value={formatNumber(stock.cfoMarch24)}
                            />

                            <DetailItem
                                label="CFO 5 Years"
                                value={formatNumber(stock.cfo5Years)}
                            />

                            <DetailItem
                                label="Free Cash Flow 5 Years"
                                value={formatNumber(stock.freeCashFlow5Years)}
                            />

                            <DetailItem
                                label="Debt to Equity"
                                value={formatNumber(stock.debtToEquity)}
                            />

                            <DetailItem
                                label="Book Value"
                                value={formatNumber(stock.bookValue)}
                            />

                            <DetailItem
                                label="Revenue Growth"
                                value={formatPercent(stock.revenueGrowth)}
                            />

                            <DetailItem
                                label="EBITDA Growth"
                                value={formatPercent(stock.ebitdaGrowth)}
                            />

                            <DetailItem
                                label="Profit Growth"
                                value={formatPercent(stock.profitGrowth)}
                            />

                            <DetailItem
                                label="Market Cap Growth"
                                value={formatPercent(stock.marketCapGrowth)}
                            />

                            <DetailItem
                                label="Price to Sales"
                                value={formatNumber(stock.priceToSales)}
                            />

                            <DetailItem
                                label="CFO to EBITDA"
                                value={formatNumber(stock.cfoToEbitda)}
                            />

                            <DetailItem
                                label="CFO to PAT"
                                value={formatNumber(stock.cfoToPat)}
                            />

                            <DetailItem
                                label="Price to Book"
                                value={formatNumber(stock.priceToBook)}
                            />

                            <DetailItem
                                label="Stage 2"
                                value={stock.stage2 ?? "-"}
                            />

                            <DetailItem
                                label="Abhishek"
                                value={stock.abhishek ?? "-"}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function DetailItem({
    label,
    value,
    valueClass = "",
}: {
    label: string;
    value: string;
    valueClass?: string;
}) {
    return (
        <div className="stock-detail-item">
            <span>{label}</span>
            <strong className={valueClass}>{value}</strong>
        </div>
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

function formatNumber(value: number | null) {
    if (value === null) {
        return "-";
    }

    return value.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    });
}

function formatGainLoss(value: number | null) {
    if (value === null) {
        return "-";
    }

    return `${value >= 0 ? "+" : "-"}₹${Math.abs(value).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2,
        }
    )}`;
}

function formatPercent(value: number | null) {
    if (value === null) {
        return "-";
    }

    return `${value >= 0 ? "+" : ""}${(value * 100).toFixed(2)}%`;
}
