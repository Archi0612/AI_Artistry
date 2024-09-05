// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAq9w101D2vfPTI6h6FMfnE40I4UWJyVSw",
  authDomain: "ai-image-df6e1.firebaseapp.com",
  projectId: "ai-image-df6e1",
  storageBucket: "ai-image-df6e1.appspot.com",
  messagingSenderId: "880018109640",
  appId: "1:880018109640:web:168e55fb64af5890f2e1fd",
  measurementId: "G-HFC4XLVFXH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();