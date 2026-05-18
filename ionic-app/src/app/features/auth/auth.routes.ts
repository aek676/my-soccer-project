import { Routes } from '@angular/router';
import { redirectIfAuthenticated } from '../../core/guards/redirect-if-authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
    canActivate: [redirectIfAuthenticated],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.page').then((m) => m.RegisterPage),
    canActivate: [redirectIfAuthenticated],
  },
];
