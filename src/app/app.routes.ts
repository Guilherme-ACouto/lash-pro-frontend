import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'ficha/:token',
    loadChildren: () =>
      import('./features/fichas/public/public-anamnese.routes').then(
        (m) => m.publicAnamneseRoutes
      ),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'clients',
        loadChildren: () => import('./features/clients/clients.routes').then((m) => m.clientsRoutes),
      },
      {
        path: 'appointments',
        loadChildren: () => import('./features/appointments/appointments.routes').then((m) => m.appointmentsRoutes),
      },
      {
        path: 'services',
        loadChildren: () => import('./features/services/services.routes').then((m) => m.servicesRoutes),
      },
      {
        path: 'financial',
        loadChildren: () => import('./features/financial/financial.routes').then((m) => m.financialRoutes),
      },
      {
        path: 'inventory',
        loadChildren: () => import('./features/inventory/inventory.routes').then((m) => m.inventoryRoutes),
      },
      {
        path: 'fichas',
        loadChildren: () =>
          import('./features/fichas/fichas.routes').then((m) => m.fichasRoutes),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
