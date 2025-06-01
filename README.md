# Estructura de Carpetas del Proyecto Angular

## Introducción

Este documento describe la estructura de carpetas adoptada para esta aplicación Angular. El objetivo principal es lograr una base de código **escalable, mantenible, testeable y con una clara separación de responsabilidades**. La arquitectura se inspira en los principios de **Arquitectura Limpia (Clean Architecture)** y está organizada principalmente por funcionalidades de negocio.

## Filosofía Principal

- **Organización por Funcionalidades (Feature-Based):** El código se agrupa por dominios de negocio o funcionalidades principales, en lugar de por tipo técnico (ej. todos los servicios en una carpeta, todos los componentes en otra).
- **Separación de Capas (Clean Architecture):** Dentro de cada funcionalidad (y a nivel `core`), se intenta seguir una separación en capas (Dominio, Aplicación, Infraestructura, Presentación) para aislar la lógica de negocio de los detalles de implementación y del framework.
- **Regla de Dependencia:** Las dependencias siempre fluyen hacia adentro: Presentación depende de Aplicación, Aplicación depende de Dominio. Infraestructura implementa interfaces del Dominio o Aplicación y depende de ellas. El Dominio no depende de nada externo.

## Estructura Detallada de `src/app/`

Aquí es donde reside la lógica principal de nuestra aplicación.

### 1. `core/`

Contiene elementos que son singleton y fundamentales para toda la aplicación. Debe ser lo más reducido posible.

- **Propósito:** Lógica transversal, servicios singleton globales, configuración fundamental, interceptores, guardias globales.
- **Subdirectorios Comunes:**
  - `config/`:
    - `constants/`: Constantes globales (ej. `api.constants.ts`).
    - `providers/`: Providers globales (usualmente de terceros) (ej. `ngxTranslate.provider.ts`).
    - `http-context-tokens.ts`: Tokens de contexto HTTP (ej. `NO_INTERCEPT`).
  - `domain/`: (Usar con mucha precaución y solo para conceptos de dominio REALMENTE globales)
    - `interfaces/`: Interfaces o tipos que definen cómo el dominio espera interactuar a nivel global (ej. `query-options.model.ts`).
  - `application/`: (Para lógica de aplicación centralizada si existe, lo cual es raro. La mayoría va a `features`)
    - `ports/`: Interfaces para servicios de aplicación de core (ej. `notification.service.port.ts`).
    - `dtos/`: DTOs usados o producidos por servicios de aplicación de `core`.
  - `infrastructure/`: Implementaciones de infraestructura centralizada.
    - `dto/`: DTOs que representan la estructura cruda de sistemas externos (ej. `api-response.dto.ts` para la respuesta cruda del backend).
    - `errors/`: Clases de error personalizadas de infraestructura/aplicación globales (ej. `app-communication.error.ts`).
    - `mappers/`: Mapeadores globales (ej. `api-response.mapper.ts`).
    - `models/`: Modelos producidos por la infraestructura de `core` como un contrato estandarizado (ej. `api-response.model.ts` para la estructura `ApiResponse<T>` interna).
    - `services/`: Servicios de infraestructura singleton (ej. `api-error-handler.service.ts`, implementación de `NotificationServicePort` como `toast-notification.service.ts`).
  - `guards/`: Guardias de ruta globales (ej. `auth.guard.ts` que protege múltiples rutas).
  - `interceptors/`: Interceptors (ej. `api-response.interceptor.ts` que se aplica a todas o a ciertas peticiones).
  - `services/`: Servicios globales independientes (ej. `layout.service.ts` que son base para la aplicación).

### 2. `features/`

Este es el corazón de la aplicación, donde reside la lógica de negocio principal, organizada por funcionalidades o dominios.

