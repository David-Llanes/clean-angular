/**
 * Define el modo general de disposición del layout principal.
 * (Este es el tipo que movimos del antiguo ThemeService/LayoutService)
 */
export type OverallLayoutMode = 'col' | 'row'; // 'col' para topbar arriba, 'row' para sidebar al lado

// --- Tipos específicos para la configuración y estado del Sidebar ---
export type SidebarMode = 'static' | 'overlay';
export type SidebarVariant = 'sidebar' | 'inset' | 'floating'; // Define el estilo visual del sidebar
export type SidebarDesktopState = 'expanded' | 'collapsed'; // Para modo estático colapsable
export type SidebarOverlayState = 'open' | 'closed';

// Para el atributo data-collapsible del sidebar
export type SidebarCollapsible = 'icon' | 'offcanvas' | '';

/**
 * Configuración persistente del sidebar.
 */
export interface SidebarConfig {
  mode: SidebarMode; // Cómo se comporta el sidebar (estático, superpuesto)
  variant: SidebarVariant; // Apariencia visual del sidebar
  canCollapse: boolean; // Si el sidebar estático puede colapsarse a un modo "rail" o de iconos
  // rail: boolean; // 'canCollapse' es más descriptivo, 'rail' es un detalle de implementación de ese colapso
  initiallyOpenDesktop: boolean; // Si el sidebar estático en desktop debe estar abierto inicialmente
}

/**
 * Configuración general y persistente del Layout Principal.
 */
export interface MainLayoutConfig {
  overallMode: OverallLayoutMode; // 'col' o 'row'
  sidebar: SidebarConfig;
  // Aquí podrían ir otras configuraciones del layout principal en el futuro
}

/**
 * Estado en tiempo de ejecución del sidebar.
 */
export interface SidebarRuntimeState {
  isDesktopStaticOpen: boolean; // Si el sidebar estático en desktop está actualmente expandido
  isOverlayOpen: boolean; // Si el sidebar superpuesto está actualmente abierto
}

/**
 * Estado en tiempo de ejecución del Layout Principal.
 */
export interface MainLayoutRuntimeState {
  sidebar: SidebarRuntimeState;
  // Otros estados de runtime del layout principal
}
