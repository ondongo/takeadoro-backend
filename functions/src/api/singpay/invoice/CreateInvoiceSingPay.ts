import fetch from "node-fetch";
import actionsSingPay from "../../../config/singpay-config/action";
import storeSingPay from "../../../config/singpay-config/store";
import setupSingPay from "../../../config/singpay-config/setup";

export async function createInvoiceSingPay(amount: any) {
  const url = "https://gateway.singpay.ga/v1/ext";

  const data = {
    portefeuille: storeSingPay.portefeuille,
    reference: `payment_ref_${Date.now()}`,
    redirect_success: actionsSingPay.redirect_success,
    redirect_error: actionsSingPay.redirect_error,
    amount: amount,
    disbursement: "string",
    logoURL: storeSingPay.logoURL,
    isTransfer: false,
  };

  const headers: Record<string, string> = {
    "x-client-id": setupSingPay.xClientId || "",
    "x-client-secret": setupSingPay.xClientSecret || "",
    "x-wallet": setupSingPay.xWallet || "",
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    const responseData: any = await response.json();

    if (response.ok) {
      console.log("Lien de paiement SingPay :", responseData.link);
      return {
        success: true,
        link: responseData.link,
      };
    } else {
      console.error("Erreur SingPay :", responseData);
      return {
        success: false,
        message: responseData.message || "Erreur inconnue",
      };
    }
  } catch (error: any) {
    console.error("Erreur serveur SingPay :", error);
    return {
      success: false,
      message: error.message,
    };
  }
}
