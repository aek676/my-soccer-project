import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map, take } from 'rxjs';
import { FIREBASE_AUTH_FUNCTIONS } from '../tokens/firebase-auth.token';

export const redirectIfAuthenticated: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const { user } = inject(FIREBASE_AUTH_FUNCTIONS);

  return user(auth).pipe(
    take(1),
    map((user) => {
      if (user && !user.isAnonymous) {
        router.navigate(['/tabs']);
        return false;
      }
      return true;
    }),
  );
};
