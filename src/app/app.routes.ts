import { Routes } from '@angular/router';
import { adminGuard, authGuard, permissionGuard, platformAdminGuard } from './core/auth/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { NoAccessComponent } from './shared/components/no-access/no-access.component';

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
        canActivate: [permissionGuard('dashboard')],
        loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'clients',
        canActivate: [permissionGuard('client')],
        loadChildren: () => import('./features/clients/clients.routes').then((m) => m.clientsRoutes),
      },
      {
        path: 'appointments',
        canActivate: [permissionGuard('appointment')],
        loadChildren: () => import('./features/appointments/appointments.routes').then((m) => m.appointmentsRoutes),
      },
      {
        path: 'services',
        canActivate: [permissionGuard('service')],
        loadChildren: () => import('./features/services/services.routes').then((m) => m.servicesRoutes),
      },
      {
        path: 'financial',
        canActivate: [permissionGuard('financial')],
        loadChildren: () => import('./features/financial/financial.routes').then((m) => m.financialRoutes),
      },
      {
        path: 'inventory',
        canActivate: [permissionGuard('inventory')],
        loadChildren: () => import('./features/inventory/inventory.routes').then((m) => m.inventoryRoutes),
      },
      {
        path: 'fichas',
        canActivate: [permissionGuard('record')],
        loadChildren: () =>
          import('./features/fichas/fichas.routes').then((m) => m.fichasRoutes),
      },
      {
        path: 'settings',
        canActivate: [adminGuard],
        loadChildren: () => import('./features/settings/settings.routes').then((m) => m.settingsRoutes),
      },
      {
        path: 'platform',
        canActivate: [platformAdminGuard],
        loadChildren: () => import('./features/platform/platform.routes').then((m) => m.platformRoutes),
      },
      { path: 'sem-acesso', component: NoAccessComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
