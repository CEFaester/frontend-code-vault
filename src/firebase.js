// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'; // Vigtigt: Henter Realtime Database modulet

// Din unikke konfiguration fra Firebase Console
  const firebaseConfig = {
    apiKey: "AIzaSyAaXnQgj4pWWQuy7NrzrqPJkzHWr9OgyiM",
    authDomain: "programmerings-hjaelper.firebaseapp.com",
    databaseURL: "https://programmerings-hjaelper-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "programmerings-hjaelper",
    storageBucket: "programmerings-hjaelper.firebasestorage.app",
    messagingSenderId: "20825590379",
    appId: "1:20825590379:web:b451e52af8b54e33c9ff2e"
  };


// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Eksporter databasen, så den kan bruges i dine Vue-komponenter
export const db = getDatabase(app);