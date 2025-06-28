// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmQsYus1hV8xE5Hq-MDc_v63S4jY403Q0",
  authDomain: "broker-22d21.firebaseapp.com",
  projectId: "broker-22d21",
  storageBucket: "broker-22d21.firebasestorage.app",
  messagingSenderId: "905338469223",
  appId: "1:905338469223:web:b47eb4363a1114021b4dc2",
  measurementId: "G-TKPT3K17Y2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();