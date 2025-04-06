import { initializeBrevoClient } from "../../utils/brevoUtils";

var SibApiV3Sdk = require("sib-api-v3-sdk");

export const getContactsList = async () => {
  try {
    initializeBrevoClient();
    const apiInstance = new SibApiV3Sdk.ContactsApi();
    const data = await apiInstance.getContacts();
    console.log(
      "Liste des contacts récupérée avec succès:",
      JSON.stringify(data)
    );
    return data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la liste des contacts:",
      error
    );
    throw new Error(
      `Erreur lors de la récupération de la liste des contacts : ${error}`
    );
  }
};