- **Propósito:** Encapsular toda la lógica (dominio, aplicación, infraestructura y presentación) de una funcionalidad de negocio específica.
- **Estructura dentro de cada `[nombre-feature]/` (ej. `features/products/`):**
  - `domain/`: Lógica de negocio pura y agnóstica al framework para esta funcionalidad.
    - `models/`: Entidades y Objetos de Valor del dominio (ej. `product.model.ts`).
    - `repositories/`: Interfaces (puertos) de los repositorios (ej. `product.repository.ts`).
    - `use-cases/`: (Opcional) Casos de uso muy puros del dominio si no encajan en `application/`.
    - `errors/`: (Opcional) Errores específicos del dominio de esta funcionalidad.
  - `application/`: Orquesta los casos de uso y la lógica específica de la aplicación para la funcionalidad.
    - `use-cases/`: Implementación de los casos de uso (ej. `get-product-by-id.use-case.ts`, `create-product.use-case.ts`).
    - `services/`: (Alternativa o complemento a use-cases) Servicios de aplicación o Fachadas.
    - `dtos/`: Data Transfer Objects específicos para los casos de uso de esta funcionalidad.
    - `ports/`: (Opcional) Interfaces para servicios específicos de esta funcionalidad si son consumidos por otras partes.
  - `infrastructure/`: Implementación de los detalles externos para esta funcionalidad.
    - `repositories/`: Implementación de las interfaces de repositorio del dominio (ej. `product-api.repository.ts`).
    - `services/`: Otros servicios de infraestructura específicos de la funcionalidad (ej. un cliente SDK específico).
    - `mappers/`: Mapeadores de datos entre DTOs de API y modelos de dominio/DTOs de aplicación de la funcionalidad.
    - `dto/`: DTOs específicos para la comunicación externa de esta funcionalidad.
  - `presentation/`: Componentes de Angular, plantillas, estilos y lógica de UI para esta funcionalidad.
    - `components/`: Componentes "tontos" o "inteligentes" (contenedores) específicos de la funcionalidad.
    - `pages/`: (Opcional) Si la funcionalidad tiene varias "páginas" o vistas principales.
    - `layouts/`: (Opcional) Layouts específicos para esta funcionalidad.
    - `guards/`: Guardias de ruta específicos para las rutas de esta funcionalidad.
  - `[nombre-feature].routes.ts`: Definición de las rutas para esta funcionalidad (generalmente cargadas de forma diferida).
  - `index.ts`: (Opcional) Barrel file para exportar elementos públicos de la funcionalidad.

### 3. `layouts/ y pages/` (a nivel de `src/app/`)

Componentes de UI que son globales para la aplicación pero no pertenecen a una `feature` específica ni son reutilizables genéricamente como en `shared/`.

- **Propósito:** Layouts principales de la aplicación y páginas de error globales.
- **Casos de uso:**
  - `layouts/`: Componentes que definen la estructura principal de la aplicación (ej. `main-layout/` con cabecera, sidebar y pie de página; `public-layout/`).
  - `pages/`: Páginas globales que no encajan en una `feature` (ej. `not-found/`, `access-denied/`).

### 4. `shared/`

Contiene elementos que son reutilizables a través de múltiples funcionalidades (features), pero que no tienen estado propio ni lógica de negocio compleja.

- **Propósito:** Maximizar la reutilización de código y mantener la consistencia visual.
- **Subdirectorios Comunes:**
  - `presentation/`: Elementos de UI reutilizables y "tontos".
    - `components/`: Componentes de UI genéricos (botones, modales, spinners, inputs personalizados).
    - `layouts/`: Layouts estructurales reutilizables (ej. `card-layout/`, `two-column-layout/`).
    - `directives/`: Directivas personalizadas reutilizables.
    - `pipes/`: Pipes personalizados reutilizables.
  - `domain/`: (¡**USAR CON EXTREMA CAUTELA!**) Solo para modelos de dominio o lógica de negocio que sean verdaderamente agnósticos al framework Y compartidos entre múltiples dominios de negocio _distintos_. Generalmente es mejor mantener la lógica de dominio dentro de su `feature`.
  - `utils/`: Funciones de utilidad puras, genéricas y sin dependencias de Angular, que pueden ser usadas por cualquier `feature` o componente.
  - `validators/`: Validadores de formularios personalizados y reutilizables.

## Regla de Dependencia

Es crucial recordar la regla de dependencia de Clean Architecture:

- Las dependencias siempre deben apuntar **hacia adentro**.
- **Presentación** (UI) depende de **Aplicación**. Puede utilizar los modelos e interfaces de **Domain**.
- **Infraestructura** implementa interfaces definidas por **Aplicación** o **Dominio**, y depende de ellas.
- **Aplicación** depende de **Dominio**.
- **Dominio** es el núcleo y no depende de ninguna otra capa.
- `core/` puede ser usado por `features/` y `shared/`. `shared/` puede ser usado por `features/`. Las `features/` no deberían depender directamente entre sí (se comunican a través de servicios de aplicación, eventos o estado gestionado). Por ejemplo, si la feature `pagos` necesitara los servicios de aplicación de `productos`, dentro de un servicio de aplicación de `pagos` se inyectaria el servicio de aplicacion de `productos`.

NOTA: en el caso extremo de que sea un servicio que se este utilizando por muchas features, es mejor ponerlo en `core/application/services` e inyectarlo en donde se necesite.

## Nomenclatura

Se recomienda seguir las convenciones de nomenclatura de Angular (`nombre-archivo.tipo.ts`, ej. `product-list.component.ts`, `auth.service.ts`) y ser consistente en todo el proyecto.

NOTA: En angular 20, `product-list.component.ts` ahora se utiliza como `product-list.ts`.

## Conclusión

Esta estructura de carpetas está diseñada para promover un desarrollo organizado y mantenible, especialmente en aplicaciones grandes y complejas. Fomenta la separación de responsabilidades, mejora la testeabilidad y facilita la colaboración en equipo. Aunque puede parecer detallada al principio, proporciona una guía clara que ayuda a evitar el acoplamiento y a mantener la base del código saludable a largo plazo.
