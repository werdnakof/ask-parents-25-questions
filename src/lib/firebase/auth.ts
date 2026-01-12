import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string, displayName: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // Update the user's display name
  await updateProfile(userCredential.user, { displayName });

  return userCredential.user;
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Sign in with Google
export async function signInWithGoogle() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential.user;
}

// Sign out
export async function signOut() {
  await firebaseSignOut(auth);
}

// Send password reset email
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
