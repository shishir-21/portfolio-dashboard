# Portfolio Dashboard

A full-stack portfolio dashboard built using Next.js, TypeScript, Tailwind CSS, Node.js, and Express.

The application displays portfolio holdings along with current market prices, portfolio value, gain/loss, sector-wise performance, and stock fundamentals.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express.js
- TypeScript
- Axios
- ExcelJS

### Data Sources

- Yahoo Finance - Current Market Price (CMP)
- Google Finance - P/E Ratio and Latest Earnings (EPS)
- Excel - Portfolio holdings and investment data

---

## Project Structure

text
portfolio-dashboard/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── server.ts
│   │
│   ├── data/
│   │   ├── portfolio.xlsx
│   │   └── ...
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   ├── HoldingsTable.tsx
│   │   │   ├── StockDetails.tsx
│   │   │   └── ...
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── package.json
│   └── tsconfig.json
│
└── README.md



## How the Data Works


                    Excel Portfolio Data
                            |
                            v
                         Backend
                            |
              +-------------+-------------+
              |                           |
              v                           v
        Yahoo Finance              Google Finance
              |                           |
             CMP                    P/E Ratio + EPS
              |                           |
              +-------------+-------------+
                            |
                            v
                   Portfolio Calculations
                            |
                            v
                         REST API
                            |
                            v
                    Next.js Frontend
                            |
                            v
                        Dashboard


## Complete Backend Data Flow

GET /api/portfolio
        |
        v
Portfolio Controller
        |
        v
Live Portfolio Service
        |
        +----------------------+----------------------+
        |                      |                      |
        v                      v                      v
 Excel Service          Yahoo Service       Google Finance Service
        |                      |                      |
        v                      v                      v
 Excel Data             Yahoo Finance        Google Finance
                               |                      |
                              CMP                  P/E + EPS
                               |                      |
        +----------------------+----------------------+
        |
        v
Live Portfolio Service
        |
        v
Present Value / Gain-Loss Calculations
        |
        v
REST API Response
        |
        v
Next.js Frontend
        |
        v
Dashboard
             