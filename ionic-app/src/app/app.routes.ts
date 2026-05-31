import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
    canActivate: [authGuard],
  },
  {
    path: 'import-players',
    loadComponent: () =>
      import('./features/players/import-players/import-players.page').then(
        (m) => m.ImportPlayersPage,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'profile-player/:id',
    loadComponent: () =>
      import('./features/players/profile-player/profile-player.page').then(
        (m) => m.ProfilePlayerPage,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'create-news',
    loadComponent: () =>
      import('./features/news/create-news/create-news.page').then(
        (m) => m.CreateNewsPage,
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
  {
    path: 'create-player',
    loadComponent: () => import('./features/players/create-player/create-player.page').then( m => m.CreatePlayerPage)
  },
];
