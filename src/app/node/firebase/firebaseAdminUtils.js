const fireAdmin = require('firebase-admin');

const adminConfJSON = require('./vr-church-app-firebase-adminsdk-9cgnl-4ebbb01507.json');

fireAdmin.initializeApp({
    credential: fireAdmin.credential.cert(adminConfJSON),
    // databaseURL: "https://vr-cormentis-project.firebaseio.com"
});

function varifyUserToken(idToken) {
   
   return fireAdmin
        .auth()
        .verifyIdToken(idToken);
}


module.exports = { varifyUserToken }