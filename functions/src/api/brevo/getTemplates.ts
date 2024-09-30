import { initializeBrevoClient } from "../../utils/brevoUtils";

var SibApiV3Sdk = require("sib-api-v3-sdk");

export const getTemplates = async () => {
  try {
    initializeBrevoClient();
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    let opts = {
      /* templateStatus: true, */
      templateStatus:true,
      limit: 50,
      offset: 0,
    };

    const data = await apiInstance.getSmtpTemplates(opts);

    console.log(
      "API called successfully. Returned data:",
      JSON.stringify(data)
    );
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(
      `Erreur lors de la récupération de la liste des contacts : ${error}`
    );
  }
};
