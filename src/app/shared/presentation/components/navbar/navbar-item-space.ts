import { ChangeDetectionStrategy, Component } from '@angular/core';

// quite shrink-0 en host class
@Component({
  selector: '[app-navbar-item-space]',
  imports: [],
  template: ` <ng-content> </ng-content> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'size-[var(--sidebar-item-size)] *:size-full',
  },
})
export class NavbarItemSpace {}
