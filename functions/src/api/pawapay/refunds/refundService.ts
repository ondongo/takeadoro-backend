import setupPawapay from "../../../config/pawapay-config/setup";
import admin from "../../../config/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export async function createRefund(
  depositId: string,
  amount: string,
  payerPhone: string,
  userId: string,
) {
  const apiUrl = `${setupPawapay.baseUrl}/refunds`;
  const refundId = uuidv4();
  const amountFloor = Math.floor(Number(amount)).toFixed(0).toString();
  console.log(">>>>>>>, Voici le amountFloor",amountFloor);
  const payload = {
    refundId,
    depositId,
    amount: amountFloor,
    metadata: [
      { fieldName: "payerPhone", fieldValue: payerPhone, isPII: true },
      { fieldName: "userId", fieldValue: userId },
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

    // Enregistrer le remboursement dans Firestore
    const refundRef = await db.collection("Refunds").add({
      refundId,
      depositId,
      amount: amountFloor,
      payerPhone,
      status: data?.status || "PENDING",
      response: data,
      createdAt: new Date(),
      userId: userId ?? "",
    });

    console.log("Refund enregistré avec succès :", refundRef.id);

    return data;
  } catch (error) {
    console.error("Erreur lors de la création du remboursement:", error);
    return null;
  }
}
