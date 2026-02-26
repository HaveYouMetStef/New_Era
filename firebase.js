// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD97zCjkTFThhhPv94Qqfhiv2siawecSQ8",
    authDomain: "new-era-stats.firebaseapp.com",
    projectId: "new-era-stats",
    storageBucket: "new-era-stats.firebasestorage.app",
    messagingSenderId: "612223394483",
    appId: "1:612223394483:web:31c374314c791233c446c6"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);