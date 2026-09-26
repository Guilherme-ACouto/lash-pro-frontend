import { createAction, props } from '@ngrx/store';
import { Tenant } from '../models/platform.model';

export const PlatformActions = {
  loadTenants: createAction('[Platform] Load Tenants'),
  loadTenantsSuccess: createAction('[Platform] Load Tenants Success', props<{ tenants: Tenant[] }>()),
  loadTenantsFailure: createAction('[Platform] Load Tenants Failure', props<{ error: string }>()),
};
