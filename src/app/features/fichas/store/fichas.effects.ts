import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap, withLatestFrom, mergeMap } from 'rxjs';
import { AnamneseService } from '../services/anamnese.service';
import { MappingService } from '../services/mapping.service';
import { FichasActions } from './fichas.actions';
import { selectFichasSearch, selectFichasPage } from './fichas.selectors';

@Injectable()
export class FichasEffects {
  private actions$ = inject(Actions);
  private anamneseService = inject(AnamneseService);
  private mappingService = inject(MappingService);
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  loadAnamneseSummaries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FichasActions.loadAnamneseSummaries),
      withLatestFrom(
        this.store.select(selectFichasSearch),
        this.store.select(selectFichasPage)
      ),
      switchMap(([, search, page]) =>
        this.anamneseService.list(search, page, 20).pipe(
          map(response => FichasActions.loadAnamneseSummariesSuccess({
            summaries: response.content,
            total: response.totalElements,
          })),
          catchError(err => of(FichasActions.loadAnamneseSummariesFailure({
            error: err.error?.message ?? 'Erro ao carregar anamneses',
          })))
        )
      )
    )
  );

  setSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FichasActions.setSearch),
      map(() => FichasActions.loadAnamneseSummaries())
    )
  );

  setPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FichasActions.setPage),
      map(() => FichasActions.loadAnamneseSummaries())
    )
  );

  loadAnamnese$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FichasActions.loadAnamnese),
      switchMap(({ clientId }) =>
        this.anamneseService.get(clientId).pipe(
          map(anamnese => FichasActions.loadAnamneseSuccess({ anamnese })),
          catchError(err => of(FichasActions.loadAnamneseFailure({
            error: err.error?.message ?? 'Erro ao carregar anamnese',
          })))
        )
      )
    )
  );

  saveAnamnese$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FichasActions.saveAnamnese),
      switchMap(({ clientId, request }) =>
        this.anamneseService.save(clientId, request).pipe(
          mergeMap(anamnese => {
            this.snackBar.open('Ficha salva com sucesso!', 'Fechar', {
              duration: 3000, panelClass: ['snack-success'],
            });
            return [FichasActions.saveAnamneseSuccess({ anamnese })];
          }),
          catchError(err => of(FichasActions.saveAnamneseFailure({
            error: err.error?.message ?? 'Erro ao salvar anamnese',
          })))
        )
      )
    )
  );

  generateLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FichasActions.generateLink),
      switchMap(({ clientId }) =>
        this.anamneseService.generateLink(clientId).pipe(
          map(response => FichasActions.generateLinkSuccess({ url: response.url })),
          catchError(err => of(FichasActions.generateLinkFailure({
            error: err.error?.message ?? 'Erro ao gerar link',
          })))
        )
      )
    )
  );

  loadMappingSummaries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FichasActions.loadMappingSummaries),
      withLatestFrom(
        this.store.select(selectFichasSearch),
        this.store.select(selectFichasPage)
      ),
      switchMap(([, search, page]) =>
        this.mappingService.list(search, page, 20).pipe(
          map(response => FichasActions.loadMappingSummariesSuccess({
            summaries: response.content,
            total: response.totalElements,
          })),
          catchError(err => of(FichasActions.loadMappingSummariesFailure({
            error: err.error?.message ?? 'Erro ao carregar mappings',
          })))
        )
      )
    )
  );

  loadClientMappings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FichasActions.loadClientMappings),
      switchMap(({ clientId }) =>
        this.mappingService.listByClient(clientId, 0, 50).pipe(
          map(response => FichasActions.loadClientMappingsSuccess({
            mappings: response.content,
            total: response.totalElements,
          })),
          catchError(err => of(FichasActions.loadClientMappingsFailure({
            error: err.error?.message ?? 'Erro ao carregar fichas do cliente',
          })))
        )
      )
    )
  );

  loadMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FichasActions.loadMapping),
      switchMap(({ id }) =>
        this.mappingService.get(id).pipe(
          map(mapping => FichasActions.loadMappingSuccess({ mapping })),
          catchError(err => of(FichasActions.loadMappingFailure({
            error: err.error?.message ?? 'Erro ao carregar ficha',
          })))
        )
      )
    )
  );

  createMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FichasActions.createMapping),
      switchMap(({ clientId, request }) =>
        this.mappingService.create(clientId, request).pipe(
          mergeMap(mapping => {
            this.snackBar.open('Ficha de mapping salva!', 'Fechar', {
              duration: 3000, panelClass: ['snack-success'],
            });
            this.router.navigate(['/fichas/mapping', clientId]);
            return [FichasActions.createMappingSuccess({ mapping })];
          }),
          catchError(err => of(FichasActions.createMappingFailure({
            error: err.error?.message ?? 'Erro ao criar ficha',
          })))
        )
      )
    )
  );

  updateMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FichasActions.updateMapping),
      switchMap(({ id, request }) =>
        this.mappingService.update(id, request).pipe(
          mergeMap(mapping => {
            this.snackBar.open('Ficha atualizada!', 'Fechar', {
              duration: 3000, panelClass: ['snack-success'],
            });
            return [FichasActions.updateMappingSuccess({ mapping })];
          }),
          catchError(err => of(FichasActions.updateMappingFailure({
            error: err.error?.message ?? 'Erro ao atualizar ficha',
          })))
        )
      )
    )
  );

  deleteMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FichasActions.deleteMapping),
      switchMap(({ id, clientId }) =>
        this.mappingService.delete(id).pipe(
          mergeMap(() => [
            FichasActions.deleteMappingSuccess({ id, clientId }),
            FichasActions.loadClientMappings({ clientId }),
          ]),
          catchError(err => of(FichasActions.deleteMappingFailure({
            error: err.error?.message ?? 'Erro ao excluir ficha',
          })))
        )
      )
    )
  );
}
