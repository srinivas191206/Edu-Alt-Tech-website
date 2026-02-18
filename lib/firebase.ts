import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.API_KEY || "mock-api-key",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "mock-auth-domain",
    projectId: process.env.FIREBASE_PROJECT_ID || "mock-project-id",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "mock-storage-bucket",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "mock-sender-id",
    appId: process.env.FIREBASE_APP_ID || "mock-app-id"
};

let authExport: any;
let dbExport: any;

try {
    const app = initializeApp(firebaseConfig);
    authExport = getAuth(app);
    dbExport = getFirestore(app);
} catch (e) {
    console.warn("Firebase initialization failed, using mocks for preview:", e);
    authExport = {
        currentUser: null,
        onAuthStateChanged: (cb: any) => { cb(null); return () => { }; },
        signOut: async () => { }
    } as any;
    dbExport = {} as any;
}

export const auth = authExport;
export const db = dbExport;
