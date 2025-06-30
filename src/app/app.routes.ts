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
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
];
