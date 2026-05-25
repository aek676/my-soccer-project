import { Injectable, inject } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { FIREBASE_AUTH_FUNCTIONS } from '../tokens/firebase-auth.token';
import { UserProfileService } from './user-profile.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private authFns = inject(FIREBASE_AUTH_FUNCTIONS);
  private userProfileService = inject(UserProfileService);
  currentUser$ = this.authFns.user(this.auth);

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  login(email: string, password: string) {
    return from(
      this.authFns.signInWithEmailAndPassword(this.auth, email, password),
    );
  }

  loginAsGuest() {
    return from(this.authFns.signInAnonymously(this.auth)).pipe(
      switchMap((credential) =>
        from(this.userProfileService.createProfile(credential.user, 'guest')),
      ),
    );
  }

  register(email: string, password: string, username: string) {
    return from(
      this.authFns
        .createUserWithEmailAndPassword(this.auth, email, password)
        .then((credential) =>
          this.authFns
            .updateProfile(credential.user, { displayName: username })
            .then(() => credential),
        ),
    ).pipe(
      switchMap((credential) =>
        from(
          this.userProfileService.createProfile(credential.user, 'user'),
        ).pipe(
          tap(() => {
            if (credential.user) {
              credential.user = Object.assign(credential.user, {
                displayName: username,
              });
            }
          }),
        ),
      ),
    );
  }

  logout() {
    return from(this.authFns.signOut(this.auth));
  }
}
