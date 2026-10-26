import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

  const firebaseConfig = {
    apiKey: "AIzaSyAaXnQgj4pWWQuy7NrzrqPJkzHWr9OgyiM",
    authDomain: "programmerings-hjaelper.firebaseapp.com",
    databaseURL: "https://programmerings-hjaelper-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "programmerings-hjaelper",
    storageBucket: "programmerings-hjaelper.firebasestorage.app",
    messagingSenderId: "20825590379",
    appId: "1:20825590379:web:b451e52af8b54e33c9ff2e"
  };


const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);