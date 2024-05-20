// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSoYk-OqY_p9ToHJaWvwWF4kXs5fPU6nQ",
  authDomain: "noteio-9c855.firebaseapp.com",
  projectId: "noteio-9c855",
  storageBucket: "noteio-9c855.appspot.com",
  messagingSenderId: "784644535987",
  appId: "1:784644535987:web:76fbac4d6ed6002bc9a2c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const auth = getAuth(app);
export { db };
export default app;
