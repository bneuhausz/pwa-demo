import { Component, effect, inject, input } from "@angular/core";
import { PostService } from "./data-access/post.service";
import { RouterLink } from "@angular/router";
import { CommentsComponent } from "./ui/comments.component";

@Component({
  selector: 'app-post',
  template: `
    <button routerLink="/posts">Back to posts</button>
    @if (postService.post.value(); as post) {
      <h1>{{ post.title }}</h1>
      <p>{{ post.body }}</p>

      @if (postService.comments.value(); as comments) {
        <app-comments [comments]="comments" />
      }
    }

  `,
  providers: [PostService],
  imports: [RouterLink, CommentsComponent]
})
export default class PostComponent {
  readonly postService = inject(PostService);
  readonly id = input<number>();

  constructor() {
    effect(() => {
      const id = this.id();
      if (id) {
        this.postService.selectedPostId.set(id);
      }
    });
  }
}
