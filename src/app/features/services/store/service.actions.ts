import { createAction, props } from '@ngrx/store';
import { Service, CreateServiceRequest } from '../../../core/models/service.model';

export const ServiceActions = {
  loadServices: createAction('[Services] Load Services', props<{ search?: string; page?: number; active?: boolean | null }>()),
  loadServicesSuccess: createAction('[Services] Load Services Success', props<{ services: Service[]; totalElements: number; page: number }>()),
  loadServicesFailure: createAction('[Services] Load Services Failure', props<{ error: string }>()),

  selectService: createAction('[Services] Select Service', props<{ id: string }>()),
  selectServiceSuccess: createAction('[Services] Select Service Success', props<{ service: Service }>()),
  selectServiceFailure: createAction('[Services] Select Service Failure', props<{ error: string }>()),
  clearSelectedService: createAction('[Services] Clear Selected Service'),

  createService: createAction('[Services] Create Service', props<{ request: CreateServiceRequest }>()),
  createServiceSuccess: createAction('[Services] Create Service Success', props<{ service: Service }>()),
  createServiceFailure: createAction('[Services] Create Service Failure', props<{ error: string }>()),

  updateService: createAction('[Services] Update Service', props<{ id: string; request: CreateServiceRequest }>()),
  updateServiceSuccess: createAction('[Services] Update Service Success', props<{ service: Service }>()),
  updateServiceFailure: createAction('[Services] Update Service Failure', props<{ error: string }>()),

  deactivateService: createAction('[Services] Deactivate Service', props<{ id: string; force?: boolean }>()),
  deactivateServiceSuccess: createAction('[Services] Deactivate Service Success', props<{ id: string }>()),
  deactivateServiceFailure: createAction('[Services] Deactivate Service Failure', props<{ error: string }>()),

  reactivateService: createAction('[Services] Reactivate Service', props<{ id: string }>()),
  reactivateServiceSuccess: createAction('[Services] Reactivate Service Success', props<{ id: string }>()),
  reactivateServiceFailure: createAction('[Services] Reactivate Service Failure', props<{ error: string }>()),

  deleteService: createAction('[Services] Delete Service', props<{ id: string }>()),
  deleteServiceSuccess: createAction('[Services] Delete Service Success', props<{ id: string }>()),
  deleteServiceFailure: createAction('[Services] Delete Service Failure', props<{ error: string }>()),
};
