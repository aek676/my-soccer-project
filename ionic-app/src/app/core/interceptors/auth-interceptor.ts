import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);

  const getToken = async (): Promise<string | null> => {
    return auth.currentUser?.getIdToken(true) ?? null;
  };

  return from(getToken()).pipe(
    switchMap((token) => {
      if (token) {
        const cloned = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
        return next(cloned);
      }
      return next(req);
    }),
  );
};
