import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SwPush } from "@angular/service-worker";
import { environment } from "../../environments/environment";
import { NotificationsService } from "../shared/notifications/notifications.service";

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
  private readonly notificationsService = inject(NotificationsService);

  subscribe() {
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: environment.vapidPublicKey,
      }).then(sub => {
        this.notificationsService.addPushSubscriber(sub).subscribe(res => console.log(res));
      }).catch(err => console.error('Subscription failed:', err));
    }
  }
}
