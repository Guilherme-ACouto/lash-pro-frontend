import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Anamnese,
  AnamneseSummary,
  SaveAnamneseRequest,
  PageResponse,
  GenerateLinkResponse,
  AnamnesePublicResponse,
} from '../models/fichas.model';

@Injectable({ providedIn: 'root' })
export class AnamneseService {
  private http = inject(HttpClient);
  private readonly base = '/api/anamnese';

  list(search: string, page: number, size: number): Observable<PageResponse<AnamneseSummary>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('search', search ?? '');
    return this.http.get<PageResponse<AnamneseSummary>>(this.base, { params });
  }

  get(clientId: string): Observable<Anamnese> {
    return this.http.get<Anamnese>(`${this.base}/${clientId}`);
  }

  save(clientId: string, request: SaveAnamneseRequest): Observable<Anamnese> {
    return this.http.put<Anamnese>(`${this.base}/${clientId}`, request);
  }

  generateLink(clientId: string): Observable<GenerateLinkResponse> {
    return this.http.post<GenerateLinkResponse>(`${this.base}/${clientId}/link`, {});
  }

  getByToken(token: string): Observable<AnamnesePublicResponse> {
    return this.http.get<AnamnesePublicResponse>(`/api/public/anamnese/${token}`);
  }

  submitByToken(token: string, request: SaveAnamneseRequest): Observable<void> {
    return this.http.post<void>(`/api/public/anamnese/${token}`, request);
  }
}
