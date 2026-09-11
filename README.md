# Portfolio Dashboard

A full-stack portfolio dashboard built with Next.js, React, TypeScript, Tailwind CSS, Node.js, and Express.

The application reads portfolio holdings and investment information from an Excel file and combines it with live market data from Yahoo Finance and stock fundamentals from Google Finance.

The dashboard shows current market price, present value, gain/loss, portfolio allocation, sector performance, top gainers, top losers, and additional stock details.

## Live Application

Frontend:

https://portfolio-dashboard-o3ohmluz7-shishir-21s-projects.vercel.app

Backend API:

https://portfolio-dashboard-backend-lv03.onrender.com

The frontend is deployed on Vercel and the backend is deployed on Render.

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- JavaScript/TypeScript Fetch API

### Why Next.js?

Next.js is used to build the frontend dashboard and manage the React application structure.

The main dashboard is implemented inside the `app` directory.

The frontend is responsible for displaying the portfolio data received from the backend and refreshing the dashboard periodically.

---

## Backend

- Node.js
- Express.js
- TypeScript
- Axios
- ExcelJS

### Why Node.js and Express?

Node.js is used as the backend runtime and Express is used to create the REST API.

The backend handles:

- Reading portfolio data
- Fetching external market data
- Combining data from different sources
- Portfolio calculations
- Error handling
- API responses
- Caching

---

## Axios

Axios is used in the backend for making HTTP requests to external services where required.

It acts as the HTTP client between the backend and external services.

Instead of making these external requests directly from the frontend, the backend handles them and sends the processed data to the frontend.

This keeps external data fetching inside the backend and avoids exposing external service details to the client.

---

## ExcelJS

ExcelJS is used to read the portfolio Excel file on the backend.

The Excel file contains information such as:

- Stock name
- Purchase price
- Quantity
- Investment amount
- Portfolio percentage
- Stock symbol
- Sector
- Other portfolio and financial information

The backend reads this data and converts it into a structured format that can be used by the rest of the application.

---

## Yahoo Finance

Yahoo Finance is used to get the Current Market Price (CMP).

The backend sends a request for the required stock symbol and reads the current market price from the response.

For NSE stocks, Yahoo Finance symbols use the `.NS` suffix.

For BSE stocks, Yahoo Finance symbols use the `.BO` suffix.

There is also a symbol mapping for stocks where the symbol used in the portfolio differs from the Yahoo Finance symbol.

For example:

```text
LTIM -> LTM
