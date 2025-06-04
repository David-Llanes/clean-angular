import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutService } from '@core/application/services/main-layout/main-layout.service';

import { MainLayoutProvider } from '@layouts/components/main/main-layout-provider';
import { SidebarContainer } from '@layouts/components/main/sidebar-container';
import { SidebarInset } from '@layouts/components/main/sidebar-inset';
import { Topbar } from '@layouts/components/main/topbar';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    MainLayoutProvider,
    Topbar,
    SidebarContainer,
    SidebarInset,
  ],
  template: `
    @defer (when loadedConfig()) {
    <app-main-layout-provider>
      @if (layoutMode() === 'col') {
      <app-topbar class="border-b" />
      } @else {
      <app-sidebar-container />
      }
      <app-sidebar-inset>
        @if (layoutMode() === 'col') {
        <app-sidebar-container />
        } @else {
        <app-topbar />
        }
        <div class="bg-background flex h-full grow flex-col overflow-auto">
          <router-outlet />
        </div>
      </app-sidebar-inset>
    </app-main-layout-provider>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'h-svh flex flex-col overflow-hidden relative',
  },
})
export class MainLayout {
  private mainLayoutService = inject(MainLayoutService);

  loadedConfig = computed(() => !!this.mainLayoutService.currentConfig());

  layoutMode = this.mainLayoutService.overallLayoutMode;
}
