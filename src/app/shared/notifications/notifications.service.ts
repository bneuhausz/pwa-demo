import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private readonly http = inject(HttpClient);

  addPushSubscriber(sub: PushSubscription) {
    return this.http.post('/api/subscribe', sub);
  }

  sendPushNotification() {
    return this.http.post('/api/send-push', null);
  }
}
