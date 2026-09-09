import XLSX from "xlsx";
import path from "path";

const excelPath = path.join(
  process.cwd(),
  "data",
  "F9001561_ADDBA737E8_B72562937A.xlsx"
);

export function readPortfolioExcel() {
  const workbook = XLSX.readFile(excelPath);

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(worksheet, {
    defval: null,
  });

  return data;
}
