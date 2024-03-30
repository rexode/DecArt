import { Component } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";


// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyAfOePEpvO-G9xkp61Zyw57BE6atE-HlkI",
  authDomain: "tfgsubastas.firebaseapp.com",
  projectId: "tfgsubastas",
  storageBucket: "tfgsubastas.appspot.com",
  messagingSenderId: "714850428903",
  appId: "1:714850428903:web:fee38ceaa9260dd2e47f42",
  measurementId: "G-CC9QYK3Q3W"};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);


createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;})
