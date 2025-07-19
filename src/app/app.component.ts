import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { NetworkConnectionService } from './shared/network/network-connection.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h1>
      Welcome to pwa-demo - V27!
      @if (isNewVersionReady()) {
        <span>🆕 New version available! Please reload the application.</span>
      }
      <button (click)="reload()">reload</button>
      @if (!networkConnectionService.hasConnection()) {
        <span>🚫 Offline</span>
      }
    </h1>

    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  private readonly swUpdate = inject(SwUpdate);
  readonly networkConnectionService = inject(NetworkConnectionService);

  isNewVersionReady = signal<boolean>(false);

  constructor() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter(event => event.type === 'VERSION_READY'))
        .subscribe((event: VersionReadyEvent) => {
          this.isNewVersionReady.set(true);
          if (confirm('A new version is available. Load New Version?')) {
            this.reload();
          }
        });
    }
  }

  reload() {
    window.location.reload();
  }
}
