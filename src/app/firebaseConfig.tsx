
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBe_vVrogN04TSG6Lm25OiGVWpO_eqv2jU",
  authDomain: "vaccine-app-3bad4.firebaseapp.com",
  projectId: "vaccine-app-3bad4",
  storageBucket: "vaccine-app-3bad4.appspot.com",
  messagingSenderId: "127341967057",
  appId: "1:127341967057:web:e4be00648ef503fd2b77f0",
  measurementId: "G-7V4KX7J37R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db= getFirestore(app);
const auth=getAuth(app);
export { app, auth, db };

