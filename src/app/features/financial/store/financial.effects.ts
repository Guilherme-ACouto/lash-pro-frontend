import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { FinancialService } from '../services/financial.service';
import * as FinancialActions from './financial.actions';
import {
  selectActiveTab,
  selectCategory,
  selectCustomFrom,
  selectCustomTo,
  selectPeriod,
} from './financial.selectors';
import { FinancialPeriod, FinancialTab } from '../models/financial.model';

@Injectable()
export class FinancialEffects {
  private actions$ = inject(Actions);
  private service = inject(FinancialService);
  private store = inject(Store);

  loadSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialActions.loadSummary),
      switchMap(() =>
        this.service.getSummary().pipe(
          map((summary) => FinancialActions.loadSummarySuccess({ summary })),
          catchError((err) =>
            of(FinancialActions.loadSummaryFailure({ error: err.error?.message ?? 'Erro ao carregar resumo' })),
          ),
        ),
      ),
    ),
  );

  loadEntries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialActions.loadEntries),
      withLatestFrom(
        this.store.select(selectPeriod),
        this.store.select(selectCustomFrom),
        this.store.select(selectCustomTo),
        this.store.select(selectActiveTab),
        this.store.select(selectCategory),
      ),
      switchMap(([, period, customFrom, customTo, tab, category]) => {
        const { from, to } = resolveDateRange(period, customFrom, customTo);
        return this.service.listEntries(from, to, tab, category).pipe(
          map((page) =>
            FinancialActions.loadEntriesSuccess({
              entries: page.content,
              totalEntries: page.totalElements,
            }),
          ),
          catchError((err) =>
            of(FinancialActions.loadEntriesFailure({ error: err.error?.message ?? 'Erro ao carregar lançamentos' })),
          ),
        );
      }),
    ),
  );

  setTab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialActions.setTab),
      map(() => FinancialActions.loadEntries()),
    ),
  );

  setPeriod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialActions.setPeriod, FinancialActions.setCustomDates),
      map(() => FinancialActions.loadEntries()),
    ),
  );

  setCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialActions.setCategory),
      map(() => FinancialActions.loadEntries()),
    ),
  );

  togglePaid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialActions.togglePaid),
      switchMap(({ id }) =>
        this.service.togglePaid(id).pipe(
          switchMap(() => [FinancialActions.togglePaidSuccess({ entry: {} as any }), FinancialActions.loadEntries()]),
          catchError((err) =>
            of(FinancialActions.togglePaidFailure({ error: err.error?.message ?? 'Erro ao atualizar' })),
          ),
        ),
      ),
    ),
  );

  createEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialActions.createEntry),
      switchMap(({ request }) =>
        this.service.create(request).pipe(
          switchMap(() => [
            FinancialActions.createEntrySuccess(),
            FinancialActions.loadSummary(),
            FinancialActions.loadEntries(),
            FinancialActions.loadCategories(),
          ]),
          catchError((err) =>
            of(FinancialActions.createEntryFailure({ error: err.error?.message ?? 'Erro ao criar lançamento' })),
          ),
        ),
      ),
    ),
  );

  updateEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialActions.updateEntry),
      switchMap(({ id, request }) =>
        this.service.update(id, request).pipe(
          switchMap(() => [
            FinancialActions.updateEntrySuccess(),
            FinancialActions.loadSummary(),
            FinancialActions.loadEntries(),
            FinancialActions.loadCategories(),
          ]),
          catchError((err) =>
            of(FinancialActions.updateEntryFailure({ error: err.error?.message ?? 'Erro ao atualizar' })),
          ),
        ),
      ),
    ),
  );

  deleteEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialActions.deleteEntry),
      switchMap(({ id }) =>
        this.service.delete(id).pipe(
          switchMap(() => [
            FinancialActions.deleteEntrySuccess(),
            FinancialActions.loadSummary(),
            FinancialActions.loadEntries(),
            FinancialActions.loadCategories(),
          ]),
          catchError((err) =>
            of(FinancialActions.deleteEntryFailure({ error: err.error?.message ?? 'Erro ao excluir' })),
          ),
        ),
      ),
    ),
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FinancialActions.loadCategories),
      switchMap(() =>
        this.service.getCategories().pipe(
          map((categories) => FinancialActions.loadCategoriesSuccess({ categories })),
          catchError((err) =>
            of(FinancialActions.loadCategoriesFailure({ error: err.error?.message ?? 'Erro ao carregar categorias' })),
          ),
        ),
      ),
    ),
  );
}

function resolveDateRange(
  period: FinancialPeriod,
  customFrom: string | null,
  customTo: string | null,
): { from: string; to: string } {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split('T')[0];

  switch (period) {
    case 'TODAY':
      return { from: fmt(today), to: fmt(today) };
    case 'THIS_WEEK': {
      const day = today.getDay();
      const mon = new Date(today);
      mon.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
      return { from: fmt(mon), to: fmt(today) };
    }
    case 'THIS_MONTH': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { from: fmt(start), to: fmt(end) };
    }
    case 'NEXT_MONTH': {
      const start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      return { from: fmt(start), to: fmt(end) };
    }
    case 'LAST_30': {
      const from = new Date(today);
      from.setDate(today.getDate() - 30);
      return { from: fmt(from), to: fmt(today) };
    }
    case 'LAST_90': {
      const from = new Date(today);
      from.setDate(today.getDate() - 90);
      return { from: fmt(from), to: fmt(today) };
    }
    case 'THIS_YEAR': {
      const start = new Date(today.getFullYear(), 0, 1);
      return { from: fmt(start), to: fmt(today) };
    }
    case 'CUSTOM':
      return { from: customFrom ?? fmt(today), to: customTo ?? fmt(today) };
    default:
      return { from: fmt(today), to: fmt(today) };
  }
}
