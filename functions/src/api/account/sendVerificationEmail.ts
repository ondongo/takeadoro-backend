import admin from "../../config/firebaseConfig";
import { sendTransactionalEmail } from "../brevo/sendEmailTransactionnelByBrevo";

export const sendVerificationEmail = async (user: admin.auth.UserRecord) => {
  if (user.email) {
    const actionCodeSettings = {
      url: `https://groopy.com.br/verify?uid=${user.uid}`,
      handleCodeInApp: true,
    };

    const link = await admin.auth().generateEmailVerificationLink(user.email, actionCodeSettings);

    await sendTransactionalEmail(
      user.email,
      "Verifique seu endereço de E-mail",
      "Verificação De E-Mail",
      `Clique no link abaixo para verificar seu endereço de E-mail: ` ,
      `${link}`,
      "verificar o e-mail"
    );
  } else {
    console.error('User does not have an email address.');
    // Handle the case where the user does not have an email address
  }
};


export const sendVerificationEmailAndRedirect = async (user: admin.auth.UserRecord) => {
  if (user.email) {
    const actionCodeSettings = {
      url: `https://groopy.com.br/onBoardingStep1?uid=${user.uid}`,
      handleCodeInApp: true,
    };

    const link = await admin.auth().generateEmailVerificationLink(user.email, actionCodeSettings);

    await sendTransactionalEmail(
      user.email,
      "Verifique seu endereço de E-mail",
      "Verificação de E-mail",
      `Clique no link abaixo para verificar seu endereço de E-mail:
      ${link}`,
      "verificar o e-mail"
    );
  } else {
    console.error('User does not have an email address.');
    // Handle the case where the user does not have an email address
  }
};
