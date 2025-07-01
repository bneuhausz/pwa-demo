import { Component, effect, inject } from "@angular/core";
import { NetworkConnectionService } from "../shared/network/network-connection.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-offline',
  template: `
    <h1>Offline</h1>
  `,
})
export default class OfflineComponent {
  private readonly networkConnectionService = inject(NetworkConnectionService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const hasConnection = this.networkConnectionService.hasConnection();
      if (hasConnection) {
        this.router.navigate(['/']);
      }
    });
  }
}
