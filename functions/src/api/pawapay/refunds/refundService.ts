import setupPawapay from "../../../config/pawapay-config/setup";
import admin from "../../../config/firebaseConfig";
import { randomUUID } from "crypto";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export async function createRefund(
  depositId: string,
  amount: number,
  customerPhone: string
) {
  const apiUrl = `${setupPawapay.baseUrl}/refunds`;
  const refundId = randomUUID().toString();
  const payload = {
    refundId,
    depositId,
    amount: amount.toString(),
    metadata: [
      { fieldName: "customerId", fieldValue: customerPhone, isPII: true },
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

    // Enregistrer le remboursement dans Firestore
    const refundRef = await db.collection("refunds").add({
      refundId,
      depositId,
      amount,
      customerPhone,
      status: data?.status || "PENDING",
      response: data,
      createdAt: new Date(),
    });

    console.log("Refund enregistré avec succès :", refundRef.id);

    return data;
  } catch (error) {
    console.error("Erreur lors de la création du remboursement:", error);
    return null;
  }
}
