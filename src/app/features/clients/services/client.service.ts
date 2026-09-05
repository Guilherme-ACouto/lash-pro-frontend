import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, CreateClientRequest } from '../../../core/models/client.model';
import { PageResponse } from '../../../core/models/api.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/clients';

  list(search: string = '', page = 0, size = 20, active?: boolean | null): Observable<PageResponse<Client>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'name,asc')
      .set('search', search);
    if (active !== undefined && active !== null) {
      params = params.set('active', String(active));
    }
    return this.http.get<PageResponse<Client>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateClientRequest): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, request);
  }

  update(id: string, request: CreateClientRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  deactivate(id: string, force = false): Observable<void> {
    const params = force ? new HttpParams().set('force', 'true') : new HttpParams();
    return this.http.patch<void>(`${this.baseUrl}/${id}/deactivate`, {}, { params });
  }

  reactivate(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/reactivate`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
