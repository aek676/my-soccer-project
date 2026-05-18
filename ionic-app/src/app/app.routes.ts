import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/tabs/tabs.routes').then((m) => m.routes),
  },
];
