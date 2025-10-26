import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  Timestamp,
  addDoc
} from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * FirestoreService - Service for handling all Firestore operations
 * Follows Single Responsibility Principle and provides clean abstraction
 */

// Collection names - centralized for easy maintenance
const COLLECTIONS = {
  USERS: 'users',
  MENTORSHIPS: 'mentorships',
  SESSIONS: 'sessions',
  ACTIVITIES: 'activities'
}

/**
 * USER OPERATIONS
 */

export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid)
    const data = {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      onboardingCompleted: userData.onboardingCompleted || false
    }
    
    await setDoc(userRef, data)
    return data
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw new Error('Error creating user profile')
  }
}

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return { uid, ...userSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

export const updateUserProfile = async (uid, updates) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid)
    const data = {
      ...updates,
      updatedAt: Timestamp.now()
    }
    
    await updateDoc(userRef, data)
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error('Error updating profile')
  }
}

export const completeOnboarding = async (uid, onboardingData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid)
    const data = {
      ...onboardingData,
      onboardingCompleted: true,
      updatedAt: Timestamp.now()
    }
    
    await updateDoc(userRef, data)
    return data
  } catch (error) {
    console.error('Error completing onboarding:', error)
    throw new Error('Error completing onboarding')
  }
}

/**
 * MENTOR/MENTEE QUERIES
 */

export const getMentors = async (filters = {}) => {
  try {
    let q = query(
      collection(db, COLLECTIONS.USERS),
      where('userType', '==', 'mentor')
    )

    // Apply filters if provided
    if (filters.technologies && filters.technologies.length > 0) {
      q = query(q, where('technologies', 'array-contains-any', filters.technologies))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting mentors:', error)
    return []
  }
}

export const getMentees = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.USERS),
      where('userType', '==', 'mentee')
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting mentees:', error)
    return []
  }
}

/**
 * MENTORSHIP OPERATIONS
 */

export const createMentorship = async (mentorshipData) => {
  try {
    const data = {
      ...mentorshipData,
      status: 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const docRef = await addDoc(collection(db, COLLECTIONS.MENTORSHIPS), data)
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating mentorship:', error)
    throw new Error('Error creating mentorship')
  }
}

export const getUserMentorships = async (uid) => {
  try {
    // Get mentorships where user is mentor or mentee
    const asMentor = query(
      collection(db, COLLECTIONS.MENTORSHIPS),
      where('mentorId', '==', uid),
      orderBy('createdAt', 'desc')
    )
    
    const asMentee = query(
      collection(db, COLLECTIONS.MENTORSHIPS),
      where('menteeId', '==', uid),
      orderBy('createdAt', 'desc')
    )

    const [mentorSnap, menteeSnap] = await Promise.all([
      getDocs(asMentor),
      getDocs(asMentee)
    ])

    const mentorships = [
      ...mentorSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), role: 'mentor' })),
      ...menteeSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), role: 'mentee' }))
    ]

    return mentorships
  } catch (error) {
    console.error('Error getting user mentorships:', error)
    return []
  }
}

/**
 * SESSION OPERATIONS
 */

export const createSession = async (sessionData) => {
  try {
    const data = {
      ...sessionData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const docRef = await addDoc(collection(db, COLLECTIONS.SESSIONS), data)
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating session:', error)
    throw new Error('Error creating session')
  }
}

export const getUpcomingSessions = async (uid, limitCount = 10) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.SESSIONS),
      where('participantIds', 'array-contains', uid),
      where('status', '==', 'scheduled'),
      orderBy('scheduledDate', 'asc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting upcoming sessions:', error)
    return []
  }
}

/**
 * ACTIVITY OPERATIONS
 */

export const getRecentActivities = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.ACTIVITIES),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting recent activities:', error)
    return []
  }
}

export const createActivity = async (activityData) => {
  try {
    const data = {
      ...activityData,
      createdAt: Timestamp.now()
    }
    
    const docRef = await addDoc(collection(db, COLLECTIONS.ACTIVITIES), data)
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating activity:', error)
    throw new Error('Error creating activity')
  }
}

/**
 * SMART SUGGESTIONS (AI-powered matching)
 */

export const getSmartSuggestions = async (uid) => {
  try {
    const userProfile = await getUserProfile(uid)
    
    if (!userProfile) return []

    // Get opposite user type (mentors for mentees, mentees for mentors)
    const targetType = userProfile.userType === 'mentor' ? 'mentee' : 'mentor'
    
    let q = query(
      collection(db, COLLECTIONS.USERS),
      where('userType', '==', targetType),
      limit(5)
    )

    // If user has technologies, try to match
    if (userProfile.technologies && userProfile.technologies.length > 0) {
      q = query(
        collection(db, COLLECTIONS.USERS),
        where('userType', '==', targetType),
        where('technologies', 'array-contains-any', userProfile.technologies.map(t => t.name || t)),
        limit(5)
      )
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting smart suggestions:', error)
    return []
  }
}

export { COLLECTIONS }

