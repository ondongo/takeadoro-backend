import setupPawapay from "../../../config/pawapay-config/setup";

export async function createRefund(refundId: string, depositId: string, amount: number, orderId: string, customerEmail: string) {
    const apiUrl = `${setupPawapay.baseUrl}/refunds`;
  
    const payload = {
      refundId,
      depositId,
      amount: amount.toString(),
      metadata: [
        { fieldName: "orderId", fieldValue: orderId },
        { fieldName: "customerId", fieldValue: customerEmail, isPII: true },
      ],
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating refund:", error);
      return null;
    }
  }