import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCN2MJYgr2h7BIaudNh-J1NEdYxJG463hQ",
  authDomain: "same-age.firebaseapp.com",
  projectId: "same-age",
  storageBucket: "same-age.firebasestorage.app",
  messagingSenderId: "999759654319",
  appId: "1:999759654319:web:258f0c7067f7e79371d35a",
  measurementId: "G-DZXX7S0G7Q",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
