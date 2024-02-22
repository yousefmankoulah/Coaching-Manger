// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "onlinecoaching-a87c5.firebaseapp.com",
  projectId: "onlinecoaching-a87c5",
  storageBucket: "onlinecoaching-a87c5.appspot.com",
  messagingSenderId: "855843127316",
  appId: "1:855843127316:web:70571f4f0ed562ce37a701",
  measurementId: "G-EN8D3PYZNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);