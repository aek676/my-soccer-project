import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { UserRole } from '@shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private authService = inject(AuthService);

  role$: Observable<UserRole> = this.authService.currentUser$.pipe(
    map((user) => {
      if (!user || user.isAnonymous) {
        return 'guest';
      }
      return 'user';
    }),
  );

  isGuest$ = this.role$.pipe(map((role) => role === 'guest'));
  isAuthenticated$ = this.role$.pipe(map((role) => role !== 'guest'));
}
