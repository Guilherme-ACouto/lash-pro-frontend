import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LashMapping,
  MappingSummary,
  CreateMappingRequest,
  PageResponse,
} from '../models/fichas.model';

@Injectable({ providedIn: 'root' })
export class MappingService {
  private http = inject(HttpClient);
  private readonly base = '/api/mappings';

  list(search: string, page: number, size: number): Observable<PageResponse<MappingSummary>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('search', search ?? '');
    return this.http.get<PageResponse<MappingSummary>>(this.base, { params });
  }

  listByClient(clientId: string, page: number, size: number): Observable<PageResponse<LashMapping>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<LashMapping>>(`${this.base}/client/${clientId}`, { params });
  }

  get(id: string): Observable<LashMapping> {
    return this.http.get<LashMapping>(`${this.base}/${id}`);
  }

  create(clientId: string, request: CreateMappingRequest): Observable<LashMapping> {
    return this.http.post<LashMapping>(`${this.base}/client/${clientId}`, request);
  }

  update(id: string, request: CreateMappingRequest): Observable<LashMapping> {
    return this.http.put<LashMapping>(`${this.base}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
