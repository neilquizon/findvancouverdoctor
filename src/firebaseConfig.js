// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmFVi7OYNf9UtnV0jkUe09p3QKtcLDoYM",
  authDomain: "findvancouverdoctor.firebaseapp.com",
  projectId: "findvancouverdoctor",
  storageBucket: "findvancouverdoctor.appspot.com",
  messagingSenderId: "843242700270",
  appId: "1:843242700270:web:054bc1787b2748e938e2ff",
  measurementId: "G-P5NX2L77N2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);