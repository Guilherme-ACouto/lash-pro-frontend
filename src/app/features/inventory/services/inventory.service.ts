import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  InventoryItem,
  InventoryMovement,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  RegisterPurchaseRequest,
  RegisterManualExitRequest,
  RegisterPurchaseResult,
  PageResponse,
  InventoryStatusFilter,
} from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private readonly base = '/api/inventory/items';

  list(
    search: string,
    status: InventoryStatusFilter,
    lowStockOnly: boolean,
    page: number,
    size: number
  ): Observable<PageResponse<InventoryItem>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('search', search)
      .set('status', status);

    if (lowStockOnly) {
      params = params.set('filter', 'LOW_STOCK');
    }

    return this.http.get<PageResponse<InventoryItem>>(this.base, { params });
  }

  get(id: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.base}/${id}`);
  }

  create(request: CreateInventoryItemRequest): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.base, request);
  }

  update(id: string, request: UpdateInventoryItemRequest): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.base}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  deactivate(id: string): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${this.base}/${id}/deactivate`, {});
  }

  reactivate(id: string): Observable<InventoryItem> {
    return this.http.patch<InventoryItem>(`${this.base}/${id}/reactivate`, {});
  }

  registerPurchase(id: string, request: RegisterPurchaseRequest): Observable<RegisterPurchaseResult> {
    return this.http.post<RegisterPurchaseResult>(`${this.base}/${id}/purchase`, request);
  }

  registerExit(id: string, request: RegisterManualExitRequest): Observable<InventoryMovement> {
    return this.http.post<InventoryMovement>(`${this.base}/${id}/exit`, request);
  }

  listMovements(id: string, page: number, size: number): Observable<PageResponse<InventoryMovement>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<PageResponse<InventoryMovement>>(`${this.base}/${id}/movements`, { params });
  }
}
