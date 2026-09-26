import { Routes } from '@angular/router';
import { TenantsComponent } from './tenants/tenants.component';

export const platformRoutes: Routes = [
  { path: '', redirectTo: 'tenants', pathMatch: 'full' },
  { path: 'tenants', component: TenantsComponent },
];
