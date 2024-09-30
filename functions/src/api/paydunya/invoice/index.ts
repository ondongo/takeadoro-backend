import setupPaydunya from "../../../config/paydunya-config/setup";
import fetch from "node-fetch";

export async function CheckInvoiceRequest(token: string) {
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
        data.invoice.status || "Statut non disponible"
      );
      console.log(
        "Informations du client :",
        data.invoice.customer || "Client non disponible"
      );
      console.log(
        "URL du reçu :",
        data.invoice.receipt_url || "URL non disponible"
      );
      return {
        success: true,
        status: data.invoice.status || "Statut non disponible",
        customer: data.invoice.customer || "Client non disponible",
        receiptURL: data.invoice.receipt_url || "URL non disponible",
      };
    } else {
      console.error("Erreur lors de la vérification de la facture :", data);
      return {
        success: false,
        message:
          data?.message || "Erreur lors de la vérification de la facture",
      };
    }
  } catch (error) {
    console.error("Erreur lors de la requête HTTP :", error);
    return {
      success: false,
      message: "Erreur de serveur : " + error,
    };
  }
}
