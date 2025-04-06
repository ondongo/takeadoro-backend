import admin from "../../../../config/firebaseConfig";
import { createRefund } from "../../refunds/refundService";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export async function HandlerDepositFailed(
  depositId?: string,
  status?: string,
  amount?: string,
  currency?: string,
  customerPhone?: string
) {
  try {
    console.warn(
      `Deposit ${depositId || "unknown"} failed with status: ${
        status || "unknown"
      }`
    );

    // Enregistrer l'échec de transaction dans Firestore
    const failedRef = await db.collection("Deposits").add({
      depositId,
      amount,
      currency,
      status: "failed",
      createdAt: new Date(),
    });

    console.log("Transaction échouée enregistrée :", failedRef.id);

    // Déclencher le remboursement
    if (depositId && amount && currency && customerPhone) {
      const refundResponse = await createRefund(
        depositId,
        amount,
        customerPhone
      );
      if (refundResponse.success) {
        console.log("Refund successful:", refundResponse.data);
      } else {
        console.error("Refund failed:", refundResponse.error);
      }
    }

    return { status: 400, message: `Deposit failed: ${status || "unknown"}` };
  } catch (error: any) {
    console.error("Error handling deposit failure:", error);
    return {
      status: 500,
      message: "Internal server error",
      error: error.toString(),
    };
  }
}
