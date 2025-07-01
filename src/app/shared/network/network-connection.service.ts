import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { NavigationError, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NetworkConnectionService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly online = signal(this.isBrowser ? navigator.onLine : true);
  private readonly router = inject(Router);

  readonly hasConnection = computed(() => this.online());

  constructor() {
    if (this.isBrowser) {
      window.addEventListener('online', () => this.online.set(true));
      window.addEventListener('offline', () => this.online.set(false));
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationError && !this.online()) {
        this.router.navigate(['/offline']);
      }
    });
  }
}
