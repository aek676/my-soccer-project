import { Injectable, inject } from '@angular/core';
import {
  Auth,
  user,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from '@angular/fire/auth';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  currentUser$ = user(this.auth);

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  register(email: string, password: string, displayName: string) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(
        (credential) =>
          updateProfile(credential.user, { displayName }).then(
            () => credential,
          ),
      ),
    );
  }

  logout() {
    return from(signOut(this.auth));
  }
}
