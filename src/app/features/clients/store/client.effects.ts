import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ClientService } from '../services/client.service';
import { ClientActions } from './client.actions';

@Injectable()
export class ClientEffects {
  private actions$ = inject(Actions);
  private clientService = inject(ClientService);
  private router = inject(Router);

  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClients),
      switchMap(({ search, page, active }) =>
        this.clientService.list(search ?? '', page ?? 0, 20, active).pipe(
          map((response) =>
            ClientActions.loadClientsSuccess({
              clients: response.content,
              totalElements: response.totalElements,
              page: response.page,
            })
          ),
          catchError((err) =>
            of(ClientActions.loadClientsFailure({
              error: err.error?.message ?? 'Erro ao carregar clientes',
            }))
          )
        )
      )
    )
  );

  selectClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.selectClient),
      switchMap(({ id }) =>
        this.clientService.getById(id).pipe(
          map((client) => ClientActions.selectClientSuccess({ client })),
          catchError((err) =>
            of(ClientActions.selectClientFailure({
              error: err.error?.message ?? 'Cliente não encontrado',
            }))
          )
        )
      )
    )
  );

  createClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.createClient),
      switchMap(({ request }) =>
        this.clientService.create(request).pipe(
          map((client) => ClientActions.createClientSuccess({ client })),
          catchError((err) =>
            of(ClientActions.createClientFailure({
              error: err.error?.message ?? 'Erro ao cadastrar cliente',
            }))
          )
        )
      )
    )
  );

  createClientSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ClientActions.createClientSuccess),
        tap(() => this.router.navigate(['/clients']))
      ),
    { dispatch: false }
  );

  updateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.updateClient),
      switchMap(({ id, request }) =>
        this.clientService.update(id, request).pipe(
          map((client) => ClientActions.updateClientSuccess({ client })),
          catchError((err) =>
            of(ClientActions.updateClientFailure({
              error: err.error?.message ?? 'Erro ao atualizar cliente',
            }))
          )
        )
      )
    )
  );

  updateClientSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ClientActions.updateClientSuccess),
        tap(({ client }) => this.router.navigate(['/clients', client.id]))
      ),
    { dispatch: false }
  );

  deactivateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.deactivateClient),
      switchMap(({ id, force }) =>
        this.clientService.deactivate(id, force).pipe(
          map(() => ClientActions.deactivateClientSuccess({ id })),
          catchError((err) => {
            if (err.status === 409 && err.error?.count) {
              const count = err.error.count;
              const msg = err.error.message || `Esta cliente tem ${count} agendamento(s) futuro(s). Desativar mesmo assim?`;
              if (confirm(msg)) {
                return of(ClientActions.deactivateClient({ id, force: true }));
              }
            }
            return of(ClientActions.deactivateClientFailure({
              error: err.error?.message ?? 'Erro ao desativar cliente',
            }));
          })
        )
      )
    )
  );

  reactivateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.reactivateClient),
      switchMap(({ id }) =>
        this.clientService.reactivate(id).pipe(
          map(() => ClientActions.reactivateClientSuccess({ id })),
          catchError((err) =>
            of(ClientActions.reactivateClientFailure({
              error: err.error?.message ?? 'Erro ao reativar cliente',
            }))
          )
        )
      )
    )
  );

  deleteClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.deleteClient),
      switchMap(({ id }) =>
        this.clientService.delete(id).pipe(
          map(() => ClientActions.deleteClientSuccess({ id })),
          catchError((err) =>
            of(ClientActions.deleteClientFailure({
              error: err.error?.message ?? 'Erro ao excluir cliente',
            }))
          )
        )
      )
    )
  );

  deleteClientSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ClientActions.deleteClientSuccess),
        tap(() => this.router.navigate(['/clients']))
      ),
    { dispatch: false }
  );
}
