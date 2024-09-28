import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCJM31XBYAfxNsgJz4cOb_WzA0MDY4rWsg",
  authDomain: "letschat-e4104.firebaseapp.com",
  projectId: "letschat-e4104",
  storageBucket: "letschat-e4104.appspot.com",
  messagingSenderId: "667852671764",
  appId: "1:667852671764:web:d1efe9d6a37844b2539001"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app); // Ensure this is only declared once
const storage = getStorage(app);
const db = getFirestore(app);

// Export services
export { auth, storage, db, app };
