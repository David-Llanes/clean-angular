import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MenuItem } from '@core/config/constants/nav-bar-items';
import { NavbarItem } from './navbar-item';

@Component({
  selector: 'app-navbar-node',
  imports: [RouterLink, RouterLinkActive, NgClass, NavbarItem],
  template: `
    @let localItem = item(); @let hasItems = localItem.items?.length; @let
    isLink = localItem.isLink && !hasItems; @let isGroupClickable =
    localItem.isLink && hasItems;

    <li class="list-none overflow-hidden">
      <!-- LINK (leaf) -->
      @if (isLink) {
      <a
        app-navbar-item
        [item]="localItem"
        [showIcon]="false"
        [routerLink]="localItem.routerLink"
        routerLinkActive="activeLink text-primary hover:bg-transparent"
        [routerLinkActiveOptions]="{ exact: false }"
        class="hover:bg-accent mb-1 overflow-hidden rounded-md"
      >
      </a>
      } @if (hasItems) {
      <!-- COLLAPSIBLE -->
      <div
        class="group/collapsible grid grid-rows-[auto_0fr] content-start text-sm transition-[grid-template-rows] duration-200"
        [ngClass]="{
            'grid-rows-[auto_1fr]': isOpen() && !isCollapsed(),
          }"
      >
        <!-- COLLAPSIBLE NAV ITEM -->
        <div
          class="group-has-[&_a.activeLink]/collapsible:text-primary flex size-full items-center overflow-hidden rounded-md group-has-[&_a.activeLink]/collapsible:font-semibold"
        >
          @if (isGroupClickable) {
          <!-- IF IT HAS ITEMS BUT IS ALSO LINK -->
          <a
            app-navbar-item
            [item]="localItem"
            [button]="chevron"
            [isCollapsed]="isCollapsed()"
            [routerLink]="localItem.routerLink"
            routerLinkActive="text-primary hover:bg-transparent"
          >
          </a>
          } @else {
          <!-- IF IT JUST HAS ITEMS -->
          <div
            app-navbar-item
            [item]="localItem"
            [icon]="navIcon"
            [button]="chevron"
            [isCollapsed]="isCollapsed()"
          >
            <ng-template #navIcon>
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
                class="icon icon-tabler icons-tabler-outline icon-tabler-menu-3"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 6h10" />
                <path d="M4 12h16" />
                <path d="M7 12h13" />
                <path d="M4 18h10" />
              </svg>
            </ng-template>
          </div>
          }
        </div>

        <!-- SUB-MENU -->
        <ul class="mt-1 ml-1 grid overflow-hidden border-l border-dashed pl-2">
          @for (subItem of localItem.items; track subItem.key) {
          <app-navbar-node [item]="subItem" />
          }
        </ul>
      </div>
      }
    </li>

    <ng-template #chevron>
      <button
        class="grid cursor-pointer place-content-center"
        [ngClass]="{ 'rotate-90': isOpen(), 'opacity-0': isCollapsed() }"
        (click)="toggleSubMenu($event)"
      >
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
          class="size-full max-h-4 max-w-4"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </button>
    </ng-template>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarNode {
  isCollapsed = input<boolean>(false);

  item = input.required<MenuItem>();

  isOpen = signal<boolean>(false);

  toggleSubMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isOpen.update((prev) => !prev);
  }
}
