import setupPaydunya from "../../../config/paydunya-config/setup";
import storePaydunya from "../../../config/paydunya-config/store";
import fetch from "node-fetch";
import actionsPaydunya from "../../../config/paydunya-config/actions";

export async function createInvoiceRequest(
  requestBody: InvoiceRequestBody
): Promise<InvoiceResponse> {
  try {
    const user = requestBody.user;
    const lineItems = requestBody.lineItems;

    if (!user || !lineItems) {
      return {
        error: true,
        message: "Missing required data",
      };
    }

    const uid = user.uid;
    const currency = "xof";

    const actions = {
      return_url: `${process.env.PAYDUNYA_WEBSITE_URL}/success`,
      cancel_url: `${process.env.PAYDUNYA_WEBSITE_URL}`,
      callback_url: actionsPaydunya.callback_url,
    };

    const items = lineItems.map((lineItem: any) => ({
      name: lineItem.name,
      quantity: lineItem.quantity,
      unit_price: lineItem.unit_price,
    }));

    const calculateTotalPrice = (item: any) => item.quantity * item.unit_price;
    const totalItemsAmount = items.reduce(
      (sum: any, item: any) => sum + calculateTotalPrice(item),
      0
    );

    const requestPayload = {
      invoice: {
        items: items.map((item: any) => ({
          ...item,
          total_price: calculateTotalPrice(item),
        })),
        total_amount: totalItemsAmount,
        description: `Envoi argent`,
      },
      store: storePaydunya,
      actions: actions,
      custom_data: {
        currency,
        uid,
        paymentMethod: "paydunya",
        subscription: true,
      },
    };

    const apiUrl =
      "https://app.paydunya.com/sandbox-api/v1/checkout-invoice/create";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "PAYDUNYA-MASTER-KEY": setupPaydunya.masterKey,
        "PAYDUNYA-PRIVATE-KEY": setupPaydunya.privateKey,
        "PAYDUNYA-TOKEN": setupPaydunya.token,
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      console.error("Error during payment request on the server:", data);
      return {
        error: true,
        message: "Error during payment request",
      };
    }
  } catch (err: any) {
    console.error("Server error:", err);
    return {
      error: true,
      message: "Server error",
    };
  }
}
