import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MenuItem } from '@core/config/constants/nav-bar-items';
import { NavbarNode } from './navbar-node';

@Component({
  selector: 'app-navbar-group',
  imports: [NavbarNode, NgClass],
  template: `
    <span
      class="text-muted-foreground list-none overflow-hidden text-[10px] font-bold uppercase transition-all duration-200"
      [ngClass]="
        showGroupTitle()
          ? 'max-h-0 py-0 opacity-0'
          : 'mt-4 mb-1 max-h-8 opacity-100'
      "
    >
      {{ groupTitle() }}
    </span>

    <ul class="grid">
      @for (item of items(); track item.key) {
      <app-navbar-node [isCollapsed]="showGroupTitle()" [item]="item" />
      }
    </ul>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grid',
  },
})
export class NavbarGroup {
  showGroupTitle = input<boolean>(true);

  groupTitle = input<string>();
  items = input<MenuItem[]>([]);
}
