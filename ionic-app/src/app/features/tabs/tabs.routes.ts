import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'players',
        loadComponent: () =>
          import('../players/players.page').then((m) => m.PlayersPage),
      },
      {
        path: 'news',
        loadComponent: () =>
          import('../news/news.page').then((m) => m.NewsPage),
      },
      {
        path: 'ideal-team',
        loadComponent: () =>
          import('../ideal-team/ideal-team.page').then((m) => m.IdealTeamPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/tabs/players',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/players',
    pathMatch: 'full',
  },
];
