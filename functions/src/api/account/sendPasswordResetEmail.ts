
import { sendTransactionalEmail } from "../brevo/sendEmailTransactionnelByBrevo";
import admin from "../../config/firebaseConfig";
export const sendPasswordResetEmail = async (email: string) => {
  const actionCodeSettings = {
    url: `https://groopy.com.br/reset`,
    handleCodeInApp: true,
  };

  const link = await admin
    .auth()
    .generatePasswordResetLink(email, actionCodeSettings);

  await sendTransactionalEmail(
    email,
    "Redefina sua senha",
    "Redefinição De Senha",
    `Clique no link abaixo para redefinir sua senha:`,
    `${link}`,
    "Repor Palavra-Passe",
  );
};
