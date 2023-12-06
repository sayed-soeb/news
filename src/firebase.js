// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyA5KOCmZNJ43Vtgvl5EQ48HvEwtNS3ga_0",
  authDomain: "shinchan-108fe.firebaseapp.com",
  projectId: "shinchan-108fe",
  storageBucket: "shinchan-108fe.appspot.com",
  messagingSenderId: "966539411853",
  appId: "1:966539411853:web:9314eb8e2ec56a4fc17dc4",
  measurementId: "G-KGY6EXNVJ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore(app);

export { app, auth, firestore };