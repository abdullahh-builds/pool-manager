
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDqO0RwyfyWrpy30__EfRWGL-f_CQLqRUo",
  authDomain: "pool-manager-f4960.firebaseapp.com",
  projectId: "pool-manager-f4960",
  storageBucket: "pool-manager-f4960.firebasestorage.app",
  messagingSenderId: "498425283450",
  appId: "1:498425283450:web:6844831aee106e12f90cc3",
  measurementId: "G-71K2HJ4482"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const POOL_DOC_ID = "main_pool_data";

/**
 * Sanitize error objects because Firebase internal errors often have 
 * circular references (to the transport layer or script tags) which 
 * causes "Converting circular structure to JSON" crashes in some environments.
 */
const sanitizeError = (error: any) => {
  return {
    code: error?.code || 'unknown',
    message: error?.message || 'An unexpected error occurred',
  };
};

/**
 * Ensures data passed to Firestore is a plain object without 
 * potential hidden properties or circularity.
 */
const toPlainObject = (data: any) => {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (e) {
    console.error("Plain object conversion failed", e);
    return data;
  }
};

export const streamPoolData = (callback: (data: any) => void, onError: (error: any) => void) => {
  return onSnapshot(
    doc(db, "pools", POOL_DOC_ID), 
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("Firestore Error:", error.code, error.message);
      onError(sanitizeError(error));
    }
  );
};

export const updatePoolData = async (data: any) => {
  try {
    const poolRef = doc(db, "pools", POOL_DOC_ID);
    await setDoc(poolRef, toPlainObject(data), { merge: true });
  } catch (e: any) {
    console.error("Firebase Update Error:", e.code, e.message);
    throw sanitizeError(e);
  }
};

export const resetPoolData = async (data: any) => {
  try {
    const poolRef = doc(db, "pools", POOL_DOC_ID);
    await setDoc(poolRef, toPlainObject(data), { merge: false }); // Overwrite completely
  } catch (e: any) {
    console.error("Firebase Reset Error:", e.code, e.message);
    throw sanitizeError(e);
  }
};
