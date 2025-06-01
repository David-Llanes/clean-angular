import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  template: ` <h1 class="text-3xl font-bold underline">Hello world!</h1>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
