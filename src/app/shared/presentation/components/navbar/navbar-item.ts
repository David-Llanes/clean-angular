import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  TemplateRef,
} from '@angular/core';

import { MenuItem } from '@core/config/constants/nav-bar-items';
import { NavbarItemSpace } from './navbar-item-space';

@Component({
  selector: '[app-navbar-item]',
  imports: [NgClass, NavbarItemSpace, NgTemplateOutlet],
  template: `
    <!-- TODO: QUE RECIBA POR PROPS SI MUESTRA ICONO -->
    @let withIcon = (item()?.icon || icon()) && showIcon(); @if (withIcon) {
    <div
      app-navbar-item-space
      class="grid place-content-center p-1.5 *:max-h-6 *:max-w-6"
    >
      @if (icon()) {
      <ng-container [ngTemplateOutlet]="icon()!" />
      } @else {
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
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M9 15l6 -6" />
        <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
        <path
          d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
        />
      </svg>
      }
    </div>
    } @else {
    <div></div>
    }

    <p
      [ngClass]="{
        'pl-2': !withIcon,
        'pr-2': !button(),
        'opacity-0': isCollapsed()
      }"
      class="truncate text-nowrap transition-[opacity] duration-200"
    >
      {{ item()?.key ?? label() ?? '' }}
    </p>

    <!-- BOTON EXTRA -->
    @if (button()) {
    <div
      app-navbar-item-space
      class="transition-[opacity] duration-200"
      [ngClass]="{ 'opacity-0': isCollapsed() }"
    >
      @if (button()) {
      <ng-container [ngTemplateOutlet]="button()!" />
      } @else {
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
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M9 15l6 -6" />
        <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464" />
        <path
          d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"
        />
      </svg>
      }
    </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'h-[var(--sidebar-item-size)] flex-1 grid grid-cols-[auto_1fr_auto] items-center group/item hover:bg-border/60 rounded-md overflow-hidden',
  },
})
export class NavbarItem {
  item = input<MenuItem>();
  showIcon = input<boolean>(true);
  isCollapsed = input<boolean>();

  icon = input<TemplateRef<unknown>>();
  button = input<TemplateRef<unknown>>();
  label = input<string>();
}
