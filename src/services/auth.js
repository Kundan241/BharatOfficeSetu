import { 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth';
import { auth, firebaseConfig } from '../firebase';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    let errorMessage = "Failed to log in";
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      errorMessage = "Invalid email or password";
    }
    return { error: errorMessage };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};

export const createClientAccount = async (email, password) => {
  try {
    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp" + Date.now());
    const secondaryAuth = getAuth(secondaryApp);
    const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    await signOut(secondaryAuth);
    return { user: userCredential.user };
  } catch (error) {
    return { error: error.message };
  }
};

export const sendSetPasswordEmail = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: window.location.origin + '/login',
      handleCodeInApp: false
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const onAuthStateChanged = (callback) => {
  return firebaseOnAuthStateChanged(auth, callback);
};
