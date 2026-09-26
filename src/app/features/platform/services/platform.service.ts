import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse, Tenant } from '../models/platform.model';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  private http = inject(HttpClient);

  listTenants(): Observable<PageResponse<Tenant>> {
    const params = new HttpParams().set('size', 200).set('sort', 'name');
    return this.http.get<PageResponse<Tenant>>('/api/admin/tenants', { params });
  }
}
