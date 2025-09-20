// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDahWNKWfhozuMGrqtyW61kghiGW0r_Leg",
  authDomain: "book-shelf-d5646.firebaseapp.com",
  projectId: "book-shelf-d5646",
  storageBucket: "book-shelf-d5646.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:200510108616:web:745536b0f373e2ed0e06fd",
  measurementId: "G-1A2B3C4D5E",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
