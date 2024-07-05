import { initializeApp } from "firebase/app";
import { collection, query, where, getDocs } from "firebase/firestore";

import { doc, setDoc, getFirestore } from "firebase/firestore";

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

async function signMessage() {
  const ethers = require("ethers");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider
    .send("eth_requestAccounts", [])
    .then(() => provider.getSigner())
    .then((signer) =>
      signer
        .signMessage("Verifica tu cartera")
        .then((signature) =>
          ethers.utils.verifyMessage("Verifica tu cartera", signature)
        )
        .then((address) => {
          let auth = getAuth(app);
          const db = getFirestore(app);
          const q = query(collection(db, "Users"), where("Wallet", "==", address));
          const querySnapshot = getDocs(q)
          .then((addresses) => {
            console.log(addresses.empty);
          if(addresses.empty){
            console.log(address);
            return address}
          
          else{
            console.log("0x000");
            return "0x999"}});
        })
        
    );
}
export default app
export{signMessage}