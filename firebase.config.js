// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApY36i-ThS0DZ0lOeXISSoCQUDJOAi_Us",
  authDomain: "ghc-growth-lab.firebaseapp.com",
  projectId: "ghc-growth-lab",
  storageBucket: "ghc-growth-lab.appspot.com",
  messagingSenderId: "771775156436",
  appId: "1:771775156436:web:7a8ba50a4661c3b3ec2b41",
  measurementId: "G-JGYNN4PV66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

export default db;