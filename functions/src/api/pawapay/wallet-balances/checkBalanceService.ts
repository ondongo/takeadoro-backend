import setupPawapay from "../../../config/pawapay-config/setup";

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
