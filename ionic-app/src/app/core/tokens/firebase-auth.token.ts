import { InjectionToken } from '@angular/core';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';

export interface FirebaseAuthFunctions {
  signInWithEmailAndPassword: typeof signInWithEmailAndPassword;
  createUserWithEmailAndPassword: typeof createUserWithEmailAndPassword;
  signOut: typeof signOut;
  updateProfile: typeof updateProfile;
  user: typeof user;
}

export const FIREBASE_AUTH_FUNCTIONS = new InjectionToken<FirebaseAuthFunctions>('Firebase Auth Functions', {
  providedIn: 'root',
  factory: () => ({
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    user,
  }),
});
