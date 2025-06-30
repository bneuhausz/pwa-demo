import { httpResource } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "../../shared/models/post.model";

@Injectable()
export class PostsService {
  posts = httpResource<Post[]>(
    'https://jsonplaceholder.typicode.com/posts',
  );
}
