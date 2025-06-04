import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MainLayoutService } from '@core/application/services/main-layout/main-layout.service';

import {
  OverallLayoutMode,
  SidebarMode,
  SidebarVariant,
} from '@core/application/services/main-layout/main-layout.types';
import { ThemeService } from '@core/application/services/theme/theme.service';

@Component({
  selector: 'app-layout-theme-settings-page',
  standalone: true,
  imports: [],
  template: `
    <div class="text-foreground grid gap-6 py-6 px-4">
      <section class="relative flex flex-col gap-6 rounded-lg border p-4">
        <button
          class="bg-destructive/80 ring-destructive absolute top-4 right-4 p-2 text-xs font-semibold text-white ring-1 rounded-md hover:bg-destructive disabled:opacity-50"
          (click)="themeService.resetThemeToDefaults()"
        >
          RESET THEME
        </button>

        <div>
          <h2 class="mb-4 text-xl font-semibold">Theme Settings</h2>
          <div class="flex items-center gap-3">
            <button
              class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
              [disabled]="themeService.isDarkThemeActive()"
              (click)="themeService.setThemeMode(true)"
            >
              Dark Mode
            </button>
            <button
              class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
              [disabled]="!themeService.isDarkThemeActive()"
              (click)="themeService.setThemeMode(false)"
            >
              Light Mode
            </button>
          </div>
        </div>
      </section>

      <section class="relative flex flex-col gap-6 rounded-lg border p-4">
        <button
          class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
          class="bg-destructive/80 ring-destructive absolute top-4 right-4 p-2 text-xs font-semibold text-white ring-1 rounded-md hover:bg-destructive disabled:opacity-50"
          (click)="mainLayoutService.resetMainLayoutConfig()"
        >
          RESET LAYOUT
        </button>

        <h2 class="mb-4 text-xl font-semibold">Layout Settings</h2>

        <div>
          <h3 class="mb-2 font-medium text-lg">Overall Layout Mode</h3>
          <div class="flex items-center gap-3">
            <button
              class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
              [disabled]="mainLayoutService.overallLayoutMode() === 'row'"
              (click)="mainLayoutService.setOverallLayoutMode('row')"
            >
              Row
            </button>
            <button
              class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
              [disabled]="mainLayoutService.overallLayoutMode() === 'col'"
              (click)="mainLayoutService.setOverallLayoutMode('col')"
            >
              Column
            </button>
          </div>
        </div>

        <div>
          <h3 class="mt-6 mb-2 font-medium text-lg">Sidebar Mode</h3>
          <div class="flex items-center gap-3">
            <button
              class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
              [disabled]="mainLayoutService.sidebarMode() === 'static'"
              (click)="mainLayoutService.setSidebarMode('static')"
            >
              Static
            </button>
            <button
              class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
              [disabled]="mainLayoutService.sidebarMode() === 'overlay'"
              (click)="mainLayoutService.setSidebarMode('overlay')"
            >
              Overlay
            </button>
          </div>
        </div>

        <div>
          <h3 class="mt-6 mb-2 font-medium text-lg">Sidebar Variant</h3>
          <div class="flex items-center gap-3">
            <button
              class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
              [disabled]="mainLayoutService.sidebarVariant() === 'sidebar'"
              (click)="mainLayoutService.setSidebarVariant('sidebar')"
            >
              Sidebar
            </button>
            <button
              class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
              [disabled]="mainLayoutService.sidebarVariant() === 'floating'"
              (click)="mainLayoutService.setSidebarVariant('floating')"
            >
              Floating
            </button>
            <button
              class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
              [disabled]="mainLayoutService.sidebarVariant() === 'inset'"
              (click)="mainLayoutService.setSidebarVariant('inset')"
            >
              Inset
            </button>
          </div>
        </div>

        <div>
          <h3 class="mt-6 mb-2 font-medium text-lg">
            Sidebar Behavior (Desktop Static Mode)
          </h3>
          <div class="flex flex-wrap items-center gap-3">
            <button
              class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
              [disabled]="mainLayoutService.canSidebarCollapse()"
              (click)="mainLayoutService.setSidebarCanCollapse(true)"
            >
              Can Collapse (to icons)
            </button>
            <button
              class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
              [disabled]="!mainLayoutService.canSidebarCollapse()"
              (click)="mainLayoutService.setSidebarCanCollapse(false)"
            >
              Cannot Collapse
            </button>
            <button
              class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
              [disabled]="mainLayoutService.isSidebarInitiallyOpenDesktop()"
              (click)="mainLayoutService.setSidebarInitiallyOpenDesktop(true)"
            >
              Initially Open
            </button>
            <button
              class="cursor-pointer p-2 border bg-primary text-white disabled:opacity-50"
              [disabled]="!mainLayoutService.isSidebarInitiallyOpenDesktop()"
              (click)="mainLayoutService.setSidebarInitiallyOpenDesktop(false)"
            >
              Initially Closed
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutThemeSettingsPageComponent {
  public themeService = inject(ThemeService);
  public mainLayoutService = inject(MainLayoutService);

  readonly overallLayoutModes: OverallLayoutMode[] = ['row', 'col'];
  readonly sidebarModes: SidebarMode[] = ['static', 'overlay'];
  readonly sidebarVariants: SidebarVariant[] = ['sidebar', 'inset', 'floating'];

  // Un método combinado para el botón de RESET general si prefieres
  resetAllSettings() {
    this.themeService.resetThemeToDefaults();
    this.mainLayoutService.resetMainLayoutConfig();
  }
}
