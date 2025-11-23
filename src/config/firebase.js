import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "mentorship-copilot.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mentorship-copilot",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "mentorship-copilot.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Connect to emulators in development
const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true";

if (useEmulators) {
  try {
    // Only connect if not already connected
    if (!auth._canInitEmulator === false) {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", {
        disableWarnings: true,
      });
    }
  } catch {
    // Already connected
    console.log("Auth emulator already connected");
  }

  try {
    // Only connect if not already connected
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
    }
  } catch {
    // Already connected
    console.log("Firestore emulator already connected");
  }

  try {
    // Connect Functions emulator
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  } catch {
    // Already connected
    console.log("Functions emulator already connected");
  }

  try {
    // Connect Storage emulator
    connectStorageEmulator(storage, "127.0.0.1", 9199);
  } catch {
    // Already connected
    console.log("Storage emulator already connected");
  }

  console.log("🔥 Firebase Emulators Connected");
  console.log("   Auth: http://127.0.0.1:9099");
  console.log("   Firestore: http://127.0.0.1:8080");
  console.log("   Functions: http://127.0.0.1:5001");
  console.log("   Storage: http://127.0.0.1:9199");
  console.log("   UI: http://127.0.0.1:4000");
} else {
  console.log("🌐 Using Firebase Production Services");
}

export default app;
