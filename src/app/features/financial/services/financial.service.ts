import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateFinancialEntryRequest,
  FinancialEntry,
  FinancialSummary,
  FinancialTab,
  PageResponse,
  UpdateFinancialEntryRequest,
} from '../models/financial.model';

@Injectable({ providedIn: 'root' })
export class FinancialService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/financial';

  getSummary(): Observable<FinancialSummary> {
    return this.http.get<FinancialSummary>(`${this.baseUrl}/summary`);
  }

  listEntries(
    from: string,
    to: string,
    tab: FinancialTab,
    category?: string | null,
    page = 0,
    size = 20,
  ): Observable<PageResponse<FinancialEntry>> {
    const { type, expenseType } = this.resolveTabParams(tab);
    let params = new HttpParams()
      .set('from', from)
      .set('to', to)
      .set('page', page)
      .set('size', size);

    if (type) params = params.set('type', type);
    if (expenseType) params = params.set('expenseType', expenseType);
    if (category) params = params.set('category', category);

    return this.http.get<PageResponse<FinancialEntry>>(`${this.baseUrl}/entries`, { params });
  }

  create(req: CreateFinancialEntryRequest): Observable<FinancialEntry> {
    return this.http.post<FinancialEntry>(`${this.baseUrl}/entries`, req);
  }

  update(id: string, req: UpdateFinancialEntryRequest): Observable<FinancialEntry> {
    return this.http.put<FinancialEntry>(`${this.baseUrl}/entries/${id}`, req);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/entries/${id}`);
  }

  togglePaid(id: string): Observable<FinancialEntry> {
    return this.http.patch<FinancialEntry>(`${this.baseUrl}/entries/${id}/toggle-paid`, {});
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }

  private resolveTabParams(tab: FinancialTab): { type: string | null; expenseType: string | null } {
    if (tab === 'INCOME') return { type: 'INCOME', expenseType: null };
    return { type: 'EXPENSE', expenseType: tab };
  }
}
