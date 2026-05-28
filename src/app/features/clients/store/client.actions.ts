import { createAction, props } from '@ngrx/store';
import { Client, CreateClientRequest } from '../../../core/models/client.model';

export const ClientActions = {
  loadClients: createAction(
    '[Clients] Load Clients',
    props<{ search?: string; page?: number; active?: boolean | null }>()
  ),
  loadClientsSuccess: createAction(
    '[Clients] Load Clients Success',
    props<{ clients: Client[]; totalElements: number; page: number }>()
  ),
  loadClientsFailure: createAction(
    '[Clients] Load Clients Failure',
    props<{ error: string }>()
  ),

  selectClient: createAction(
    '[Clients] Select Client',
    props<{ id: string }>()
  ),
  selectClientSuccess: createAction(
    '[Clients] Select Client Success',
    props<{ client: Client }>()
  ),
  selectClientFailure: createAction(
    '[Clients] Select Client Failure',
    props<{ error: string }>()
  ),
  clearSelectedClient: createAction('[Clients] Clear Selected Client'),

  createClient: createAction(
    '[Clients] Create Client',
    props<{ request: CreateClientRequest }>()
  ),
  createClientSuccess: createAction(
    '[Clients] Create Client Success',
    props<{ client: Client }>()
  ),
  createClientFailure: createAction(
    '[Clients] Create Client Failure',
    props<{ error: string }>()
  ),

  updateClient: createAction(
    '[Clients] Update Client',
    props<{ id: string; request: CreateClientRequest }>()
  ),
  updateClientSuccess: createAction(
    '[Clients] Update Client Success',
    props<{ client: Client }>()
  ),
  updateClientFailure: createAction(
    '[Clients] Update Client Failure',
    props<{ error: string }>()
  ),

  deactivateClient: createAction(
    '[Clients] Deactivate Client',
    props<{ id: string; force?: boolean }>()
  ),
  deactivateClientSuccess: createAction(
    '[Clients] Deactivate Client Success',
    props<{ id: string }>()
  ),
  deactivateClientFailure: createAction(
    '[Clients] Deactivate Client Failure',
    props<{ error: string }>()
  ),

  reactivateClient: createAction(
    '[Clients] Reactivate Client',
    props<{ id: string }>()
  ),
  reactivateClientSuccess: createAction(
    '[Clients] Reactivate Client Success',
    props<{ id: string }>()
  ),
  reactivateClientFailure: createAction(
    '[Clients] Reactivate Client Failure',
    props<{ error: string }>()
  ),

  deleteClient: createAction('[Clients] Delete Client', props<{ id: string }>()),
  deleteClientSuccess: createAction('[Clients] Delete Client Success', props<{ id: string }>()),
  deleteClientFailure: createAction('[Clients] Delete Client Failure', props<{ error: string }>()),
};
