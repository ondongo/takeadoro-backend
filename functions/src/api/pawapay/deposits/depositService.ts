import setupPawapay from "../../../config/pawapay-config/setup";

export async function createDeposit(
  amount: number,
  currency: string,
  payerPhone: string,
  payerCountry: string,
  destinationCountry: string,
  orderId: string,
  customerId: string
) {
  const apiUrl = `${setupPawapay.baseUrl}/deposits`;

  const payload = {
    amount: amount,
    currency: currency,
    correspondent: getCorrespondent(payerCountry),
    payer: {
      address: { value: payerPhone },
      type: "MSISDN",
    },
    country: payerCountry,
    statementDescription: "Transfert international",
    metadata: [
      { fieldName: "orderId", fieldValue: orderId },
      { fieldName: "customerId", fieldValue: customerId, isPII: true },
      { fieldName: "destinationCountry", fieldValue: destinationCountry },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.status === 200) {
      console.log("Deposit initiated successfully:", data);
      return { success: true, data };
    } else {
      console.error("Error initiating deposit:", data);
      return { success: false, error: data };
    }
  } catch (error: any) {
    if (error instanceof Error) {
      console.error("Exception during deposit:", error.message);
      return { success: false, error: error.message };
    } else {
      console.error("Exception during deposit:", error);
      return { success: false, error: String(error) };
    }
  }
}

export async function checkDepositStatus(depositId: any) {
  const apiUrl = `${setupPawapay.baseUrl}/deposits/${depositId}`;

  try {
    const response = await fetch(apiUrl);

    const data = await response.json();
    if (response.status === 200) {
      console.log("Deposit status checked successfully:", data);
      return { success: true, data };
    } else {
      console.error("Error checking deposit status:", data);
      return { success: false, error: data };
    }
  } catch (error: any) {
    if (error instanceof Error) {
      console.error("Exception during deposit status check:", error.message);
      return { success: false, error: error.message };
    } else {
      console.error("Exception during deposit status check:", error);
      return { success: false, error: String(error) };
    }
  }
}
