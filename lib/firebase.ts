import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAcQ6nJJ7_nNPxfykfcUFretHhCl3fyILk',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'edualttech.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'edualttech',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'edualttech.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '6816166',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:6816166:web:edualttech',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-EDUALTTECH'
};

let authExport: any;
let dbExport: any;
let functionsExport: any;
let storageExport: any;
let appExport: any;

try {
    const app = initializeApp(firebaseConfig);
    appExport = app;
    authExport = getAuth(app);
    dbExport = getFirestore(app);
    functionsExport = getFunctions(app);
    storageExport = getStorage(app);
} catch (e) {
    console.warn("Firebase initialization failed, using mocks for preview:", e);
    authExport = {
        currentUser: null,
        onAuthStateChanged: (cb: any) => { cb(null); return () => { }; },
        signOut: async () => { }
    } as any;
    dbExport = {} as any;
    functionsExport = {} as any;
    storageExport = {} as any;
}

export const auth = authExport;
export const db = dbExport;
export const functions = functionsExport;
export const storage = storageExport;
export const app = appExport;
