import { checkDepositStatus } from "../deposits/depositService";
import { HandlerDepositFailed } from "./handlers/HandlerDepositFailed";
import { HandlerDepositSucceeded } from "./handlers/HandlerDepositSucceeded";

export async function handlePawaPayCallback(req: any, res: any) {
  /* try { */
    const data = req.data;

    console.log("Callback reçu :", data);

  /*   const result = await checkDepositStatus(data.depositId);

    if (result.success && result.data.status === "COMPLETED") {
      console.log("Le paiement a été confirmé avec succès.");
      await HandlerDepositSucceeded(data);
    } else {
      console.error("Échec de la vérification du paiement.");
      await HandlerDepositFailed();
    }

    res.status(200).send("Notification reçue et traitée.");
  } catch (error) {
    console.error("Erreur lors du traitement de la notification :", error);
    res.status(500).send("Erreur serveur");
  } */
}

// Fonction pour parser les données reçues
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
