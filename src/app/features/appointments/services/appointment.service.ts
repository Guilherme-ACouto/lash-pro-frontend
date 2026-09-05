import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, CreateAppointmentRequest } from '../../../core/models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/appointments';

  listByDate(date: string): Observable<Appointment[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<Appointment[]>(this.baseUrl, { params });
  }

  listByDateRange(startDate: string, endDate: string): Observable<Appointment[]> {
    const params = new HttpParams().set('date', startDate).set('endDate', endDate);
    return this.http.get<Appointment[]>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/${id}`);
  }

  create(req: CreateAppointmentRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.baseUrl, req);
  }

  update(id: string, req: CreateAppointmentRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, req);
  }

  confirm(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/confirm`, {});
  }

  complete(id: string, paymentMethod: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/complete`, { paymentMethod });
  }

  cancel(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/cancel`, {});
  }

  noShow(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/no-show`, {});
  }
}
