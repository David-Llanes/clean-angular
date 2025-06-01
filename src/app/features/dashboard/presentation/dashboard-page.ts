import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  template: ` <h1>Dashboard page</h1>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
