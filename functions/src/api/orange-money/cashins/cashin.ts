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

  const payload: any = {
    partner: {
      idType: "MSISDN",
      id: partnerMsisdn,
      encryptedPinCode:
        "JYB6uyRwG2ZaOAiLFckPaheyGzCpw5nBqBFCEWNB/wdT9zgoDEfJlmf8Ihf+ydAdIVTokMWbuF4vNcFqLC/MjGZT/o69sateWSCd9CypNvXrDV5XlUijEPwGEFTcPq4EG1LwosMZiXWchyfL+TsJHFMN8nYv+e7v/y0RLoS8u5hH8GSTjjZDIZORlPLBYV/ePb+W73jZ12fzdcteIwXEw+6Tg7LmRMK8rpCEoUVZfMc+gA9C+26uAyan2O06oItojHSit1ITkLD1tCoPmE+H+1xIumrczVF32XQxy3HogdQGvxvWdO8N0E29DWw/8n9ryMBpb6GzbBoX4sb0Kif6Gw==",
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

  try {
    const response = await fetch(
      "https://api.sandbox.orange-sonatel.com/api/eWallet/v1/cashins",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "*/*", 
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
