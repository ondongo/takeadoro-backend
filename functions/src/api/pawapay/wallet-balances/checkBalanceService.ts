import setupPawapay from "../../../config/pawapay-config/setup";
import { Country } from "../../../enum/country";

export async function checkBalance() {
  const apiUrl = `${setupPawapay.baseUrl}wallet-balances`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking balance:", error);
    return null;
  }
}


export async function checkBalanceByCountry(country: Country) {
    const apiUrl = `${setupPawapay.baseUrl}/wallet-balances/${country}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.balances?.[0]?.balance ? parseFloat(data.balances[0].balance) : 0;
    } catch (error) {
      console.error("Error checking balance:", error);
      return null;
    }
  }
  