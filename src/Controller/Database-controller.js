import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  currentUser,
  getAuth,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  or,
} from "firebase/firestore";

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

async function loadUserdata(uid) {
  if (uid != "LogIn") {
    let auth = getAuth(app);
    const db = getFirestore(app);
    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().Wallet);
      return docSnap.data();
    } else console.log("no hay datos");
  } else console.log("Primera vez");
}
async function getSubastasGestion() {
  const db = getFirestore(app);
  let list = [];
  const q = query(
    collection(db, "Subastas"),
    or(where("Open", "==", true), where("ToPay", "==", true))
  );
  const querySnapshot = await getDocs(q).then((response) => {
    console.log(response.docs);
    for (let i = 0; i < response.docs.length; i++) {
      list.push({
        SubastaId: response.docs[i].id,
        id: response.docs[i].data().Id,
        PujaActual: response.docs[i].data().PujaActual,
        Started: response.docs[i].data().Started,
        Open: response.docs[i].data().Open,
      });
    }
  });
  console.log(list);
  return list;
}
async function getSubastasUsers(wallet) {
  const db = getFirestore(app);
  let list = [];
  

  const q = query(collection(db, "Subastas"));
  const querySnapshot = await getDocs(q).then((response) => {
    console.log(response.docs);
    for (let i = 0; i < response.docs.length; i++) {
      
        list.push({
          SubastaId: response.docs[i].id,
          id: response.docs[i].data().Id,
          PujaActual: response.docs[i].data().PujaActual,
          Started: response.docs[i].data().Started,
          Open: response.docs[i].data().Open,
          WinnerWallet: response.docs[i].data().WinnerWallet,
          ToPay:response.docs[i].data().ToPay
        });
      
    }
  });
  console.log(list);
  return list
  ;
}

async function getSubasta(id) {
  const db = getFirestore(app);
  let info;
  let docRef = doc(db, "Subastas", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    //console.log("Obra:" + Data[i].name + "-> " + docSnap.data().InSite);
    console.log(docSnap.data());
    info = {
      Id: docSnap.data().Id,
      PujaActual: docSnap.data().PujaActual,
      Started: docSnap.data().Started,
      Open: docSnap.data().Open,
      NumerodePujas: docSnap.data().NumerodePujas,
      WinnerWallet:docSnap.data().WinnerWallet,
      PujaActual:docSnap.data().PujaActual,
      
    };
    return info;
    console.log(info);
  } else console.log("no hay datos");

  console.log(info);
  return info;
}
export default app;
export { loadUserdata, getSubastasGestion, getSubastasUsers, getSubasta };
