// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from  "firebase/firestore";
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0nHoQ6Y5uggghaPuEOkbcgtUvlRzSZlY",
  authDomain: "inventory-app-96c53.firebaseapp.com",
  projectId: "inventory-app-96c53",
  storageBucket: "inventory-app-96c53.appspot.com",
  messagingSenderId: "16908049603",
  appId: "1:16908049603:web:cf6d7724aee4ed55485676",
  measurementId: "G-4KD2R0Q0S2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export {firestore, storage};