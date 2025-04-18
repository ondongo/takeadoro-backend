import { createPayout } from "../../payouts/payoutService";
import admin from "../../../../config/firebaseConfig";
import { createRefund } from "../../refunds/refundService";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export async function HandlerDepositSucceeded(data: any) {
  console.log("Received deposit callback:", data);
  try {
    const {
      depositId,
      depositedAmount,
      currency,
      country,
      metadata,
      correspondent,
      payer,
    } = data;

    console.log(`Deposit ${depositId} confirmed. Initiating payout...`);

    const payerPhone = payer.address.value;
    // Extraction du pays de destination depuis les métadonnées

    const destinationCountry = metadata.destinationCountry;
    if (!destinationCountry) {
      console.error("No destination country found in metadata!");
      return { status: 400, message: "Missing destination country" };
    }

    const destinationPhone = metadata.destinationPhone;
    if (!destinationPhone) {
      console.error("No destination phone found in metadata!");
      return { status: 400, message: "Missing destination phone" };
    }

    const destinationCorrespondent = metadata.destinationCorrespondent;
    if (!destinationCorrespondent) {
      console.error("No destination correspondent found in metadata!");
      return { status: 400, message: "Missing destination correspondent " };
    }

    // Tentative d'initiation du payout
    const payoutResponse = await createPayout(
      depositedAmount,
      currency === "XOF" ? "XAF" : "XOF",
      destinationCorrespondent,
      destinationPhone,
      destinationCountry,
      country,
      correspondent,
      payerPhone
    );
    const amountPayout = Math.floor(
      (Number(depositedAmount) - 100) / (1 + 0.09)
    ).toFixed(0);

    if (payoutResponse.success && payoutResponse.data.status === "ACCEPTED") {
      console.log("Payout initié avec succès:", payoutResponse.data);

      // Enregistrer le payout en Firestore
      const payoutRef = await db.collection("Payouts").add({
        payoutId: payoutResponse.data.payoutId,
        amountPayout,
        recipientCurrency: currency === "XOF" ? "XAF" : "XOF",
        recipientPhone: destinationPhone,
        recipientCountry: destinationCountry,
        recipientCorrespodent: destinationCorrespondent,
        status: "succeeded",
        createdAt: new Date(),
        depositId,
        currencyOrigin: currency,
        phoneOrigin: payerPhone,
        countryOrigin: country,
        correspondentOrigin: correspondent,
      });

      console.log("Payout enregistré avec succès :", payoutRef.id);
      return { status: 200, message: "Payout initiated successfully" };
    } else {
      //console.error("Échec de l'initiation du payout:", payoutResponse.message);
      await db.collection("Payouts").add({
        payoutId: payoutResponse.data.payoutId,
        amountPayout,
        recipientCurrency: currency === "XOF" ? "XAF" : "XOF",
        recipientPhone: destinationPhone,
        recipientCountry: destinationCountry,
        recipientCorrespodent: destinationCorrespondent,
        status: "failed",
        createdAt: new Date(),
        depositId,
        currencyOrigin: currency,
        phoneOrigin: payerPhone,
        countryOrigin: country,
        correspondentOrigin: correspondent,
        errorMessage: payoutResponse?.message || "Erreur inconnue",
      });

      // Gestion des erreurs, commencer le processus de remboursement
      await createRefund(depositId, depositedAmount, payerPhone);
      return {
        status: 500,
        message: "Payout initiation failed, refund initiated",
      };
    }
  } catch (error: any) {
    // Gestion des erreurs et déclenchement du remboursement
    console.error("Erreur lors de l'initiation du payout:", error);

    return {
      status: 500,
      message: "Error during payout initiation, refund initiated",
      error: error.toString(),
    };
  }
}
