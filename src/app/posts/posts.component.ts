import { Component, inject } from "@angular/core";
import { PostsService } from "./data-access/posts.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-posts',
  template: `
    <h1>Posts <button routerLink="/">Home</button></h1>
    <ul>
      @for (post of postsService.posts.value(); track post.id) {
        <li [routerLink]="['/post', post.id]">
          <h2>{{ post.title }}</h2>
        </li>
      }
    </ul>
  `,
  imports: [RouterLink],
  providers: [PostsService],
})
export default class PostsComponent {
  readonly postsService = inject(PostsService);
}
