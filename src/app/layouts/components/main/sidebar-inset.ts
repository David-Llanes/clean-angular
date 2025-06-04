import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MainLayoutService } from '@core/application/services/main-layout/main-layout.service';

@Component({
  selector: 'app-sidebar-inset',
  imports: [],
  template: ` <ng-content /> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'bg-background relative flex w-full flex-1 overflow-hidden md:peer-data-[layout=row]:peer-data-[variant=inset]:ml-[var(--space-around)] md:peer-data-[layout=row]:peer-data-[variant=inset]:mt-[var(--space-around)] md:peer-data-[layout=row]:peer-data-[variant=inset]:rounded-tl-xl md:peer-data-[layout=row]:peer-data-[variant=inset]:shadow-sm',
    '[class.flex-col]': 'layoutMode() !== "col"',
  },
})
export class SidebarInset {
  private mainLayoutService = inject(MainLayoutService);

  layoutMode = this.mainLayoutService.overallLayoutMode;
}
