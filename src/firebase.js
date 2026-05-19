import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQi6qUmONUo6aUNzn6sNkpSLJxX1XLeaQ",
  authDomain: "bos-client-b04b2.firebaseapp.com",
  projectId: "bos-client-b04b2",
  storageBucket: "bos-client-b04b2.firebasestorage.app",
  messagingSenderId: "560710290890",
  appId: "1:560710290890:web:f97418ede70dc1270b9333",
  measurementId: "G-426LQJX48B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
