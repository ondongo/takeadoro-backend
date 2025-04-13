import { checkDepositStatus } from "../deposits/depositService";
import { HandlerDepositFailed } from "./handlers/HandlerDepositFailed";
import { HandlerDepositSucceeded } from "./handlers/HandlerDepositSucceeded";

export async function handlePawaPayCallback(req: any, res: any) {
  try {
    const data = req.body;

    console.log("Callback reçu :", data);

    const result = await checkDepositStatus(data.depositId);

    if (result.success && result.data[0]?.status === "COMPLETED") {
      console.log("Le paiement a été confirmé avec succès.", result);
      await HandlerDepositSucceeded(data);
    } else {
      console.error("Échec de la vérification du paiement.", data);
      await HandlerDepositFailed(
        data.depositId,
        data.status,
        data.amount,
        data.currency,
        data.payer.address.value
      );
    }

    res.status(200).send("Notification reçue et traitée.");
  } catch (error) {
    console.error("Erreur lors du traitement de la notification :", error);
    res.status(500).send("Erreur serveur");
  }
}
