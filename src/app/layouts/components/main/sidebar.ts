import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { MainLayoutService } from '@core/application/services/main-layout/main-layout.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  template: `
    <!-- This is what handles the sidebar gap on desktop  -->
    <div
      class="relative h-full w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] group-data-[collapsible=offcanvas]:w-0 group-data-[mode=overlay]:fixed group-data-[layout=row]:group-data-[collapsible=icon]:group-data-[variant=floating]:w-[calc(var(--sidebar-width-icon)+(var(--space-around)*2))]"
    ></div>
    <div
      class="fixed top-0 bottom-0 left-0 z-10 h-svh w-[var(--sidebar-width)] transition-[left,right,width,padding] duration-200 ease-linear *:overflow-hidden group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] group-data-[layout=col]:top-[var(--topbar-height)] group-data-[layout=col]:h-[calc(100svh-var(--topbar-height))] group-data-[mode=overlay]:top-0 group-data-[mode=overlay]:h-full group-data-[layout=row]:group-data-[collapsible=icon]:group-data-[variant=floating]:w-[calc(var(--sidebar-width-icon)+(var(--space-around)*2))] md:group-data-[layout=col]:!p-0 md:group-data-[mode=overlay]:!p-0 md:group-data-[state=collapsed]:!p-0 md:group-data-[layout=row]:group-data-[mode=static]:group-data-[variant=floating]:p-[var(--space-around)]!"
    >
      <aside
        data-sidebar="sidebar"
        class="bg-sidebar flex size-full flex-col group-data-[mode=static]:group-data-[side=left]:border-r group-data-[layout=row]:group-data-[variant=floating]:border-none group-data-[layout=row]:group-data-[variant=floating]:shadow group-data-[layout=row]:group-data-[mode=static]:group-data-[variant=floating]:rounded-lg group-data-[layout=row]:group-data-[mode=static]:group-data-[variant=floating]:outline group-data-[layout=row]:group-data-[variant=inset]:border-none group-data-[layout=row]:group-data-[mode=static]:group-data-[state=expanded]:group-data-[variant=inset]:rounded-lg"
      >
        <!-- SIDEBAR (header, content y footer) -->
        <ng-content />

        <!-- OVERLAY BUTTON -->
        @if (isOverlayActive()) {
        <button
          data-sidebar="overlay"
          aria-label="Close sidebar"
          [tabindex]="-1"
          title="Close sidebar"
          class="fixed inset-0 -z-10 bg-black/50"
          (click)="toggleSidebar()"
        ></button>
        }

        <!-- RAIL BUTTON -->
        @if (!isOverlayActive()) {
        <button
          data-sidebar="rail"
          aria-label="Toggle sidebar"
          [tabindex]="-1"
          title="Toggle sidebar"
          class="hover:after:bg-sidebar-border group-data-[collapsible=offcanvas]:hover:bg-sidebar absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[collapsible=offcanvas]:translate-x-0 group-data-[side=left]:-right-4 group-data-[state=expanded]:-z-10 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[collapsible=offcanvas]:after:left-full sm:flex [[data-side=left]_&]:cursor-w-resize [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=left][data-state=collapsed]_&]:cursor-e-resize"
          (click)="toggleSidebar()"
        ></button>
        }
      </aside>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscapeKey()',
  },
})
export class Sidebar {
  private mainLayoutService = inject(MainLayoutService);
  private router = inject(Router);

  constructor() {
    // Close sidebar after navigationEnd only when isOverlayActive
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((params) => {
        if (this.isOverlayActive()) {
          console.log(params.urlAfterRedirects);
          this.toggleSidebar();
        }
      });
  }

  isOverlayActive = this.mainLayoutService.isSidebarOverlayOpen;

  toggleSidebar() {
    this.mainLayoutService.toggleSidebar();
  }

  onEscapeKey() {
    if (this.mainLayoutService.isSidebarOverlayOpen()) {
      this.toggleSidebar();
    }
  }
}

@Component({
  selector: 'app-sidebar-header',
  imports: [],
  template: ` <ng-content /> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'flex flex-col gap-2 p-[var(--sidebar-padding)] transition-[padding] duration-200',
    '[attr.data-sidebar]': '"header"',
  },
})
export class SidebarHeader {}

@Component({
  selector: 'app-sidebar-content',
  imports: [],
  template: ` <ng-content /> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden group-data-[collapsible=icon]:overflow-hidden p-[var(--sidebar-padding)] transition-[padding] duration-200',
    '[attr.data-sidebar]': '"content"',
  },
})
export class SidebarContent {}

@Component({
  selector: 'app-sidebar-footer',
  imports: [],
  template: ` <ng-content /> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'flex flex-col gap-2 p-[var(--sidebar-padding)] transition-[padding] duration-200',
    '[attr.data-sidebar]': '"footer"',
  },
})
export class SidebarFooter {}
