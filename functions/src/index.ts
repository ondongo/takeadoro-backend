/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { createDeposit } from "./api/pawapay/deposits/depositService";
import { handlePawaPayCallback } from "./api/pawapay/callback";
/* import * as logger from "firebase-functions/logger";
import { makeCashInRequest } from "./api/orange-money/cashins/cashin";
import { checkBalance } from "./api/orange-money/balance/checkBalance"; */
//import { createInvoiceRequest } from "./api/paydunya/send-money";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
export const httpCreateDeposit = onRequest(async (req: any, res: any) => {
  try {
    // Vérification des paramètres reçus
    const { amount, currency, payerPhone, payerCountry, destinationCountry } = req.body;

    if (
      !amount ||
      !currency ||
      !payerPhone ||
      !payerCountry ||
      !destinationCountry
    ) {
      return res.status(400).json({
        error: true,
        message: "Missing required fields",
      });
    }

    const response = await createDeposit(
      amount,
      currency,
      payerPhone,
      payerCountry,
      destinationCountry
    );

    res.status(response.success ? 200 : 500).json(response);
  } catch (err) {
    console.error("Error in createDeposit:", err);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

export const pawaPayCallback = onRequest(async (req, res) => {
  try {
    await handlePawaPayCallback(req, res);
  } catch (err) {
    console.error("Error in pawaPayCallback:", err);
    res.status(500).send("Internal server error");
  }
});
/* export const cashInOrange = onRequest(async (req: any, res: any) => {
  try {
    const { partnerMsisdn, amount, customerMsisdn } = req.body;

    console.log("Partner MSISDN:", partnerMsisdn);
    console.log("Amount:", amount);
    console.log("Customer MSISDN:", customerMsisdn);
    if (!partnerMsisdn || !amount || !customerMsisdn) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const result = await makeCashInRequest(
      partnerMsisdn,
      amount,
      customerMsisdn
    );

    if (result.success) {
      res.status(200).json({
        message: "Cash-in request successfully processed",
        data: result.data,
      });
    } else {
      res.status(500).json({
        error: `Failed to process cash-in request: ${result.message}`,
      });
    }
  } catch (error) {
    console.error("Error handling cash-in request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}); */

/* export const checkBalanceOrange = onRequest(async (req: any, res: any) => {
  // Vérifiez que la méthode de la requête est POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed. Only POST requests are allowed.",
    });
  }

  const { idType, id, encryptedPinCode, wallet } = req.body;

  try {
    if (!idType || !id || !encryptedPinCode || !wallet) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters in the request body",
      });
    }

    const result = await checkBalance(idType, id, encryptedPinCode, wallet);
    if (result.success) {
      res.status(200).json({ success: true, data: result.data });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Error in checkBalanceOrange:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error: error });
  }
});
 */
