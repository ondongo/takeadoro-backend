import setupPaydunya from "../../../../config/paydunya-config/setup";

export async function submitDisbursementPaydunya(
  disburseToken: string,
  disburseId?: string
) {
  const apiUrl = "https://app.paydunya.com/api/v2/disburse/submit-invoice";
  const payload = {
    disburse_invoice: disburseToken,
    disburseId: disburseId,
  };

  try {
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

    const responseData: any = await response.json();
    if (response.status == 200 && responseData["response_code"] == "00") {
      return {
        success: true,
        status: responseData["status"],
        message: responseData["response_text"],
        transaction_id: responseData["transaction_id"],
      };
    } else {
      return { success: false, message: responseData["response_text"] };
    }
  } catch (error: any) {
    return { success: false, message: error.toString() };
  }
}
