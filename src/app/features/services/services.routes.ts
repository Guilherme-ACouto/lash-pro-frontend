import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/auth/auth.guard';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { ServiceFormComponent } from './components/service-form/service-form.component';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';

export const servicesRoutes: Routes = [
  { path: '', component: ServiceListComponent },
  { path: 'novo', component: ServiceFormComponent, canActivate: [permissionGuard('service.create')] },
  { path: ':id', component: ServiceDetailComponent },
  { path: ':id/editar', component: ServiceFormComponent, canActivate: [permissionGuard('service.update')] },
];
