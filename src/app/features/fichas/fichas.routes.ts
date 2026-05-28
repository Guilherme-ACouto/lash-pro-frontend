import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { FichasComponent } from './fichas.component';
import { fichasReducer } from './store/fichas.reducer';
import { FichasEffects } from './store/fichas.effects';

export const fichasRoutes: Routes = [
  {
    path: '',
    component: FichasComponent,
    providers: [
      provideState('fichas', fichasReducer),
      provideEffects(FichasEffects),
    ],
    children: [
      { path: '', redirectTo: 'anamnese', pathMatch: 'full' },
      {
        path: 'anamnese',
        loadComponent: () =>
          import('./components/anamnese-list/anamnese-list.component').then(
            (m) => m.AnamneseListComponent
          ),
      },
      {
        path: 'anamnese/:clientId',
        loadComponent: () =>
          import('./components/anamnese-form/anamnese-form.component').then(
            (m) => m.AnamneseFormComponent
          ),
      },
      {
        path: 'mapping',
        loadComponent: () =>
          import('./components/mapping-list/mapping-list.component').then(
            (m) => m.MappingListComponent
          ),
      },
      {
        path: 'mapping/:clientId',
        loadComponent: () =>
          import('./components/mapping-history/mapping-history.component').then(
            (m) => m.MappingHistoryComponent
          ),
      },
      {
        path: 'mapping/:clientId/:id',
        loadComponent: () =>
          import('./components/mapping-form/mapping-form.component').then(
            (m) => m.MappingFormComponent
          ),
      },
    ],
  },
];
