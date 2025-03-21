import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAz0MdUTgFX660gXhhB4eOGiDA8FFkw1FY",
  authDomain: "brainmeal-9923f.firebaseapp.com",
  projectId: "brainmeal-9923f",
  storageBucket: "brainmeal-9923f.appspot.com",
  messagingSenderId: "641061515416",
  appId: "1:641061515416:web:b601dbfbdfaf87364c60ed",
  measurementId: "G-WML4ZGKXW9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 