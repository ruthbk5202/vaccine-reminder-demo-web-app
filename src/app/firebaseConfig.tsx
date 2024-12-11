import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBe_vVrogN04TSG6Lm25OiGVWpO_eqv2jU",
  authDomain: "vaccine-app-3bad4.firebase.com",
  projectId: "vaccine-app-3bad4",
  storageBucket: "vaccine-app-3bad4.appspot.com",
  messagingSenderId: "127341967057",
  appId: "1:127341967057:web:e4be00648ef503fd2b77f0",
  measurementId: "G-7V4KX7J37R",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const messaging = getMessaging(app);
export { app, auth, db, messaging, storage };
