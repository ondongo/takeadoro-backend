import { initializeBrevoClient } from "../utils/brevoUtils";

var SibApiV3Sdk = require("sib-api-v3-sdk");
import { v4 as uuidv4 } from "uuid";

export const sendTransactionalEmail = async (
  email: string,
  name: string,
  subject: string,
  message: string,
  link?: string,
  linkText?: string 
) => {
  try {
    initializeBrevoClient();
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    const uniqueId = uuidv4();
    // Configuration email
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 0; margin: 0;">
          <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid transparent; border-collapse: collapse;">
              <tr>
                  <td style="background-color: #FB5756; text-align: center; padding: 50px;  color: #ffffff; font-size: 20px;">
                    ${subject}
                  </td>
              </tr>
              <tr>
                  <td style="padding: 60px 20px; text-align: center; font-size: 16px; line-height: 1.5; color: #333333;">
                    ${message}
                  </td>
              </tr>

              ${link ? `
              <tr>
                  <td style="padding: 10px 20px 40px; text-align: center;">
                      <a href="${link}" style="color: #ff6f61; text-decoration: underline; font-size: 16px;">${linkText || 'Clique aqui'}</a>
                  </td>
              </tr>
              ` : ''}
              <tr>
                  <td>
                      <div style="height: 3px; background-color: #106278;"></div>
                  </td>
              </tr>
              <tr>
                  <td style=" background-color: #f4f4f9;  text-align: center; padding: 20px;">
                      <img src="https://i.postimg.cc/MZ5TxsSM/tiny-Takae-Adoro-Dark.png" alt="Takae-Adoro Logo" style="width: 150px; height: auto;">
                  </td>
              </tr>
              <tr>
                  <td style="text-align: center; padding: 20px;">
                      <a href="https://Takae-Adoro.com.br/" style="color: #ff6f61; text-decoration: none; font-size: 16px;">https://Takae-Adoro.com.br/</a>
                  </td>
              </tr>
              <tr>
                  <td>
                      <div style="height: 3px; background-color: #106278;"></div>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `;
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: "Takae-Adoro", email: "admin@Takae-Adoro.com" }; // Utilisez les détails du détenteur du compte
    sendSmtpEmail.to = [{ email: email, name: name }];
    sendSmtpEmail.replyTo = { name: "Takae-Adoro", email: "admin@Takae-Adoro.com" };
    sendSmtpEmail.headers = { "X-Unique-Id": uniqueId };
    sendSmtpEmail.params = { parameter: "My param value", subject: subject };

    // send email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(
      "API called successfully. Returned data: " + JSON.stringify(data)
    );
    return data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email transactionnel:", error);
    throw new Error(
      `Erreur lors de l'envoi de l'email transactionnel : ${error}`
    );
  }
};