import admin from "../../config/firebaseConfig";

import * as logger from "firebase-functions/logger";
import corsHandler from "../../utils/corsHandler";
/* import { sendTransactionalEmail } from "../brevo/sendTransactionalEmail";
import { sendEmailTransactionnelByTemplate } from "../brevo/sendEmailTransactionnelByTemplate";
 */
/************************************************************/
/*          Functions for schedule      */
/***********************************************************/
export async function verifyActiveUsers() {
  try {
    const usersRef = admin.firestore().collection("users");
    const snapshot = await usersRef.get();

    // Users Mirror
    const today = new Date();

    const promises = snapshot.docs.map(async (doc: any) => {
      const user = doc.data();
      const lastLogin: Date | undefined = user.last_login?.toDate();

      if (lastLogin) {
        lastLogin.setDate(lastLogin.getDate() + 7);
      }
      /* Mon exemple :  10(date de la dernière connexion) + 7 = 18 <  19(date du jour) */
      // Vérifier si l'utilisateur est inactif depuis plus de 7 jours
      if (lastLogin === undefined || today > lastLogin) {
        if (user.type === "Freelance" || user.type === "Freelancer") {
          await usersRef.doc(doc.id).update({ status: "Bientôt" });
        }
        const emailTitle = "Conta inactiva";
        const emailMessage =
          "A sua conta está inativa há 7 dias. Faça login novamente para aproveitar as possíveis oportunidades.";

        /* await sendTransactionalEmail(
          user.email,
          user.email,
          emailTitle,
          emailMessage
        ); */

        /* await sendEmailTransactionnelByTemplate(user.email, 10, {
          FIRSTNAME: user.email
        }); */
      }
    });

    await Promise.all(promises);
    logger.info("User verification process completed successfully.");
  } catch (error) {
    logger.error("Error verifying active users:", error);
  }
}

export const scheduledVerifyActiveUsers = async () => {
  await verifyActiveUsers();
};

/************************************************************/
/*           Functions for test         */
/***********************************************************/

export async function verifyActiveUsersForTesting(testUserIds: string[]) {
  try {
    const usersRef = admin.firestore().collection("users");

    const promises = testUserIds.map(async (userId: string) => {
      const userDoc = await usersRef.doc(userId).get();

      if (!userDoc.exists) {
        logger.info(`User with ID ${userId} does not exist.`);
        return;
      }

      const user: any = userDoc.data();
      const lastLogin: Date | undefined = user?.last_login?.toDate();

      console.log("last_login>>>>>>>>>>>>>", lastLogin);
      const today = new Date();

      if (lastLogin) {
        lastLogin.setDate(lastLogin.getDate() + 1);
      }

      if (lastLogin === undefined || today > lastLogin) {
        console.log("on est là >>>>>>>>>>>>>", today > lastLogin!);
        const emailTitle = "Conta inactiva";
        const emailMessage =
          "A sua conta está inativa há 7 dias. Faça login novamente para aproveitar as possíveis oportunidades.";

       /*  await sendTransactionalEmail(
          user.email,
          user.email,
          emailTitle,
          emailMessage
        ); */
      }
    });

    await Promise.all(promises);
    logger.info(
      "User verification process for testing completed successfully."
    );
  } catch (error) {
    logger.error("Error verifying active users for testing:", error);
  }
}

const TEST_USER_IDS = [
  "9E7ZkU1MKehuhBcTJO4GJRUp8YA2",
  "u7c9XbO73Xa6DJ1hBBqmbwY4swu1",
];
export const triggerVerifyActiveUsersForTesting = async (
  req: any,
  res: any
) => {
  corsHandler(req, res, async () => {
    await verifyActiveUsersForTesting(TEST_USER_IDS);
    res.status(200).send("User verification process for testing completed.");
  });
};
