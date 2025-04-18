import setupPawapay from "../../../config/pawapay-config/setup";
import admin from "../../../config/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export async function createDeposit(
  amount: number,
  currency: string,
  payerPhone: string,
  payerCountry: string,
  destinationCountry: string,
  correspondent: string,
  destinationPhone: string,
  destinationCorrespondent: string
) {
  const apiUrl = `${setupPawapay.baseUrl}/deposits`;

  const payload = {
    depositId: uuidv4(),
    amount: amount.toString(),
    currency: currency,
    correspondent: correspondent,
    payer: {
      address: { value: payerPhone },
      type: "MSISDN",
    },
    customerTimestamp: new Date().toISOString(),
    country: payerCountry,
    statementDescription: "Transfert",
    metadata: [
      { fieldName: "destinationCountry", fieldValue: destinationCountry },
      { fieldName: "destinationPhone", fieldValue: destinationPhone },
      {
        fieldName: "destinationCorrespondent",
        fieldValue: destinationCorrespondent,
      },
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
    if (data.status === "ACCEPTED") {
      console.log("Deposit initiated successfully:", data);
      // Enregistrer la transaction réussie dans Firestore
      const amountFloor = Math.floor(Number(amount)).toString();
      const paymentRef = await db.collection("Deposits").add({
        depositId: data.depositId,
        depositedAmount: amountFloor,
        currencyOrigin: currency,
        countryOrigin: payerCountry,
        correspondentOrigin: correspondent,
        phoneOrigin: payerPhone,
        destinationCurrency: currency === "XOF" ? "XAF" : "XOF",
        destinationPhone,
        destinationCountry,
        destinationCorrespondent,
        status: "succeeded",
        createdAt: new Date(),
      });

      console.log("Transaction enregistrée avec succès :", paymentRef.id);
      return { success: true, data };
    } else {
      console.error("Error initiating deposit:", data);
      const amountFloor = Math.floor(Number(amount)).toString();
      const paymentfailedRef = await db.collection("Deposits").add({
        depositId: data.depositId,
        depositedAmount: amountFloor,
        currencyOrigin: currency,
        countryOrigin: payerCountry,
        correspondentOrigin: correspondent,
        phoneOrigin: payerPhone,
        destinationCurrency: currency === "XOF" ? "XAF" : "XOF",
        destinationPhone,
        destinationCountry,
        destinationCorrespondent,
        status: "failed",
        createdAt: new Date(),
      });
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

export async function checkDepositStatus(depositId: string) {
  const apiUrl = `${setupPawapay.baseUrl}/deposits/${depositId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAWAPAY_TOKEN_SANDBOX}`,
      },
    });

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
