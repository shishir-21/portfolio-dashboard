import { fetchGoogleFinanceData } from "../services/google-finance.service";

async function test() {
    const result = await fetchGoogleFinanceData(
        "HDFCBANK",
        "NSE"
    );

    console.log("Google Finance result:");
    console.log(result);
}

test();
