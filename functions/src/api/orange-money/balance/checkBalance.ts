import { encryptPassword } from "../../../utils/encryptPassword";
import { obtainAccessToken } from "../../../utils/obtainToken";

export async function checkBalance(
  idType: any,
  id: any,
  encryptedPinCode: any,
  wallet: any
) {
  const accessToken = await obtainAccessToken();

  if (!accessToken) {
    console.error("Access token missing");
    return { success: false, message: "Access token missing" };
  }

  const encryptedRsaPinCode = await encryptPassword(
    encryptedPinCode,
    accessToken
  );
  try {
    const response = await fetch(
      "https://api.sandbox.orange-sonatel.com/api/eWallet/v1/account/retailer/balance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          idType: idType,
          id: id,
          encryptedPinCode: encryptedPinCode,
          wallet: wallet,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Balance response:", data);
      return { success: true, data: data };
    } else {
      const errorData = await response.text();
      console.error(
        "Error checking balance:",
        response.status,
        response.statusText,
        errorData
      );
      return {
        success: false,
        message: `Error ${response.status}: ${response.statusText}. Details: ${errorData}`,
      };
    }
  } catch (error) {
    console.error("Network error:", error);
    return { success: false, message: "Network error" };
  }
}
