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

import { ThemeConfig } from './theme.types';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private static readonly THEME_CONFIG_STORAGE_KEY = 'appThemeConfig';

  // Configuración de tema por defecto inmutable
  private readonly defaultThemeConfig: ThemeConfig = {
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: false,
  };

  // Señal para indicar si la configuración inicial ya se aplicó
  private initialized = signal(false);

  // --- Señales Públicas de Estado ---
  public readonly currentThemeConfig = signal<ThemeConfig>(
    this.loadPersistedThemeConfig()
  );
  public readonly visualTransitionComplete = signal<boolean>(false);

  // --- Selectores Computados Públicos ---
  public readonly activePreset = computed(
    () => this.currentThemeConfig().preset
  );
  public readonly activePrimaryColor = computed(
    () => this.currentThemeConfig().primary
  );
  public readonly activeSurfaceColor = computed(
    () => this.currentThemeConfig().surface
  );
  public readonly isDarkThemeActive = computed(
    () => this.currentThemeConfig().darkTheme
  );

  constructor() {
    this.initializeThemeEffects();
  }

  private initializeThemeEffects(): void {
    // Efecto para manejar la aplicación del tema oscuro y las transiciones
    effect(() => {
      const config = this.currentThemeConfig(); // Reacciona a cambios en la configuración completa
      const isDark = config.darkTheme; // Específicamente para que el effect sepa si darkTheme cambió

      untracked(() => {
        if (!this.initialized()) {
          this.applyDarkThemeClass(isDark);
          this.initialized.set(true);
        } else {
          this.triggerDarkThemeVisualTransition(isDark!);
        }
      });
    });

    // Efecto para persistir la configuración del tema en localStorage
    effect(() => {
      const config = this.currentThemeConfig();
      // Solo guardar después de la inicialización y en el browser
      if (this.initialized() && isPlatformBrowser(this.platformId)) {
        untracked(() => {
          localStorage.setItem(
            ThemeService.THEME_CONFIG_STORAGE_KEY,
            JSON.stringify(config)
          );
        });
      }
    });
  }

  // --- Métodos Públicos para Modificar el Tema ---

  public setThemeMode(isDark: boolean): void {
    this.currentThemeConfig.update((prevConfig) => ({
      ...prevConfig,
      darkTheme: isDark,
    }));
  }

  public toggleThemeMode(): void {
    this.currentThemeConfig.update((prevConfig) => ({
      ...prevConfig,
      darkTheme: !prevConfig.darkTheme,
    }));
  }

  public setPreset(presetName: string): void {
    this.currentThemeConfig.update((prevConfig) => ({
      ...prevConfig,
      preset: presetName,
    }));
  }

  public setPrimaryColor(primaryColor: string): void {
    this.currentThemeConfig.update((prevConfig) => ({
      ...prevConfig,
      primary: primaryColor,
    }));
  }

  public resetThemeToDefaults(): void {
    const defaults = { ...this.defaultThemeConfig }; // Crear una nueva copia
    this.currentThemeConfig.set(defaults);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(ThemeService.THEME_CONFIG_STORAGE_KEY);
    }
    // El effect de dark mode se encargará de aplicar el tema por defecto visualmente.
  }

  // --- Lógica Interna para el Tema Oscuro y Transiciones Visuales ---

  private loadPersistedThemeConfig(): ThemeConfig {
    if (isPlatformBrowser(this.platformId)) {
      const storedConfig = localStorage.getItem(
        ThemeService.THEME_CONFIG_STORAGE_KEY
      );
      if (storedConfig) {
        try {
          const parsedConfig = JSON.parse(storedConfig) as ThemeConfig;
          // Fusionar con default para asegurar que todas las claves existan si se añade una nueva
          return { ...this.defaultThemeConfig, ...parsedConfig };
        } catch (e) {
          console.error(
            'Error parsing stored theme config, resetting to defaults:',
            e
          );
          localStorage.removeItem(ThemeService.THEME_CONFIG_STORAGE_KEY);
        }
      }
    }
    return { ...this.defaultThemeConfig }; // Devuelve una copia
  }

  /**
   * Aplica directamente las clases CSS para el modo oscuro/claro al elemento <html>.
   * @param isDark Booleano que indica si el modo oscuro debe estar activo.
   */
  private applyDarkThemeClass(isDark?: boolean): void {
    // isDark puede ser undefined si se llama desde el effect inicial antes de que config se resuelva
    const shouldUseDark = isDark ?? this.defaultThemeConfig.darkTheme ?? false;

    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;

      if (shouldUseDark) {
        htmlElement.classList.add('app-dark');
      } else {
        htmlElement.classList.remove('app-dark');
      }

      // Aquí también podrías cambiar otros atributos o variables CSS si tu sistema de temas lo requiere
      // ej. htmlElement.setAttribute('data-theme-preset', this.activePreset() || '');
      //     htmlElement.style.setProperty('--primary-color', this.activePrimaryColor() || '');
    }
  }

  /**
   * Inicia la transición visual para el cambio de modo oscuro/claro, usando View Transitions si está disponible.
   * @param isDark Booleano que indica si el modo oscuro debe activarse.
   */
  private triggerDarkThemeVisualTransition(isDark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.applyDarkThemeClass(isDark);
      this.notifyVisualTransitionComplete();
      return;
    }

    if ((document as any).startViewTransition) {
      const transition = (document as any).startViewTransition(() => {
        this.applyDarkThemeClass(isDark);
      });

      transition.ready
        .then(() => this.notifyVisualTransitionComplete())
        .catch((err: any) => {
          console.error('Theme view transition failed:', err);
          this.notifyVisualTransitionComplete(); // Notificar igual para no bloquear
        });
    } else {
      this.applyDarkThemeClass(isDark);
      this.notifyVisualTransitionComplete();
    }
  }

  private notifyVisualTransitionComplete(): void {
    this.visualTransitionComplete.set(true);

    setTimeout(() => {
      // Resetear después de un ciclo para permitir reacciones
      this.visualTransitionComplete.set(false);
    });
  }
}
