import admin from "../../config/firebaseConfig";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Envoie une notification push FCM vers une app FlutterFlow
 *
 * @param {string} userId - ID de l'utilisateur dans Firestore
 * @param {string} country - Pays de destination du transfert
 * @param {string} fees - Montant des frais en Fcfa
 * @param {string} status - Statut de la transaction (success ou failed)
 */
export async function sendPushNotification(
    userId: string,
    country: string,
    fees: string,
    status: string
) {
    const content =
        status === "success"
            ? `Félicitations ! Votre transfert vers ${country} sur TakeAdoro a été effectué avec succès. Les frais étaient de ${fees} Fcfa.`
            : `Désolé, votre transfert vers ${country} sur TakeAdoro a échoué. Les frais étaient de ${fees} Fcfa. Nous avons remboursé le montant de votre dépôt et nous vous contacterons très bientôt pour résoudre cette situation.`;

    try {
        // Récupérer la collection fcm_tokens pour l'utilisateur
        const fcmTokensRef = admin.firestore()
            .collection('Users')
            .doc(userId)
            .collection('fcm_tokens');
        
        // Trier par created_at de manière décroissante et prendre le premier document (le plus récent)
        const snapshot = await fcmTokensRef
            .orderBy('created_at', 'desc') // Tri par created_at (du plus récent au plus ancien)
            .limit(1) // Limiter à 1 résultat
            .get();

        if (snapshot.empty) {
            console.warn("⚠️ Aucun token trouvé pour cet utilisateur.");
            return;
        }

        // Récupérer le dernier fcm_token
        const lastFcmTokenDoc = snapshot.docs[0];
        const lastFcmToken = lastFcmTokenDoc.data().fcm_token; // Extraire le fcm_token

        // Préparer le message de notification
        const message = {
            token: lastFcmToken, // Utilisation du dernier token
            notification: {
                title: "Notification de transfert TakeAdoro",
                body: content,
            },
            android: {
                notification: {
                  sound: "default",
                },
              },
            data: {
                country,
                fees,
            },
        };

        // Envoyer la notification
        const response = await admin.messaging().send(message);
        console.log("✅ Notification envoyée avec succès :", response);

    } catch (error) {
        console.error("❌ Erreur lors de l’envoi de la notification :", error);
    }
}