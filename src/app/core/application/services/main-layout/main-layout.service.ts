import { isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';

import { MediaQueryService } from '@core/services/media-query.service';
import {
  MainLayoutConfig,
  MainLayoutRuntimeState,
  OverallLayoutMode,
  SidebarConfig,
  SidebarMode,
  SidebarVariant,
} from './main-layout.types';

@Injectable({
  providedIn: 'root',
})
export class MainLayoutService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly mediaQueryService = inject(MediaQueryService);
  private static readonly LAYOUT_CONFIG_STORAGE_KEY = 'appMainLayoutConfig';

  private readonly defaultMainLayoutConfig: MainLayoutConfig = {
    overallMode: 'row',
    sidebar: {
      mode: 'static',
      variant: 'sidebar',
      canCollapse: true,
      initiallyOpenDesktop: true,
    },
  };

  private readonly initialMainLayoutRuntimeState: MainLayoutRuntimeState = {
    sidebar: {
      isDesktopStaticOpen:
        this.loadPersistedConfig().sidebar.initiallyOpenDesktop,
      isOverlayOpen: false,
    },
  };

  // --- SEÑALES DE CONFIGURACIÓN Y ESTADO ---
  public readonly currentConfig = signal<MainLayoutConfig>(
    this.loadPersistedConfig()
  );
  public readonly currentState = signal<MainLayoutRuntimeState>(
    this.initialMainLayoutRuntimeState
  );

  // --- SELECTORES COMPUTADOS PARA EL LAYOUT GENERAL ---
  public readonly overallLayoutMode = computed(
    () => this.currentConfig().overallMode
  );

  // --- SELECTORES COMPUTADOS PARA LA CONFIGURACIÓN DEL SIDEBAR ---
  private readonly sidebarConfig = computed<SidebarConfig>(
    () => this.currentConfig().sidebar
  );
  public readonly sidebarMode = computed(() => this.sidebarConfig().mode);
  public readonly sidebarVariant = computed(() => this.sidebarConfig().variant);
  public readonly canSidebarCollapse = computed(
    () => this.sidebarConfig().canCollapse
  );
  public readonly isSidebarInitiallyOpenDesktop = computed(
    () => this.sidebarConfig().initiallyOpenDesktop
  );

  // --- SELECTORES COMPUTADOS PARA EL ESTADO DEL SIDEBAR (LÓGICA PRINCIPAL) ---
  public readonly isDesktop = computed(() =>
    this.mediaQueryService.isDesktop()
  );

  /** Determina si el sidebar debe comportarse como 'estático' (visible en desktop, parte del layout) */
  public readonly isSidebarEffectivelyStatic = computed(
    () => this.sidebarMode() === 'static' && this.isDesktop()
  );

  /** Determina si el sidebar debe comportarse como 'overlay' (oculto por defecto, se superpone) */
  public readonly isSidebarEffectivelyOverlay = computed(
    () => this.sidebarMode() === 'overlay' || !this.isDesktop() // Siempre overlay en móvil
  );

  /** Estado: ¿Está el sidebar estático de desktop actualmente expandido? */
  public readonly isSidebarDesktopStaticOpen = computed(
    () =>
      this.isSidebarEffectivelyStatic() &&
      this.currentState().sidebar.isDesktopStaticOpen
  );

  /** Estado: ¿Está el sidebar estático de desktop actualmente colapsado (modo "rail")? */
  public readonly isSidebarDesktopStaticCollapsed = computed(
    () =>
      this.isSidebarEffectivelyStatic() &&
      !this.currentState().sidebar.isDesktopStaticOpen &&
      this.canSidebarCollapse()
  );

  /** Estado: ¿Está el sidebar estático de desktop en modo "off-canvas" (porque no puede colapsar y está cerrado)? */
  public readonly isSidebarDesktopStaticOffCanvas = computed(
    () =>
      this.isSidebarEffectivelyStatic() &&
      !this.currentState().sidebar.isDesktopStaticOpen &&
      !this.canSidebarCollapse()
  );

  /** Estado: ¿Está el sidebar overlay actualmente visible? */
  public readonly isSidebarOverlayOpen = computed(
    () =>
      this.isSidebarEffectivelyOverlay() &&
      this.currentState().sidebar.isOverlayOpen
  );

  /** Estado: ¿Está el sidebar overlay actualmente oculto (modo "off-canvas")? */
  public readonly isSidebarOverlayOffCanvas = computed(
    () =>
      this.isSidebarEffectivelyOverlay() &&
      !this.currentState().sidebar.isOverlayOpen
  );

  constructor() {
    // Persistir la configuración cuando cambie
    effect(() => {
      const configToSave = this.currentConfig();

      untracked(() => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(
            MainLayoutService.LAYOUT_CONFIG_STORAGE_KEY,
            JSON.stringify(configToSave)
          );
        }
      });
    });

    // Reaccionar a cambios en la configuración que podrían afectar el estado runtime del sidebar
    effect(() => {
      const config = this.currentConfig();

      untracked(() => {
        // Si cambiamos a modo overlay, y el sidebar estático estaba abierto, cerramos el overlay.
        if (
          config.sidebar.mode === 'overlay' &&
          this.currentState().sidebar.isOverlayOpen
        ) {
          this.currentState.update((prev) => ({
            ...prev,
            sidebar: { ...prev.sidebar, isOverlayOpen: false },
          }));
        }

        // Si la configuración inicial de apertura cambia, actualizamos el estado si aún no se ha interactuado.
        // (Esta lógica puede ser más compleja dependiendo de si quieres que el estado runtime anule la config persistida
        //  o viceversa tras una recarga). Por ahora, this.initialMainLayoutRuntimeState ya lo considera en la carga.
      });
    });
  }

  // --- MÉTODOS PÚBLICOS PARA MODIFICAR LA CONFIGURACIÓN Y ESTADO ---

  // Métodos para OverallLayoutMode
  public setOverallLayoutMode(mode: OverallLayoutMode): void {
    this.currentConfig.update((prev) => ({ ...prev, overallMode: mode }));
  }

  // Métodos para Sidebar
  public toggleSidebar(): void {
    if (this.isSidebarEffectivelyOverlay()) {
      this.currentState.update((prev) => ({
        ...prev,
        sidebar: {
          ...prev.sidebar,
          isOverlayOpen: !prev.sidebar.isOverlayOpen,
        },
      }));
    } else if (this.isSidebarEffectivelyStatic()) {
      this.currentState.update((prev) => ({
        ...prev,
        sidebar: {
          ...prev.sidebar,
          isDesktopStaticOpen: !prev.sidebar.isDesktopStaticOpen,
        },
      }));
    }
  }

  public openSidebarOverlay(): void {
    if (this.isSidebarEffectivelyOverlay()) {
      this.currentState.update((prev) => ({
        ...prev,
        sidebar: { ...prev.sidebar, isOverlayOpen: true },
      }));
    }
  }

  public closeSidebarOverlay(): void {
    if (this.isSidebarEffectivelyOverlay()) {
      this.currentState.update((prev) => ({
        ...prev,
        sidebar: { ...prev.sidebar, isOverlayOpen: false },
      }));
    }
  }

  public setSidebarMode(mode: SidebarMode): void {
    this.currentConfig.update((prev) => ({
      ...prev,
      sidebar: { ...prev.sidebar, mode },
    }));
    // Si cambiamos a overlay, cerramos el panel overlay por defecto
    if (mode === 'overlay') {
      this.currentState.update((prev) => ({
        ...prev,
        sidebar: { ...prev.sidebar, isOverlayOpen: false },
      }));
    }
  }

  public setSidebarVariant(variant: SidebarVariant): void {
    this.currentConfig.update((prev) => ({
      ...prev,
      sidebar: { ...prev.sidebar, variant },
    }));
  }

  public setSidebarCanCollapse(canCollapse: boolean): void {
    this.currentConfig.update((prev) => ({
      ...prev,
      sidebar: { ...prev.sidebar, canCollapse, mode: 'static' }, // Forzar modo estático si se configura colapso
    }));
    // Si estaba abierto y ahora puede colapsar, podría optar por colapsarlo.
    // O si ya no puede colapsar y estaba colapsado (abierto en modo rail), expandirlo.
    // Por ahora, lo dejamos simple; el estado actual se mantiene.
    // El usuario tendría que llamar a toggleSidebar si quiere cambiar el estado visible.
  }

  public setSidebarInitiallyOpenDesktop(isOpen: boolean): void {
    this.currentConfig.update((prev) => ({
      ...prev,
      sidebar: {
        ...prev.sidebar,
        initiallyOpenDesktop: isOpen,
        mode: 'static',
      },
    }));
    // Actualizar el estado runtime actual para reflejar este cambio inmediatamente si estamos en desktop y modo estático
    if (this.isSidebarEffectivelyStatic()) {
      this.currentState.update((prev) => ({
        ...prev,
        sidebar: { ...prev.sidebar, isDesktopStaticOpen: isOpen },
      }));
    }
  }

  public resetMainLayoutConfig(): void {
    const defaults = { ...this.defaultMainLayoutConfig }; // Nueva copia
    const defaultRuntimeState = {
      sidebar: {
        isDesktopStaticOpen: defaults.sidebar.initiallyOpenDesktop,
        isOverlayOpen: false,
      },
    };
    this.currentConfig.set(defaults);
    this.currentState.set(defaultRuntimeState);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(MainLayoutService.LAYOUT_CONFIG_STORAGE_KEY);
    }
  }

  private loadPersistedConfig(): MainLayoutConfig {
    if (isPlatformBrowser(this.platformId)) {
      const storedConfig = localStorage.getItem(
        MainLayoutService.LAYOUT_CONFIG_STORAGE_KEY
      );
      if (storedConfig) {
        try {
          const parsedConfig = JSON.parse(
            storedConfig
          ) as Partial<MainLayoutConfig>;
          // Fusionar con defaults para asegurar que todas las claves existan y manejar migraciones simples
          return {
            overallMode:
              parsedConfig.overallMode ??
              this.defaultMainLayoutConfig.overallMode,
            sidebar: {
              ...this.defaultMainLayoutConfig.sidebar,
              ...(parsedConfig.sidebar ?? {}),
            },
          };
        } catch (e) {
          console.error(
            'Error parsing stored layout config, resetting to defaults:',
            e
          );
          localStorage.removeItem(MainLayoutService.LAYOUT_CONFIG_STORAGE_KEY);
        }
      }
    }
    return {
      ...this.defaultMainLayoutConfig,
      sidebar: { ...this.defaultMainLayoutConfig.sidebar },
    }; // Devuelve una copia profunda
  }
}
