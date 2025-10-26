import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { createUserProfile, getUserProfile } from './firestoreService'

const googleProvider = new GoogleAuthProvider()

/**
 * AuthService - Service for handling all authentication operations
 * Follows Single Responsibility Principle
 */
class AuthService {
  /**
   * Register a new user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} displayName - User display name
   * @returns {Promise<Object>} User object
   */
  async registerWithEmail(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Update profile with display name
      await updateProfile(user, { displayName })
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    } catch (error) {
      throw this._handleAuthError(error)
    }
  }

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User object
   */
  async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return this._formatUser(userCredential.user)
    } catch (error) {
      throw this._handleAuthError(error)
    }
  }

  /**
   * Sign in with Google
   * @returns {Promise<Object>} User object with isNewUser flag
   */
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Check if user profile exists in Firestore
      const userProfile = await getUserProfile(user.uid)
      const isNewUser = !userProfile
      
      // If new user, create basic profile
      if (isNewUser) {
        await createUserProfile(user.uid, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          onboardingCompleted: false
        })
      }
      
      return {
        ...this._formatUser(user),
        isNewUser
      }
    } catch (error) {
      throw this._handleAuthError(error)
    }
  }

  /**
   * Sign out current user
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await signOut(auth)
    } catch (error) {
      throw this._handleAuthError(error)
    }
  }

  /**
   * Get current authenticated user
   * @returns {Object|null} User object or null
   */
  getCurrentUser() {
    return auth.currentUser ? this._formatUser(auth.currentUser) : null
  }

  /**
   * Subscribe to auth state changes
   * @param {Function} callback - Callback function to handle auth state changes
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Firestore
        const userProfile = await getUserProfile(user.uid)
        callback({
          ...this._formatUser(user),
          ...userProfile
        })
      } else {
        callback(null)
      }
    })
  }

  /**
   * Format Firebase user object to simplified format
   * @private
   */
  _formatUser(user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
  }

  /**
   * Handle authentication errors and return user-friendly messages
   * @private
   */
  _handleAuthError(error) {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already in use',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/weak-password': 'Password is too weak. Use at least 6 characters',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'User not found',
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-credential': 'Invalid credentials',
      'auth/popup-closed-by-user': 'Login cancelled',
      'auth/cancelled-popup-request': 'Login cancelled'
    }

    const message = errorMessages[error.code] || 'Authentication error. Please try again.'
    
    return new Error(message)
  }
}

// Export singleton instance
export default new AuthService()

