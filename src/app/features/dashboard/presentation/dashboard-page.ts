import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutThemeSettingsPageComponent } from './components/layout-theme-settings-page';

@Component({
  selector: 'app-dashboard-page',
  imports: [LayoutThemeSettingsPageComponent],
  template: ` <app-layout-theme-settings-page /> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
