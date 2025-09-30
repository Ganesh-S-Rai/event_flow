// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: 'studio-5721001047-bb966',
  appId: '1:537593132807:web:a2c1d5951060a86b56b7a2',
  apiKey: 'AIzaSyCwQta9Uedfon-Ng-5FYijLiHfMhe7oC2c',
  authDomain: 'studio-5721001047-bb966.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '537593132807',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
