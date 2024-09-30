var SibApiV3Sdk = require("sib-api-v3-sdk");

export const initializeBrevoClient = () => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error(
      "La clé API Brevo est manquante. Assurez-vous qu'elle est configurée dans les variables d'environnement."
    );
  }

  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKeyAuth = defaultClient.authentications["api-key"];
  apiKeyAuth.apiKey = apiKey;

  return defaultClient;
};