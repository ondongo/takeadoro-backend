export const sendSmsNotification = async (
  phoneNumber: string,
  status: string,
  country: string,
  fees: string
) => {
  const message =
    status === "success"
      ? `Félicitations ! Votre transfert vers ${country} sur TakeAdoro a été effectué avec succès. Les frais étaient de ${fees} Fcfa.`
      : `Désolé, votre transfert vers ${country} sur TakeAdoro a échoué. Les frais étaient de ${fees} Fcfa. Nous avons remboursé le montant de votre dépôt et nous vous contacterons très bientôt pour résoudre cette situation.`;

  const data = {
    to: phoneNumber,
    text: message,
  };

  const url = `https://api.unimtx.com/?action=sms.message.send&accessKeyId=${process.env.SMS_UNIMATIX_ACCESS_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();

    if (response.ok) {
      console.log("SMS envoyé:", responseData);
    } else {
      console.error("Erreur lors de l'envoi du SMS:", responseData);
    }
  } catch (error) {
    console.error("Erreur réseau lors de l'envoi du SMS:", error);
  }
};
