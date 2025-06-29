import { Routes } from '@angular/router';

export const routes: Routes = [
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
    redirectTo: 'posts',
    pathMatch: 'full',
  }
];
