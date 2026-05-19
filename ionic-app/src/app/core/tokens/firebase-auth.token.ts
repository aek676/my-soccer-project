import { InjectionToken } from '@angular/core';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
  signInAnonymously,
} from '@angular/fire/auth';

export interface FirebaseAuthFunctions {
  signInWithEmailAndPassword: typeof signInWithEmailAndPassword;
  createUserWithEmailAndPassword: typeof createUserWithEmailAndPassword;
  signOut: typeof signOut;
  updateProfile: typeof updateProfile;
  user: typeof user;
  signInAnonymously: typeof signInAnonymously;
}

export const FIREBASE_AUTH_FUNCTIONS = new InjectionToken<FirebaseAuthFunctions>('Firebase Auth Functions', {
  providedIn: 'root',
  factory: () => ({
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    user,
    signInAnonymously,
  }),
});
