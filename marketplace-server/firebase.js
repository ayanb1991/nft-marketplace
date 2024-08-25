const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_CERT_URL);


const init = () => {
  // Initialize the app with a service account, granting admin privileges
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = {
  init
}
