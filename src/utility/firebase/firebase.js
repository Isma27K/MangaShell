// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

// Function to register a new user with email and password
export const registerWithEmailAndPassword = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      createdAt: serverTimestamp(),
      bookmarkedManga: [],
      provider: 'email',
      ads: false // Adding ads flag for alpha testers
    });
    
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Function to sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// Function to sign in with Google popup
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    const userData = {
      username: user.displayName || user.email.split('@')[0],
      email: user.email,
      photoURL: user.photoURL,
      provider: 'google',
      lastLoginAt: serverTimestamp()
    };

    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(doc(db, "users", user.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        bookmarkedManga: [],
        ads: false // Adding ads flag for alpha testers
      });
    } else {
      // Update existing user's data but don't override the ads flag
      await updateDoc(doc(db, "users", user.uid), userData);
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Function to get user data
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Function to update user profile
export const updateUserProfile = async (userId, updateData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Function to sign out user
export const signOutUser = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

// Function to add manga to user's collection
export const addMangaToCollection = async (userId, mangaId) => {
  if (!userId) throw new Error('User ID is required');
  if (!mangaId) throw new Error('Manga ID is required');

  try {
    console.log('Starting addMangaToCollection...');
    const userRef = doc(db, 'users', userId);
    
    // First, verify the document exists
    const userDoc = await getDoc(userRef);
    console.log('User document exists:', userDoc.exists());
    
    if (!userDoc.exists()) {
      // Create the document if it doesn't exist
      await setDoc(userRef, {
        bookmarkedManga: [mangaId],
        createdAt: serverTimestamp()
      });
      console.log('Created new user document with manga');
      return;
    }

    // Get current bookmarks
    const currentData = userDoc.data();
    console.log('Current user data:', currentData);
    
    const bookmarkedManga = currentData.bookmarkedManga || [];
    if (!bookmarkedManga.includes(mangaId)) {
      const newBookmarkedManga = [...bookmarkedManga, mangaId];
      console.log('Updating bookmarks:', newBookmarkedManga);
      
      await updateDoc(userRef, {
        bookmarkedManga: newBookmarkedManga,
        lastUpdated: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error in addMangaToCollection:', error);
    throw new Error(`Failed to add manga: ${error.message}`);
  }
};

// Function to remove manga from user's collection
export const removeMangaFromCollection = async (userId, mangaId) => {
  if (!userId) throw new Error('User ID is required');
  if (!mangaId) throw new Error('Manga ID is required');

  try {
    console.log('Starting removeMangaFromCollection...');
    const userRef = doc(db, 'users', userId);
    
    const userDoc = await getDoc(userRef);
    console.log('User document exists:', userDoc.exists());
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    const currentData = userDoc.data();
    console.log('Current user data:', currentData);
    
    const bookmarkedManga = currentData.bookmarkedManga || [];
    const newBookmarkedManga = bookmarkedManga.filter(id => id !== mangaId);
    
    console.log('Updating bookmarks:', newBookmarkedManga);
    await updateDoc(userRef, {
      bookmarkedManga: newBookmarkedManga,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error in removeMangaFromCollection:', error);
    throw new Error(`Failed to remove manga: ${error.message}`);
  }
};

// Add this function to verify and initialize user document if needed
export const verifyUserDocument = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Initialize user document if it doesn't exist
      await setDoc(userRef, {
        createdAt: serverTimestamp(),
        bookmarkedManga: [],
        lastUpdated: serverTimestamp()
      });
      console.log('Created new user document');
    }
  } catch (error) {
    console.error('Error verifying user document:', error);
    throw error;
  }
};

// Export auth instance for use in other parts of the app
export { auth, db, storage };