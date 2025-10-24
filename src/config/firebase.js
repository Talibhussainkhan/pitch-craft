
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "pitch-craft-71f21.firebaseapp.com",
  projectId: "pitch-craft-71f21",
  storageBucket: "pitch-craft-71f21.firebasestorage.app",
  messagingSenderId: "742723851785",
  appId: "1:742723851785:web:4410dedcfa4ade949d0ad8"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
