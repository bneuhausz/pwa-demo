import { Component, input } from "@angular/core";
import { Comment } from "../comment.model";

@Component({
  selector: 'app-comment',
  template: `
    <article>
      <h4>{{ comment().name }}</h4>
      <p><strong>Email:</strong> {{ comment().email }}</p>
      <p>{{ comment().body }}</p>
    </article>
  `,
  styles: `
    article {
      border: 1px solid #ccc;
      padding: 10px;
      margin: 10px 0;
    }
  `,
})
export class CommentComponent {
  comment = input.required<Comment>();
}
