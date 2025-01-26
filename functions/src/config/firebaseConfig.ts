import * as admin from 'firebase-admin';


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://<your-database-name>.firebaseio.com"
  });
}

export default admin;