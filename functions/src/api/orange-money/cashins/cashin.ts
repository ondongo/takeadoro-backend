import { encryptPassword } from "../../../utils/encryptPassword";
import { obtainAccessToken } from "../../../utils/obtainToken";

export async function makeCashInRequest(
  partnerMsisdn: string,
  amount: number,
  customerMsisdn: string
): Promise<any> {
  const accessToken = await obtainAccessToken();

  console.log("Voici>>>>>>>>>>>>", accessToken);
  if (!accessToken) {
    console.error("Access token manquant");
    return { success: false, message: "Access token missing" };
  }

  const encryptedRsaPinCode = await encryptPassword("2021", accessToken);
  console.log("GOOGOOGOGOG", encryptedRsaPinCode);
  const payload: any = {
    partner: {
      idType: "MSISDN",
      id: partnerMsisdn,
      encryptedPinCode: encryptedRsaPinCode,
    },
    customer: {
      idType: "MSISDN",
      id: customerMsisdn,
    },
    amount: {
      value: amount,
      unit: "XOF",
    },
    reference: "",
    receiveNotification: false,
  };

  console.log("Payload envoyé:", JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(
      "https://api.sandbox.orange-sonatel.com/api/eWallet/v1/cashins",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Réponse du cash-in:", data);
      return { success: true, data: data };
    } else {
      console.error(
        "Erreur lors de l'appel cash-in:",
        response.status,
        response
      );
      return { success: false, message: response.status };
    }
  } catch (error) {
    console.error("Erreur réseau lors de l'appel cash-in:", error);
    return { success: false, message: "Network error" };
  }
}
