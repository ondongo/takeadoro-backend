import { randomUUID } from "crypto";
import setupPawapay from "../../../config/pawapay-config/setup";
import { Country } from "../../../enum/country";
import { Currency } from "../../../enum/currency";


export async function createPayout(
  amount: number,
  currency: Currency,
  correspondent: string,
  recipientPhone: string,
  country: Country,
  orderId: string,
  customerEmail: string
) {
  const apiUrl = `${setupPawapay.baseUrl}/payouts`;

  const payload = {
    payoutId: randomUUID,
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
    metadata: [
      { fieldName: "orderId", fieldValue: orderId },
      { fieldName: "customerId", fieldValue: customerEmail, isPII: true },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating payout:", error);
    return null;
  }
}