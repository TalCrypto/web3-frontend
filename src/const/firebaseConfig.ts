import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGESENDER,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
};

const firebaseApp = initializeApp(config);
const db = getFirestore(firebaseApp);

const firebaseAnalytics = firebaseApp.name && typeof window !== 'undefined' ? getAnalytics(firebaseApp) : null;
const firebaseAuth = firebaseApp.name && typeof window !== 'undefined' ? getAuth(firebaseApp) : null;

export { firebaseApp, db, firebaseAnalytics, firebaseAuth };
