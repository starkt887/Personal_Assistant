// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAibMSHVA-3YvcBZR-FrzF_BrtNL6dB1AA",
  authDomain: "jarvis--college-72553.firebaseapp.com",
  projectId: "jarvis--college-72553",
  storageBucket: "jarvis--college-72553.firebasestorage.app",
  messagingSenderId: "613363345515",
  appId: "1:613363345515:web:ab62854fe08e0588eca92e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const fireStore = getFirestore(app);
