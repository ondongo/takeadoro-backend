import { checkDepositStatus } from "../deposits/depositService";
import { HandlerDepositFailed } from "./handlers/HandlerDepositFailed";
import { HandlerDepositSucceeded } from "./handlers/HandlerDepositSucceeded";

export async function POST(req: Request) {
  try {
    const dataString = await req.text();
    const data = parseEncodedQueryString(dataString).data;

    console.log("Callback reçu :", data);

    const result = await checkDepositStatus(data.depositId);
    
    if (result.success && result.data.status === "COMPLETED") {
      console.log("Le paiement a été confirmé avec succès.");

      await HandlerDepositSucceeded(data); 
   
    }
    
    else {
      console.error("Échec de la vérification du paiement.");
      await HandlerDepositFailed(); 
    }

    return new Response("Notificationreçue et traitée.", { status: 200 });
  } catch (error) {
    console.error("Erreur lors du traitement de la notification xx :", error);
    return new Response("Erreur serveur", { status: 500 });
  }
}


function parseEncodedQueryString(queryString: string): any {
  let decodedString = decodeURIComponent(queryString);
  decodedString = decodedString.replace(/\+/g, " ");
  const data: { [key: string]: any } = {};
  decodedString.split("&").forEach((part) => {
    const [key, value] = part.split("=");

    let target: { [key: string]: any } = data;
    let keys: string[] = key.match(/([^\[\]]+)/g) || [];

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        target[k] = value;
      } else {
        if (!target[k]) target[k] = {};
        target = target[k];
      }
    });
  });

  return data;
}
