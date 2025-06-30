import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h1>Welcome to pwa-demo - V10! <button (click)="reload()">reload</button></h1>

    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  private readonly swUpdate = inject(SwUpdate);

  constructor() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter(event => event.type === 'VERSION_READY'))
        .subscribe((event: VersionReadyEvent) => {
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
