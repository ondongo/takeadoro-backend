import * as admin from 'firebase-admin';

// Initialise l'application Firebase Admin si elle n'a pas encore été initialisée
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://<your-database-name>.firebaseio.com"
  });
}

export default admin;