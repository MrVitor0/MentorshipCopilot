import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

// Connect to emulators in development
const isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.DEV

if (isDevelopment) {
  try {
    // Only connect if not already connected
    if (!auth._canInitEmulator === false) {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    }
  } catch {
    // Already connected
    console.log('Auth emulator already connected')
  }
  
  try {
    // Only connect if not already connected
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      connectFirestoreEmulator(db, '127.0.0.1', 8080)
    }
  } catch {
    // Already connected
    console.log('Firestore emulator already connected')
  }
  
  console.log('🔥 Firebase Emulators Connected')
  console.log('   Auth: http://127.0.0.1:9099')
  console.log('   Firestore: http://127.0.0.1:8080')
  console.log('   UI: http://127.0.0.1:4000')
}

export default app

