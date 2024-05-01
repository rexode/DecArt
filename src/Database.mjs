import { initializeApp } from "firebase/app";

import { createUserWithEmailAndPassword,signInWithEmailAndPassword,getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAfOePEpvO-G9xkp61Zyw57BE6atE-HlkI",
  authDomain: "tfgsubastas.firebaseapp.com",
  projectId: "tfgsubastas",
  storageBucket: "tfgsubastas.appspot.com",
  messagingSenderId: "714850428903",
  appId: "1:714850428903:web:fee38ceaa9260dd2e47f42",
  measurementId: "G-CC9QYK3Q3W",
};
let app = initializeApp(firebaseConfig);
let auth = getAuth(app);
export default app;

//registerUser("a@a.com", "sj3m@~#n");
    signInWithEmailAndPassword(auth, 'a@a.com', 'sj3m@~#n')
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
 function registerUser(email, password) {
  console.log(auth);
  
}
