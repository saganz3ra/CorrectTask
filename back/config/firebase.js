var admin = require("firebase-admin");
var serviceAccount = require("../config/correcttask-firebase-adminsdk-99r4a-fd4259c8cb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://correcttask.firebaseio.com" // Substitua pelo URL do seu Realtime Database, se necessário
});

module.exports = admin.firestore();
