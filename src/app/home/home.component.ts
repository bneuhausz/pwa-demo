import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SwPush } from "@angular/service-worker";
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-home',
  template: `
    <h1>Prerendered Home</h1>
    <button routerLink="/posts">Posts</button>
    <button (click)="subscribe()">Subscribe</button>
  `,
  imports: [RouterLink],
})
export default class HomeComponent {
  private readonly swPush = inject(SwPush);

  subscribe() {
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: environment.vapidPublicKey,
      }).then(sub => {
        console.log('Subscription successful:', sub);
      }).catch(err => {
        console.error('Subscription failed:', err);
      });
    }
  }
}
