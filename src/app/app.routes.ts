import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'posts',
    loadComponent: () => import('./posts/posts.component'),
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./post/post.component'),
  },
  {
    path: 'offline',
    loadComponent: () => import('./offline/offline.component'),
  },
  {
    path: 'data-matrix-scanner',
    loadComponent: () => import('./data-matrix-scanner/data-matrix-scanner.component'),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
];
