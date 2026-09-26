import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/auth/auth.guard';
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { ClientDetailComponent } from './components/client-detail/client-detail.component';

export const clientsRoutes: Routes = [
  { path: '', component: ClientListComponent },
  { path: 'novo', component: ClientFormComponent, canActivate: [permissionGuard('client.create')] },
  { path: ':id', component: ClientDetailComponent },
  { path: ':id/editar', component: ClientFormComponent, canActivate: [permissionGuard('client.update')] },
];
