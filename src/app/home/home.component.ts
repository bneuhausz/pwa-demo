import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  template: `
    <h1>Prerendered Home</h1>
    <button routerLink="/posts">Posts</button>
  `,
  imports: [RouterLink],
})
export default class HomeComponent {}
