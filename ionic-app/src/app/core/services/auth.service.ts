import { Injectable, inject } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { from } from 'rxjs';
import { FIREBASE_AUTH_FUNCTIONS } from '../tokens/firebase-auth.token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private authFns = inject(FIREBASE_AUTH_FUNCTIONS);
  currentUser$ = this.authFns.user(this.auth);

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  login(email: string, password: string) {
    return from(
      this.authFns.signInWithEmailAndPassword(this.auth, email, password),
    );
  }

  register(email: string, password: string, displayName: string) {
    return from(
      this.authFns
        .createUserWithEmailAndPassword(this.auth, email, password)
        .then((credential) =>
          this.authFns
            .updateProfile(credential.user, { displayName })
            .then(() => credential),
        ),
    );
  }

  logout() {
    return from(this.authFns.signOut(this.auth));
  }
}
