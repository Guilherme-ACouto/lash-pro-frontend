import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  BusinessUnit,
  CepAddress,
  InviteUserRequest,
  TeamInvite,
  TeamUser,
  UpdateBusinessUnitRequest,
  UpdateTeamUserRequest,
} from '../models/settings.model';

interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean | string;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private http = inject(HttpClient);
  private readonly usersUrl = '/api/settings/users';
  private readonly invitesUrl = '/api/settings/invites';
  private readonly businessUnitUrl = '/api/settings/business-unit';

  // ── Usuários ──
  listUsers(): Observable<TeamUser[]> {
    return this.http.get<TeamUser[]>(this.usersUrl);
  }

  updateUser(id: string, request: UpdateTeamUserRequest): Observable<void> {
    return this.http.put<void>(`${this.usersUrl}/${id}`, request);
  }

  deactivateUser(id: string): Observable<void> {
    return this.http.patch<void>(`${this.usersUrl}/${id}/deactivate`, {});
  }

  reactivateUser(id: string): Observable<void> {
    return this.http.patch<void>(`${this.usersUrl}/${id}/reactivate`, {});
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.usersUrl}/${id}`);
  }

  resetPassword(id: string): Observable<void> {
    return this.http.post<void>(`${this.usersUrl}/${id}/reset-password`, {});
  }

  endSessions(id: string): Observable<void> {
    return this.http.post<void>(`${this.usersUrl}/${id}/end-sessions`, {});
  }

  // ── Convites ──
  listInvites(): Observable<TeamInvite[]> {
    return this.http.get<TeamInvite[]>(this.invitesUrl);
  }

  invite(request: InviteUserRequest): Observable<unknown> {
    return this.http.post(this.invitesUrl, request);
  }

  resendInvite(id: string): Observable<void> {
    return this.http.post<void>(`${this.invitesUrl}/${id}/resend`, {});
  }

  cancelInvite(id: string): Observable<void> {
    return this.http.delete<void>(`${this.invitesUrl}/${id}`);
  }

  // ── Unidade de negócio ──
  getBusinessUnit(): Observable<BusinessUnit> {
    return this.http.get<BusinessUnit>(this.businessUnitUrl);
  }

  updateBusinessUnit(id: string, request: UpdateBusinessUnitRequest): Observable<void> {
    return this.http.put<void>(`${this.businessUnitUrl}/${id}`, request);
  }

  uploadLogo(id: string, file: File): Observable<BusinessUnit> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<BusinessUnit>(`${this.businessUnitUrl}/${id}/logo`, form);
  }

  removeLogo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.businessUnitUrl}/${id}/logo`);
  }

  /** Endereço pelo CEP (ViaCEP, público e sem chave). Não passa pelo backend nem leva o token. */
  lookupCep(cep: string): Observable<CepAddress | null> {
    return this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`).pipe(
      map((r) =>
        r.erro
          ? null
          : { street: r.logradouro, district: r.bairro, city: r.localidade, state: r.uf }
      )
    );
  }
}
