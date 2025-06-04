export interface MenuItem {
  url: string;
  key: string;
  icon: string;
  routerLink?: string;
  isLink?: boolean;
  items?: MenuItem[];
  // permissions?: string[]; // Ejemplo de futura expansión
}

export interface NavigationGroup {
  sectionKey: string;
  items: MenuItem[];
}
