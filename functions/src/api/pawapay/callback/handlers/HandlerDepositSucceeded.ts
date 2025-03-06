import { createPayout } from "../../payouts/payoutService";

export async function HandlerDepositSucceeded(data: any) {
  try {
    const { depositId, amount, currency, metadata } = data.body;

    console.log("Received deposit callback:", data.body);

    console.log(`Deposit ${depositId} confirmed. Initiating payout...`);

    const orderId = metadata.find(
      (m: any) => m.fieldName === "orderId"
    )?.fieldValue;
    const customerEmail = metadata.find(
      (m: any) => m.fieldName === "customerId"
    )?.fieldValue;
    const destinationCountry = metadata.find(
      (m: any) => m.fieldName === "destinationCountry"
    )?.fieldValue;

    if (!destinationCountry) {
      console.error("No destination country found in metadata!");

      return {
        status: 400,
        message: "Missing destination country",
      };
    }

    const payoutResponse = await createPayout(
      amount,
      currency,
      getCorrespondent(destinationCountry),
      getRecipientPhone(destinationCountry),
      destinationCountry,
      orderId,
      customerEmail

    );

    if (payoutResponse.success) {
      console.log("Payout initiated successfully:", payoutResponse.data);
      return {
        status: 200,
        message: "Payout triggered successfully",
      };
    } else {
      console.error("Payout initiation failed:", payoutResponse.error);

      return {
        status: 500,
        message: "Payout initiation failed",
      };
    }
  } catch (error: any) {
    console.error("Error handling deposit callback:", error);

    return {
      status: 500,
      message: error.toString(),
    };
  }
}
