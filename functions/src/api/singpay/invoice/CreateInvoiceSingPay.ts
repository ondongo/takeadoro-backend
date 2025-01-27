import fetch from "node-fetch";
import actionsSingPay from "../../../config/singpay-config/action";

export async function createInvoiceSingPay(amount: any) {
  const url = "https://gateway.singpay.ga/v1/ext";

  const data = {
    portefeuille: "66bdde2adc5276b625104a30",
    reference: `payment_ref_${Date.now()}`, 
    redirect_success: actionsSingPay.redirect_success,
    redirect_error: actionsSingPay.redirect_error,
    amount: amount,
    disbursement: "string",
    logoURL: "https://your-storage-url/logo.png",
    isTransfer: false,
  };

  const headers = {
    "x-client-id": "your-client-id",
    "x-client-secret": "your-client-secret",
    "x-wallet": "your-wallet-id",
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
