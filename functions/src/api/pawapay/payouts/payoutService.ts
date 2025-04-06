import { v4 as uuidv4 } from "uuid";
import setupPawapay from "../../../config/pawapay-config/setup";
import { Country } from "../../../enum/country";
import { Currency } from "../../../enum/currency";
import { checkBalanceByCountry } from "../wallet-balances/checkBalanceService";
import admin from "../../../config/firebaseConfig";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export async function createPayout(
  amount: number,
  currency: Currency,
  correspondent: string,
  recipientPhone: string,
  country: Country,
  countryOrigin: string
) {
  const balance = await checkBalanceByCountry(country);

  if (balance === null) {
    return { success: false, message: "Impossible de vérifier le solde." };
  }

  if (amount > balance) {
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
    statementDescription: "Payout transaction",
    country,
    metadata: [{ fieldName: "CountryOrigin", fieldValue: countryOrigin }],
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
