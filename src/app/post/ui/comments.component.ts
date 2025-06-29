import { Component, input } from "@angular/core";
import { Comment } from "../comment.model";
import { CommentComponent } from "./comment.component";

@Component({
  selector: 'app-comments',
  template: `
    <h3>Comments</h3>
    @for (comment of comments(); track comment.id) {
      <app-comment [comment]="comment" />
    }
  `,
  imports: [CommentComponent],
})
export class CommentsComponent {
  comments = input<Comment[]>();
}
