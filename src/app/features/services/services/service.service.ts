import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../../../core/models/api.model';
import { Service, CreateServiceRequest } from '../../../core/models/service.model';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/services';

  list(search = '', page = 0, size = 20, active?: boolean | null): Observable<PageResponse<Service>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'name,asc')
      .set('search', search);
    if (active !== undefined && active !== null) {
      params = params.set('active', String(active));
    }
    return this.http.get<PageResponse<Service>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateServiceRequest): Observable<Service> {
    return this.http.post<Service>(this.baseUrl, request);
  }

  update(id: string, request: CreateServiceRequest): Observable<void> {
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
