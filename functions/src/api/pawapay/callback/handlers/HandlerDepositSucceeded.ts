import { createPayout } from "../../payouts/payoutService";
import admin from "../../../../config/firebaseConfig";
import { createRefund } from "../../refunds/refundService";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export async function HandlerDepositSucceeded(data: any) {
  try {
    const { depositId, amount, currency, countryOrigin, metadata, payerPhone } =
      data.body;

    console.log("Received deposit callback:", data.body);
    console.log(`Deposit ${depositId} confirmed. Initiating payout...`);

    // Extraction du pays de destination depuis les métadonnées
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

    // Tentative d'initiation du payout
    const payoutResponse = await createPayout(
      amount,
      currency,
      getCorrespondent(destinationCountry),
      getRecipientPhone(destinationCountry),
      destinationCountry,
      countryOrigin
    );

    if (payoutResponse.success) {
      console.log("Payout initié avec succès:", payoutResponse.data);

      // Enregistrer le payout en Firestore
      const payoutRef = await db.collection("payouts").add({
        payoutId: payoutResponse.data.payoutId,
        amount,
        currency,
        recipientPhone: getRecipientPhone(destinationCountry),
        status: "succeeded",
        createdAt: new Date(),
        type: "payout",
        depositId,
        payerPhone,
        countryOrigin,
        destinationCountry,
      });

      console.log("Payout enregistré avec succès :", payoutRef.id);
      return { status: 200, message: "Payout initiated successfully" };
    } else {
      console.error("Échec de l'initiation du payout:", payoutResponse.message);

      // Gestion des erreurs, commencer le processus de remboursement
      await createRefund(depositId, amount, payerPhone);
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
