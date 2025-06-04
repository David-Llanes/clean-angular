export interface MenuItem {
  url: string;
  key: string;
  icon: string;
  routerLink?: string;
  isLink?: boolean;
  items?: MenuItem[];
}

export interface NavigationGroup {
  sectionKey: string;
  items: MenuItem[];
}

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    sectionKey: 'Aplicación',
    items: [
      {
        url: 'admin',
        key: 'Administrador',
        icon: 'fa-solid fa-user-cog',
        items: [
          {
            url: 'admin/laboratory',
            key: 'Laboratorio',
            icon: 'fa-solid fa-flask',
            items: [
              {
                routerLink: 'admin/laboratory/analyses',
                url: 'admin/laboratory/analyses',
                key: 'Análisis de laboratorio',
                icon: 'fa-solid fa-vial',
                isLink: true,
              },
              {
                routerLink: 'admin/laboratory/profiles',
                url: 'admin/laboratory/profiles',
                key: 'Perfiles de laboratorio',
                icon: 'fa-solid fa-vials',
                isLink: true,
              },
            ],
          },
        ],
      },
      {
        url: 'patient',
        key: 'Paciente',
        icon: 'fa-solid fa-hospital-user',
        items: [
          {
            url: 'patient/patient-records',
            routerLink: 'patient/patient-records',
            key: 'Expedientes de pacientes',
            icon: 'fa-solid fa-book',
            isLink: true,
          },
          {
            url: 'patient/medical-notes',
            routerLink: 'patient/medical-notes',
            key: 'Notas médicas',
            icon: 'fa-solid fa-note-sticky',
            isLink: true,
          },
          {
            url: 'patient/clinical-history',
            routerLink: 'patient/clinical-history',
            key: 'Historial clínico',
            icon: 'fa-solid fa-book-medical',
            isLink: true,
          },
        ],
      },
      {
        url: 'hemodialysis',
        key: 'Hemodiálisis',
        icon: 'fa-solid fa-droplet',
        items: [
          {
            url: 'hemodialysis/patient',
            key: 'Paciente de hemodiálisis',
            icon: 'fa-solid fa-user-injured',
            items: [
              {
                routerLink: 'hemodialysis/patient/sessions',
                url: 'hemodialysis/patient/sessions',
                key: 'Sesiones',
                icon: 'fa-solid fa-calendar-check',
                isLink: true,
              },
              {
                routerLink: 'hemodialysis/patient/laboratories',
                url: 'hemodialysis/patient/laboratories',
                key: 'Laboratorios',
                icon: 'fa-solid fa-vials',
                isLink: true,
              },
              {
                url: 'hemodialysis/patient/laboratories/new',
                key: 'Nuevo',
                icon: 'fa-solid fa-plus',
              },
            ],
          },
          {
            routerLink: 'hemodialysis/configuration',
            url: 'hemodialysis/configuration',
            key: 'Configuración',
            icon: 'fa-solid fa-cogs',
            items: [
              {
                routerLink: 'hemodialysis/configuration/laboratory',
                url: 'hemodialysis/configuration/laboratory',
                key: 'Laboratorio',
                icon: 'fa-solid fa-flask',
                isLink: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    sectionKey: 'Administración',
    items: [
      {
        url: 'catalogs',
        routerLink: 'catalogs',
        isLink: true,
        key: 'Catálogos',
        icon: 'fa-solid fa-folder-open',
        items: [
          {
            routerLink: 'catalogs/administration-routes',
            url: 'catalogs/administration-routes',
            key: 'Rutas de administración',
            icon: 'fa-solid fa-map',
            isLink: true,
          },
          {
            routerLink: 'catalogs/allergies',
            url: 'catalogs/allergies',
            key: 'Alergias',
            icon: 'fa-solid fa-hand-dots',
            isLink: true,
          },
          {
            routerLink: 'catalogs/bacteria',
            url: 'catalogs/bacteria',
            key: 'Bacterias',
            icon: 'fa-solid fa-bacterium',
            isLink: true,
          },
          {
            routerLink: 'catalogs/blood-types',
            url: 'catalogs/blood-types',
            key: 'Tipos de sangre',
            icon: 'fa-solid fa-tint',
            isLink: true,
          },
          {
            routerLink: 'catalogs/data-types',
            url: 'catalogs/data-types',
            key: 'Tipos de datos',
            icon: 'fa-solid fa-database',
            isLink: true,
          },
          {
            routerLink: 'catalogs/diagnoses',
            url: 'catalogs/diagnoses',
            key: 'Diagnósticos',
            icon: 'fa-solid fa-stethoscope',
            isLink: true,
          },
          {
            routerLink: 'catalogs/educational-attainments',
            url: 'catalogs/educational-attainments',
            key: 'Nivel educativo',
            icon: 'fa-solid fa-graduation-cap',
            isLink: true,
          },
          {
            routerLink: 'catalogs/genders',
            url: 'catalogs/genders',
            key: 'Géneros',
            icon: 'fa-solid fa-venus-mars',
            isLink: true,
          },
          {
            routerLink: 'catalogs/insurance-provider-types',
            url: 'catalogs/insurance-provider-types',
            key: 'Tipos de aseguradoras',
            icon: 'fa-solid fa-shield-alt',
            isLink: true,
          },
          {
            routerLink: 'catalogs/insurance-providers',
            url: 'catalogs/insurance-providers',
            key: 'Aseguradoras',
            icon: 'fa-solid fa-hospital-user',
            isLink: true,
          },
          {
            routerLink: 'catalogs/kinships',
            url: 'catalogs/kinships',
            key: 'Parentescos',
            icon: 'fa-solid fa-people-arrows',
            isLink: true,
          },
          {
            routerLink: 'catalogs/loincs',
            url: 'catalogs/loincs',
            key: 'LOINCs',
            icon: 'fa-solid fa-code',
            isLink: true,
          },
          {
            routerLink: 'catalogs/magnitudes',
            url: 'catalogs/magnitudes',
            key: 'Magnitudes',
            icon: 'fa-solid fa-ruler-combined',
            isLink: true,
          },
          {
            routerLink: 'catalogs/marital-statuses',
            url: 'catalogs/marital-statuses',
            key: 'Estados civiles',
            icon: 'fa-solid fa-ring',
            isLink: true,
          },
          {
            routerLink: 'catalogs/measurement-units',
            url: 'catalogs/measurement-units',
            key: 'Unidades de medida',
            icon: 'fa-solid fa-balance-scale',
            isLink: true,
          },
          {
            routerLink: 'catalogs/occupations',
            url: 'catalogs/occupations',
            key: 'Ocupaciones',
            icon: 'fa-solid fa-briefcase',
            isLink: true,
          },
          {
            routerLink: 'catalogs/procedure-types',
            url: 'catalogs/procedure-types',
            key: 'Tipos de procedimientos',
            icon: 'fa-solid fa-procedures',
            isLink: true,
          },
          {
            routerLink: 'catalogs/procedures',
            url: 'catalogs/procedures',
            key: 'Procedimientos',
            icon: 'fa-solid fa-file-medical',
            isLink: true,
          },
          {
            routerLink: 'catalogs/religions',
            url: 'catalogs/religions',
            key: 'Religiones',
            icon: 'fa-solid fa-pray',
            isLink: true,
          },
          {
            routerLink: 'catalogs/symptom-types',
            url: 'catalogs/symptom-types',
            key: 'Tipos de síntomas',
            icon: 'fa-solid fa-thermometer',
            isLink: true,
          },
          {
            routerLink: 'catalogs/symptoms',
            url: 'catalogs/symptoms',
            key: 'Síntomas',
            icon: 'fa-solid fa-head-side-cough',
            isLink: true,
          },
        ],
      },
      {
        routerLink: 'organization',
        url: 'organization',
        key: 'Organización',
        icon: 'fa-solid fa-building',
        items: [
          {
            routerLink: 'organization/wizard',
            url: 'organization/wizard',
            key: 'Asistente (temporal)',
            icon: 'fa-solid fa-hat-wizard',
            isLink: true,
          },
          {
            routerLink: 'organization/configuration',
            url: 'organization/configuration',
            key: 'Configuración',
            icon: 'fa-solid fa-hospital',
            isLink: true,
          },
        ],
      },
    ],
  },
];
