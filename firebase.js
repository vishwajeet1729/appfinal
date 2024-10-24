// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import Auth module
import { getFirestore } from 'firebase/firestore'; // Import Firestore module
import { getStorage } from 'firebase/storage'; // Import Storage module

const firebaseConfig = {
  apiKey: "AIzaSyAnDHNh2YsuH-snXgrnEtxq9fRzRKlWETo",
  authDomain: "callrecording-82f2d.firebaseapp.com",
  projectId: "callrecording-82f2d",
  storageBucket: "callrecording-82f2d.appspot.com",
  messagingSenderId: "938700240561",
  appId: "1:938700240561:android:66f4617ff0912be7d2d490",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Initialize Auth
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

export { auth, db, storage };
