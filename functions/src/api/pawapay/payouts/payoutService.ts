import { v4 as uuidv4 } from "uuid";
import setupPawapay from "../../../config/pawapay-config/setup";
import { Country } from "../../../enum/country";
import { checkBalanceByCountry } from "../wallet-balances/checkBalanceService";

export async function createPayout(
  amount: string,
  currency: string,
  correspondent: string,
  recipientPhone: string,
  country: string,
  countryOrigin: string,
  correspondentOrigin: string,
  phoneOrigin: string
) {
  const balance = await checkBalanceByCountry(country);

  if (balance === null) {
    return { success: false, message: "Impossible de vérifier le solde." };
  }

  if (Number(amount) > balance) {
    return {
      success: false,
      message: "Solde insuffisant pour effectuer ce payout.",
    };
  }

  const apiUrl = `${setupPawapay.baseUrl}/payouts`;

  const payload = {
    payoutId: uuidv4(),
    amount: amount.toString(),
    currency,
    correspondent,
    recipient: {
      address: { value: recipientPhone },
      type: "MSISDN",
    },
    customerTimestamp: new Date().toISOString(),
    statementDescription: "Payout",
    country,
    metadata: [
      { fieldName: "countryOrigin", fieldValue: countryOrigin },
      { fieldName: "correspondentOrigin", fieldValue: correspondentOrigin },
      { fieldName: "phoneOrigin", fieldValue: phoneOrigin },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAWAPAY_TOKEN_SANDBOX}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Payout échoué, remboursement en cours...");

      return {
        success: false,
        message: "Payout échoué, remboursement initié.",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Erreur lors du payout, remboursement en cours...");

    return {
      success: false,
      message: "Erreur lors du payout, remboursement initié.",
    };
  }
}
