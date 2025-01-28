import actionsPaydunya from "../../../../config/paydunya-config/actions";
import setupPaydunya from "../../../../config/paydunya-config/setup";
import fetch from "node-fetch";

export async function InitiateDisbursmentRequestPaydunya(
  accountAlias: string,
  amount: number,
  withdrawMode: string,
  callbackUrl: string
) {
  const apiUrl = `https://app.paydunya.com/api/v2/disburse/get-invoice`;

  const payload = {
    account_alias: accountAlias,
    amount: amount,
    withdraw_mode: withdrawMode,
    callback_url: callbackUrl,
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
    if (response.status === 200 && responseData["response_code"] === "00") {
      console.log("Disbursement token: ", responseData["disburse_token"]);
      return {
        success: true,
        message: "token",
        response: responseData["disburse_token"],
      };
    } else {
      console.log("Error response from API: ", responseData["response_text"]);
      return {
        success: false,
        message: "message",
        response: responseData["response_text"],
      };
    }
  } catch (error: any) {
    console.log("Exception occurred: ", error);
    return {
      success: false,
      message: "message",
      response: error.toString(),
    };
  }
}
