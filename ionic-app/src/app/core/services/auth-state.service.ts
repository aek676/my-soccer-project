import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap, from } from 'rxjs';
import { AuthService } from './auth.service';
import { UserRole } from '@core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private authService = inject(AuthService);

  role$: Observable<UserRole> = this.authService.currentUser$.pipe(
    switchMap((user) => {
      if (!user || user.isAnonymous) return from(Promise.resolve('guest' as UserRole));
      return from(user.getIdTokenResult()).pipe(
        map((token) => (token.claims['role'] as UserRole) || 'user'),
      );
    }),
  );

  isGuest$ = this.role$.pipe(map((role) => role === 'guest'));
  isAuthenticated$ = this.role$.pipe(map((role) => role !== 'guest'));
}
