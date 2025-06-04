import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { NAVIGATION_GROUPS } from '@core/config/constants/nav-bar-items';
import { NavigationGroup } from './navigation.types';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor() {}

  public getNavigationStructure(): Observable<NavigationGroup[]> {
    // Aquí podrías añadir lógica para filtrar `staticNavigationData`
    // basado en roles de usuario, permisos, configuraciones, etc.
    // O incluso obtener esta estructura desde un backend en el futuro.
    // Por ahora, simplemente devolvemos la data estática como un observable.
    return of(NAVIGATION_GROUPS);
  }

  // Podrías tener otros métodos, ej:
  // public getNavigationItemByKey(key: string): Observable<MenuItem | undefined> { ... }
}
