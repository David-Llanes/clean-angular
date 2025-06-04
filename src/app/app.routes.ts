import { Routes } from '@angular/router';
import { MainLayout } from '@layouts/main-layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/presentation/dashboard.routes'),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./pages/not-found').then((m) => m.NotFound),
      },
    ],
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized').then((m) => m.Unauthorized),
  },
];
