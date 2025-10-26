/**
 * Seed Script for Firebase Emulators
 * Run this to populate the emulators with test data
 * 
 * Usage: npm run seed
 */

import * as admin from 'firebase-admin';
import { seedUsers, seedMentorships, seedMeetings } from './seedData';

// CRITICAL: Set emulator environment variables BEFORE initializing Admin SDK
// This prevents the SDK from trying to authenticate with production
const FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
const AUTH_EMULATOR_HOST = '127.0.0.1:9099';
const PROJECT_ID = 'mentorship-copilot';

process.env.FIRESTORE_EMULATOR_HOST = FIRESTORE_EMULATOR_HOST;
process.env.FIREBASE_AUTH_EMULATOR_HOST = AUTH_EMULATOR_HOST;
process.env.GCLOUD_PROJECT = PROJECT_ID;

console.log('🔧 Emulator Configuration:');
console.log(`   FIRESTORE_EMULATOR_HOST: ${process.env.FIRESTORE_EMULATOR_HOST}`);
console.log(`   FIREBASE_AUTH_EMULATOR_HOST: ${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
console.log(`   PROJECT_ID: ${PROJECT_ID}\n`);

// Initialize Firebase Admin with minimal config for emulators
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: PROJECT_ID,
  });
}

const auth = admin.auth();
const db = admin.firestore();

// Configure Firestore settings for emulator
db.settings({
  host: FIRESTORE_EMULATOR_HOST,
  ssl: false,
  ignoreUndefinedProperties: true,
});

async function clearExistingData() {
  console.log('🧹 Clearing existing data...');
  
  try {
    // Clear Firestore collections
    const collections = ['users', 'mentorships', 'meetings', 'mentorship_invitations'];
    
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log(`  ✓ Cleared ${collectionName} collection`);
    }

    // Note: Auth users cannot be easily cleared in bulk via Admin SDK
    // The emulator resets when restarted
    
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

async function seedAuthUsers() {
  console.log('\n👤 Creating Auth users...');
  
  for (const user of seedUsers) {
    try {
      // Check if user exists
      try {
        await auth.getUser(user.uid);
        console.log(`  ℹ User ${user.email} already exists, skipping...`);
        continue;
      } catch (error: any) {
        if (error.code !== 'auth/user-not-found') {
          throw error;
        }
      }

      // Create user in Auth
      // In the emulator, users can sign in with email/password OR use "Add account" 
      // in the emulator UI to simulate Google sign-in
      await auth.createUser({
        uid: user.uid,
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: true,
      });

      console.log(`  ✓ Created ${user.userType}: ${user.displayName} (${user.email})`);
    } catch (error: any) {
      if (error.code === 'auth/uid-already-exists') {
        console.log(`  ℹ User ${user.email} already exists`);
      } else {
        console.error(`  ✗ Error creating user ${user.email}:`, error.message);
      }
    }
  }
}

async function seedFirestoreUsers() {
  console.log('\n📚 Creating Firestore user documents...');
  
  try {
    const batch = db.batch();
    
    for (const user of seedUsers) {
      const { password, ...userDataWithoutPassword } = user;
      const userRef = db.collection('users').doc(user.uid);
      
      console.log(`  📝 Preparing user document: ${user.email} (${user.uid})`);
      
      batch.set(userRef, {
        ...userDataWithoutPassword,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    
    console.log('  💾 Committing batch write to Firestore...');
    await batch.commit();
    console.log(`  ✓ Created ${seedUsers.length} user documents in Firestore`);
    
    // Verify the data was written
    const usersSnapshot = await db.collection('users').get();
    console.log(`  ✓ Verified: ${usersSnapshot.size} documents in 'users' collection`);
  } catch (error) {
    console.error('  ✗ Error creating Firestore user documents:', error);
    throw error;
  }
}

async function seedMentorshipsData() {
  console.log('\n🤝 Creating mentorships...');
  
  try {
    const batch = db.batch();
    
    for (const mentorship of seedMentorships) {
      const mentorshipRef = db.collection('mentorships').doc(mentorship.id);
      batch.set(mentorshipRef, mentorship);
    }
    
    await batch.commit();
    console.log(`  ✓ Created ${seedMentorships.length} mentorships`);
    
    // Verify the data was written
    const mentorshipsSnapshot = await db.collection('mentorships').get();
    console.log(`  ✓ Verified: ${mentorshipsSnapshot.size} documents in 'mentorships' collection`);
  } catch (error) {
    console.error('  ✗ Error creating mentorships:', error);
    throw error;
  }
}

async function seedMeetingsData() {
  console.log('\n📅 Creating meetings...');
  
  try {
    const batch = db.batch();
    
    for (const meeting of seedMeetings) {
      const meetingRef = db.collection('meetings').doc(meeting.id);
      batch.set(meetingRef, meeting);
    }
    
    await batch.commit();
    console.log(`  ✓ Created ${seedMeetings.length} meetings`);
    
    // Verify the data was written
    const meetingsSnapshot = await db.collection('meetings').get();
    console.log(`  ✓ Verified: ${meetingsSnapshot.size} documents in 'meetings' collection`);
  } catch (error) {
    console.error('  ✗ Error creating meetings:', error);
    throw error;
  }
}

async function runSeed() {
  console.log('🌱 Starting seed process...\n');
  console.log('📍 Using emulators:');
  console.log(`   Auth: http://127.0.0.1:9099`);
  console.log(`   Firestore: http://127.0.0.1:8080\n`);

  try {
    await clearExistingData();
    await seedAuthUsers();
    await seedFirestoreUsers();
    await seedMentorshipsData();
    await seedMeetingsData();

    console.log('\n✅ Seed completed successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Test Credentials');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔐 Authentication Options:');
    console.log('   • Email/Password: Use the credentials below');
    console.log('   • Google Sign-In: Use "Add account" in Auth Emulator UI (http://127.0.0.1:4000/auth)');
    console.log('\n📊 PROJECT MANAGERS:');
    console.log('  • pm1@bairesdev.com / password123 (Sarah Johnson)');
    console.log('  • pm2@bairesdev.com / password123 (Michael Chen)');
    console.log('\n👨‍🏫 MENTORS:');
    console.log('  • mentor1@bairesdev.com / password123 (Dr. Emily Rodriguez - React/Node.js)');
    console.log('  • mentor2@bairesdev.com / password123 (James Wilson - AWS/Python)');
    console.log('  • mentor3@bairesdev.com / password123 (Maria Garcia - Mobile Dev)');
    console.log('  • mentor4@bairesdev.com / password123 (David Kim - Frontend)');
    console.log('  • mentor5@bairesdev.com / password123 (Alex Thompson - Backend)');
    console.log('\n🎓 MENTEES:');
    console.log('  • mentee1@bairesdev.com / password123 (Jessica Martinez)');
    console.log('  • mentee2@bairesdev.com / password123 (Ryan Patel)');
    console.log('  • mentee3@bairesdev.com / password123 (Sophie Anderson)');
    console.log('  • mentee4@bairesdev.com / password123 (Carlos Mendez)');
    console.log('  • mentee5@bairesdev.com / password123 (Emma Taylor)');
    console.log('\n🌐 Emulator UI: http://127.0.0.1:4000');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run the seed
runSeed();

