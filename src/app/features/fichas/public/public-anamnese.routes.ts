import { Routes } from '@angular/router';

export const publicAnamneseRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public-anamnese.component').then(
        (m) => m.PublicAnamneseComponent
      ),
  },
];
