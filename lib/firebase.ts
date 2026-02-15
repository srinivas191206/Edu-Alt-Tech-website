
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMOP6HZrWAlRKjOEL8R_IPS1Pju77aDks",
  authDomain: "edu-alt-tech.firebaseapp.com",
  projectId: "edu-alt-tech",
  storageBucket: "edu-alt-tech.firebasestorage.app",
  messagingSenderId: "7813859348",
  appId: "1:7813859348:web:dae41c2186594c17a33f01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
