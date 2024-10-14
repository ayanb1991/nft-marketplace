import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export const auth = getAuth(app);

export const isAuthenticated = () => {
  const auth = getAuth();
  console.log("auth.currentUser:", auth.currentUser);

  const isAuthenticated = auth.currentUser !== null;
  return isAuthenticated;
};

export const createAccount = async (email, password, fullName, eoaAddress) => {

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store additional user metadata in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName: fullName,
      eoaAddress: eoaAddress,
      email: email,
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const fetchUserData = async (uid) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data() : null;
};
