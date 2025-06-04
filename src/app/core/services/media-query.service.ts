import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MediaQueryService {
  breakpointObserver = inject(BreakpointObserver);
  private isDesktopSignal = signal<boolean>(false);
  private readonly breakpointQuery = '(min-width: 768px)';

  constructor() {
    this.initializeDeviceDetection();
  }

  get isDesktop() {
    return this.isDesktopSignal;
  }

  private initializeDeviceDetection() {
    this.breakpointObserver
      .observe(this.breakpointQuery)
      .subscribe((result) => this.isDesktopSignal.set(result.matches));
  }

  observeMediaQuery(mediaQuery: string): Signal<boolean> {
    const mediaQuerySignal = signal<boolean>(false);

    this.breakpointObserver
      .observe(mediaQuery)
      .subscribe((result) => mediaQuerySignal.set(result.matches));

    return mediaQuerySignal;
  }
}
