import express from "express";
import { readPortfolioExcel } from "./services/excel.service";

const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Portfolio Dashboard API is running",
  });
});

app.get("/api/portfolio/test", (_req, res) => {
  try {
    const data = readPortfolioExcel();

    res.json({
      success: true,
      count: data.length,
      data: data.slice(0, 5),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to read portfolio Excel file",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
