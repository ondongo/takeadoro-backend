import { createPayout } from "../../payouts/payoutService";
import admin from "../../../../config/firebaseConfig";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export async function HandlerDepositSucceeded(data: any) {
  try {
    const {
      depositId,
      amount,
      currency,
      countryOrigin,
      metadata,
      customerPhone,
    } = data.body;

    console.log("Received deposit callback:", data.body);
    console.log(`Deposit ${depositId} confirmed. Initiating payout...`);

    const destinationCountry = metadata.find(
      (m: any) => m.fieldName === "destinationCountry"
    )?.fieldValue;

    if (!destinationCountry) {
      console.error("No destination country found in metadata!");
      return { status: 400, message: "Missing destination country" };
    }

    // Enregistrer la transaction réussie dans Firestore
    const paymentRef = await db.collection("transactions").add({
      depositId,
      amount,
      currency,
      countryOrigin,
      destinationCountry,
      status: "succeeded",
      createdAt: new Date(),
      type: "deposit",
    });

    console.log("Transaction enregistrée avec succès :", paymentRef.id);

    // Lancer le paiement
    const payoutResponse = await createPayout(
      amount,
      currency,
      getCorrespondent(destinationCountry),
      getRecipientPhone(destinationCountry),
      destinationCountry,
      countryOrigin,
      depositId,
      customerPhone
    );

    if (payoutResponse.success) {
      console.log("Payout initiated successfully:", payoutResponse.data);
      return { status: 200, message: "Payout triggered successfully" };
    } else {
      console.error("Payout initiation failed:", payoutResponse.message);
      return {
        status: 500,
        message: "Payout initiation failed",
        error: payoutResponse.message, 
      };
    }
  } catch (error: any) {
    console.error("Error handling deposit success:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error.toString(),
    };
  }
}
