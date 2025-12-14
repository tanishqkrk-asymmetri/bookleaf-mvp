// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4N45qW9Sj8hugExtehHdvASh7KtArEAU",
  authDomain: "bookleaf-34789.firebaseapp.com",
  projectId: "bookleaf-34789",
  storageBucket: "bookleaf-34789.firebasestorage.app",
  messagingSenderId: "771877186782",
  appId: "1:771877186782:web:e0404986425cd10f41e64f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
