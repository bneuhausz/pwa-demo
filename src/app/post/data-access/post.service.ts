import { httpResource } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Post } from "../../shared/models/post.model";
import { Comment } from "../comment.model";

@Injectable()
export class PostService {
  selectedPostId = signal<number | null>(null);

  post = httpResource<Post>(() => {
    const id = this.selectedPostId();
    if (!id) {
      return;
    }
    return `https://jsonplaceholder.typicode.com/posts/${id}`;
  });

  comments = httpResource<Comment[]>(() => {
    const id = this.selectedPostId();
    if (!id) {
      return;
    }
    return `https://jsonplaceholder.typicode.com/posts/${id}/comments`;
  });
}
