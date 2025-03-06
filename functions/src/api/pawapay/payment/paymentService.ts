import setupPawapay from "../../../config/pawapay-config/setup";
import { Country } from "../../../enum/country";

export async function createPayment(
  depositId: string,
  amount: number,
  msisdn: string,
  country: Country,
  returnUrl: string,
  reason: string,
  destinationCountry: string
) {
  const apiUrl = `${setupPawapay.baseUrl}/v1/widget/sessions`;

  const payload = {
    depositId,
    amount: amount.toString(),
    msisdn,
    country,
    returnUrl,
    language: "FR",
    reason,
    metadata: [
      { fieldName: "destinationCountry", fieldValue: destinationCountry },
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
    console.error("Error creating payment:", error);
    return null;
  }
}
