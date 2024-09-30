import { initializeBrevoClient } from "../../utils/brevoUtils";

var SibApiV3Sdk = require("sib-api-v3-sdk");

export const activateTemplate = async (templateId: any) => {
  try {
    initializeBrevoClient();
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    let smtpTemplate = new SibApiV3Sdk.UpdateSmtpTemplate();
    smtpTemplate.isActive = true;

    const data = await apiInstance.updateSmtpTemplate(templateId, smtpTemplate);
    console.log("Template activated successfully:", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error activating template:", error);
    throw new Error(`Error activating template: ${error}`);
  }
};
