const fireAdmin = require('firebase-admin');

const adminConfJSON = require('./vr-church-app-firebase-adminsdk-9cgnl-4ebbb01507.json');

fireAdmin.initializeApp({
    credential: fireAdmin.credential.cert(adminConfJSON),
});

const  firebaseConfig = {
    apiKey: "AIzaSyD-WPY3eIi4zKoHzGIqR5gHWKKvaqx5TIw",
    authDomain: "vr-church-app.firebaseapp.com",
    projectId: "vr-church-app",
    storageBucket: "vr-church-app.appspot.com",
    messagingSenderId: "204451533619",
    appId: "1:204451533619:web:25b614e247de9f7bc9e446"
};


function varifyUserToken(idToken) {
   
   return fireAdmin
        .auth()
        .verifyIdToken(idToken);
}


module.exports = { varifyUserToken, firebaseConfig }