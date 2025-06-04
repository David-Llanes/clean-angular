import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NavigationGroup } from '@core/config/constants/nav-bar-items';
import { NavbarGroup } from './navbar-group';

@Component({
  selector: 'app-navbar',
  imports: [NavbarGroup],
  template: `
    @for (group of navigationGroups(); track group.sectionKey) {
    <app-navbar-group
      [showGroupTitle]="isCollapsed()"
      [groupTitle]="group.sectionKey"
      [items]="group.items"
    />
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col h-full',
  },
})
export class Navbar {
  navigationGroups = input<NavigationGroup[]>([]);
  isCollapsed = input<boolean>(false);
}

// TODO: ENCONTAR UNA FORMA QUE EL Navbar NO DEPENDA DE SI ESTA COLAPSADO O NO

// TODO: ELIMINAR POR COMPLETO LA DEPENDENCIA DEL isCollapsed en todooooos los componentes de navbar.
