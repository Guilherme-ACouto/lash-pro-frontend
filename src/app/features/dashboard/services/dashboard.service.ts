import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData, DashboardPeriod } from '../../../core/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/dashboard';

  get(period: DashboardPeriod): Observable<DashboardData> {
    const params = new HttpParams().set('period', period);
    return this.http.get<DashboardData>(this.baseUrl, { params });
  }
}
