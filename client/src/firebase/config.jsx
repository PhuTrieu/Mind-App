// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIUdSupeRxGsnYnf1ZPFYHkk9uKKDeohE",
  authDomain: "note-app-graphql-16d9b.firebaseapp.com",
  projectId: "note-app-graphql-16d9b",
  storageBucket: "note-app-graphql-16d9b.appspot.com",
  messagingSenderId: "870430811609",
  appId: "1:870430811609:web:1212ab9ec0f7a94a3be5c8",
  measurementId: "G-7RQZYMHHE0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);