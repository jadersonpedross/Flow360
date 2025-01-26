// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDicCUBGQcYiR7f3R2gqMM4f-bwwz1C7G4",
  authDomain: "flow360-app.firebaseapp.com",
  projectId: "flow360-app",
  storageBucket: "flow360-app.firebasestorage.app",
  messagingSenderId: "869351739950",
  appId: "1:869351739950:web:8ded9d0920eecf651f85bf",
  measurementId: "G-4808J6Y096"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider()

export { auth, db, googleProvider, sendPasswordResetEmail }
