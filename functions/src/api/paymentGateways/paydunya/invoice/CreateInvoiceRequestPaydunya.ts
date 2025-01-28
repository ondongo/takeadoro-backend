import fetch from "node-fetch";
import setupPaydunya from "../../../../config/paydunya-config/setup";

export async function CreateInvoiceRequestPaydunya(requestBody: any) {
  // Configuration PayDunya
  const PAYDUNYA_WEBSITE_URL = process.env.WEB_URL;
  const PAYDUNYA_LOGO_URL = process.env.LOGO_URL;

  const apiUrl =
    "https://app.paydunya.com/sandbox-api/v1/checkout-invoice/create";

  try {
    const user = requestBody.user;
    const lineItems = requestBody.lineItems;

    if (!user.uid || lineItems.length === 0) {
      return {
        success: false,
        message: "Missing required data",
        response: "",
      };
    }

    const uid = user.uid;
    const currency = "xof";

    // Actions pour la facture
    const actions = {
      return_url: "takeadoro://success",
      cancel_url: "takeadoro://failed",
      callback_url: "takeadoro://transfert",
    };

    // Mapping des articles
    const items = lineItems.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.quantity * item.unitPrice,
    }));

    // Calculer le montant total
    const totalItemsAmount = items.reduce(
      (sum: any, item: any) => sum + item.total_price,
      0
    );

    // Payload pour la requête
    const payload = {
      invoice: {
        items,
        total_amount: totalItemsAmount,
        description: "Envoi argent",
      },
      store: {
        name: "Takeadoro",
        tagline: "Transfert d'argent wave/orange -> Airtel Money",
        phoneNumber: "+221771592145",
        websiteURL: PAYDUNYA_WEBSITE_URL,
        logoURL: PAYDUNYA_LOGO_URL,
      },
      actions,
      custom_data: {
        currency,
        uid,
        paymentMethod: "paydunya",
        subscription: true,
      },
    };

    // Effectuer la requête HTTP
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "PAYDUNYA-MASTER-KEY": setupPaydunya.masterKey,
        "PAYDUNYA-PRIVATE-KEY": setupPaydunya.privateKey,
        "PAYDUNYA-TOKEN": setupPaydunya.token,
      },
      body: JSON.stringify(payload),
    });

    const data: any = await response.json();

    if (response.ok && data) {
      console.log("Réponse PayDunya :", data);
      return {
        success: true,
        message: "Invoice created",
        response: data.response_text,
      };
    } else {
      console.error("Erreur lors de la création de la facture :", data);
      return {
        success: false,
        message: "Error during payment request",
        response: data,
      };
    }
  } catch (error: any) {
    console.error("Erreur de serveur :", error);
    return {
      success: false,
      message: "Server error",
      response: error.toString(),
    };
  }
}
