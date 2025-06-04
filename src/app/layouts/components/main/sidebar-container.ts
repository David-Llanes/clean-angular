import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MainLayoutService } from '@core/application/services/main-layout/main-layout.service';
import {
  SidebarCollapsible,
  SidebarDesktopState,
  SidebarMode,
  SidebarVariant,
} from '@core/application/services/main-layout/main-layout.types';
import { NAVIGATION_GROUPS } from '@core/config/constants/nav-bar-items';
import { Navbar } from '@shared/presentation/components/navbar/navbar';
import { NavbarItem } from '@shared/presentation/components/navbar/navbar-item';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from './sidebar';

@Component({
  selector: 'app-sidebar-container',
  imports: [
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    Navbar,
    NavbarItem,
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <app-sidebar>
      <app-sidebar-header class="h-[var(--sidebar-width-icon)]">
        <header class="h-full content-center">HEADER</header>
      </app-sidebar-header>

      <app-sidebar-content>
        <app-navbar
          [isCollapsed]="isCollapsed()"
          [navigationGroups]="navigationGroups"
        />
      </app-sidebar-content>

      <app-sidebar-footer class="h-[var(--sidebar-width-icon)]">
        <footer class="h-full content-center overflow-hidden">
          <a
            app-navbar-item
            [icon]="icon"
            [button]="button"
            [isCollapsed]="isCollapsed()"
            label="Configuración"
            [routerLink]="'settings'"
            routerLinkActive="text-primary hover:bg-transparent font-semibold"
            class="text-sm"
          >
            <ng-template #icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="mx-auto transition-[rotate] hover:rotate-45"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z"
                />
              </svg>
            </ng-template>

            <ng-template #button>
              <button class="cursor-pointer p-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-full"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                  <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                </svg>
              </button>
            </ng-template>
          </a>
        </footer>
      </app-sidebar-footer>
    </app-sidebar>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'group peer text-foreground',
    '[attr.data-side]': '"left"',
    '[attr.data-variant]': 'dataVariant()',
    '[attr.data-mode]': 'dataMode()',
    '[attr.data-state]': 'dataState()',
    '[attr.data-collapsible]': 'dataCollapsible()',
    '[attr.data-layout]': 'dataLayout()',
  },
})
export class SidebarContainer {
  private mainLayoutService = inject(MainLayoutService);

  navigationGroups = NAVIGATION_GROUPS;

  dataLayout = this.mainLayoutService.overallLayoutMode;

  dataVariant = computed<SidebarVariant | ''>(() => {
    return this.mainLayoutService.sidebarVariant() ?? '';
  });

  dataMode = computed<SidebarMode | ''>(() => {
    if (this.mainLayoutService.isSidebarEffectivelyOverlay()) return 'overlay';
    if (this.mainLayoutService.isSidebarEffectivelyStatic()) return 'static';

    return '';
  });

  dataState = computed<SidebarDesktopState>(() => {
    const isExpanded =
      this.mainLayoutService.isSidebarDesktopStaticOpen() ||
      this.mainLayoutService.isSidebarOverlayOpen();

    return isExpanded ? 'expanded' : 'collapsed';
  });

  // TODO: Cambiar esto SidebarCollapsible. O la manera en que se usa
  dataCollapsible = computed<SidebarCollapsible>(() => {
    if (this.mainLayoutService.isSidebarDesktopStaticCollapsed()) return 'icon';
    if (
      this.mainLayoutService.isSidebarDesktopStaticOffCanvas() ||
      this.mainLayoutService.isSidebarOverlayOffCanvas()
    ) {
      return 'offcanvas';
    }
    return '';
  });

  isCollapsed = computed(() =>
    this.mainLayoutService.isSidebarDesktopStaticCollapsed()
  );
}
