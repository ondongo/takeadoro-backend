import actionsPaydunya from "../../../config/paydunya-config/actions";
import setupPaydunya from "../../../config/paydunya-config/setup";
import fetch from "node-fetch";
export async function CheckInvoiceRequestPaydunya(token: string) {
  const apiUrl = `https://app.paydunya.com/sandbox-api/v1/checkout-invoice/confirm/${token}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "PAYDUNYA-MASTER-KEY": setupPaydunya.masterKey,
        "PAYDUNYA-PRIVATE-KEY": setupPaydunya.privateKey,
        "PAYDUNYA-TOKEN": setupPaydunya.token,
      },
    });

    const data: any = await response.json();

    if (response.ok && data) {
      console.log(
        "Statut de la facture :",
        data.invoice?.status || "Non disponible"
      );
      console.log("Client :", data.invoice?.customer || "Non disponible");
      console.log(
        "URL du reçu :",
        data.invoice?.receipt_url || "Non disponible"
      );

      return {
        success: true,
        status: data.invoice?.status || "Non disponible",
        customer: data.invoice?.customer || "Non disponible",
        receiptURL: data.invoice?.receipt_url || "Non disponible",
      };
    } else {
      console.error("Erreur lors de la vérification de la facture :", data);
      return {
        success: false,
        message:
          data?.message || "Erreur lors de la vérification de la facture",
      };
    }
  } catch (error: any) {
    console.error("Erreur lors de la requête HTTP :", error);
    return {
      success: false,
      message: "Erreur de serveur : " + error.message,
    };
  }
}
