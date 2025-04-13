import { v4 as uuidv4 } from "uuid";
import setupPawapay from "../../../config/pawapay-config/setup";
import { checkBalanceByCountry } from "../wallet-balances/checkBalanceService";

export async function createPayout(
  depositedAmount: string,
  currency: string,
  destinationCorrespondent: string,
  destinationPhone: string,
  destinationCountry: string,
  country: string,
  correspondent: string,
  payerPhone: string
) {
  const balance = await checkBalanceByCountry(destinationCountry);

  if (balance === null) {
    return { success: false, message: "Impossible de vérifier le solde." };
  }

  if (Number(depositedAmount) > balance) {
    return {
      success: false,
      message: "Solde insuffisant pour effectuer ce payout.",
    };
  }

  const apiUrl = `${setupPawapay.baseUrl}/payouts`;

  const payload = {
    payoutId: uuidv4(),
    amount: depositedAmount.toString(),
    currency,
    destinationCorrespondent,
    recipient: {
      address: { value: destinationPhone },
      type: "MSISDN",
    },
    customerTimestamp: new Date().toISOString(),
    statementDescription: "Payout",
    destinationCountry,
    metadata: [
      { fieldName: "countryOrigin", fieldValue: country },
      { fieldName: "correspondentOrigin", fieldValue: correspondent },
      { fieldName: "phoneOrigin", fieldValue: payerPhone },
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
    console.log(">>>>>>>>>>>>>>Data Payout", data);
    console.log(">>>>>>>>>>>>, Response Payout", response);
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
