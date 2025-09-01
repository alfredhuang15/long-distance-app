import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdouziSKNMsPMUSr9Vrprot2lKXIqrPSo",
  authDomain: "long-distance-app-27146.firebaseapp.com",
  projectId: "long-distance-app-27146",
  storageBucket: "long-distance-app-27146.firebasestorage.app",
  messagingSenderId: "1075678503363",
  appId: "1:1075678503363:web:d4a8c55d85ad32573cdd76",
  measurementId: "G-L7STZ64P8G"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);