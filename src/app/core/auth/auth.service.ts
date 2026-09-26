import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Brand,
  InvitationDetails,
  LoginRequest,
  LoginResponse,
  SupportSession,
  User,
} from '../models/auth.model';

/** Chave onde ficam os tokens da própria conta enquanto a equipe da plataforma está em modo suporte. */
const SUPPORT_ORIGIN_KEY = 'support_origin_tokens';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/auth';

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request);
  }

  me(): Observable<User> {
    return this.http.get<User>('/api/me');
  }

  brand(): Observable<Brand> {
    return this.http.get<Brand>('/api/brand');
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, { token, password });
  }

  getInvitation(token: string): Observable<InvitationDetails> {
    return this.http.get<InvitationDetails>(`/api/invitation/${token}`);
  }

  acceptInvitation(token: string, name: string, password: string): Observable<void> {
    return this.http.post<void>('/api/invitation/accept', { token, name, password });
  }

  enterTenant(tenantId: string): Observable<SupportSession> {
    return this.http.post<SupportSession>(`/api/admin/tenants/${tenantId}/enter`, {});
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem(SUPPORT_ORIGIN_KEY);
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  /** Guarda os tokens da própria conta antes de entrar em outra assinatura (modo suporte). */
  stashOwnTokens(): void {
    if (sessionStorage.getItem(SUPPORT_ORIGIN_KEY)) return;
    sessionStorage.setItem(
      SUPPORT_ORIGIN_KEY,
      JSON.stringify({
        accessToken: localStorage.getItem('access_token'),
        refreshToken: localStorage.getItem('refresh_token'),
      })
    );
  }

  /** Volta pros tokens da própria conta ao sair do modo suporte. */
  restoreOwnTokens(): boolean {
    const stored = sessionStorage.getItem(SUPPORT_ORIGIN_KEY);
    if (!stored) return false;
    const { accessToken, refreshToken } = JSON.parse(stored);
    sessionStorage.removeItem(SUPPORT_ORIGIN_KEY);
    if (!accessToken) return false;
    this.saveTokens(accessToken, refreshToken ?? '');
    return true;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
