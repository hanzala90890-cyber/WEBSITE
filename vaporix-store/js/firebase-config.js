/* ==========================================
   FIREBASE CONFIG - Vaporix Project
   ========================================== */

const firebaseConfig = {
  apiKey: "AIzaSyBwZygN0CmYd74OiPuIOtRNo1n42fDkNz4",
  authDomain: "vaporix-57e85.firebaseapp.com",
  projectId: "vaporix-57e85",
  storageBucket: "vaporix-57e85.firebasestorage.app",
  messagingSenderId: "208743324867",
  appId: "1:208743324867:web:068746f51e10f03e2a5676",
  measurementId: "G-ZMYH63X7ZX"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
const twitterProvider = new firebase.auth.TwitterAuthProvider();