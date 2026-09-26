import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthActions } from '../../auth/store/auth.actions';
import { selectCurrentUser } from '../../auth/store/auth.selectors';
import { PlatformActions } from '../store/platform.actions';
import { selectTenants, selectTenantsLoading } from '../store/platform.reducer';
import { Tenant } from '../models/platform.model';

/** Equipe da plataforma (e-mail @bravapro.com.br): lista as assinaturas e entra em modo suporte. */
@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [AsyncPipe, DatePipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="page">
      <div class="header">
        <h1>Assinaturas</h1>
        <p>Área da equipe Brava Pro — entre numa assinatura para dar suporte. Tudo o que você fizer lá fica registrado com o seu e-mail.</p>
      </div>

      <div class="card">
        @if (loading$ | async) {
          <div class="loading"><mat-progress-spinner diameter="32" mode="indeterminate" /></div>
        }
        @for (tenant of tenants$ | async; track tenant.id) {
          <div class="row" [class.inactive]="!tenant.active">
            <div class="avatar">{{ tenant.name.charAt(0).toUpperCase() }}</div>
            <div class="info">
              <span class="name">{{ tenant.name }}</span>
              <span class="meta">
                Desde {{ tenant.createdAt | date: 'dd/MM/yyyy' }}
                @if (!tenant.active) { · <strong>inativa</strong> }
                @if (tenant.id === (me$ | async)?.tenantId) { · sua assinatura }
              </span>
            </div>
            <button mat-stroked-button [disabled]="!tenant.active" (click)="enter(tenant)">
              <mat-icon>login</mat-icon>
              Entrar
            </button>
          </div>
        } @empty {
          @if (!(loading$ | async)) {
            <p class="empty">Nenhuma assinatura encontrada.</p>
          }
        }
      </div>
    </div>
  `,
  styles: `
    .page { max-width: 900px; margin: 0 auto; }
    .header h1 { font-family: var(--font-brand); font-weight: 400; font-size: 28px; margin: 0; color: var(--color-text); }
    .header p { margin: 4px 0 16px; color: var(--color-text-secondary); }
    .card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-card); box-shadow: var(--shadow-card); overflow: hidden; }
    .row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-bottom: 1px solid var(--color-border); }
    .row:last-child { border-bottom: none; }
    .row.inactive { opacity: 0.6; }
    .avatar { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: var(--color-primary-soft); color: var(--color-primary); font-weight: 600; flex-shrink: 0; }
    .info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .name { font-weight: 600; color: var(--color-text); }
    .meta { font-size: 13px; color: var(--color-text-secondary); }
    .loading { display: flex; justify-content: center; padding: 24px; }
    .empty { padding: 24px; text-align: center; color: var(--color-text-secondary); }
  `,
})
export class TenantsComponent implements OnInit {
  private store = inject(Store);

  tenants$ = this.store.select(selectTenants);
  loading$ = this.store.select(selectTenantsLoading);
  me$ = this.store.select(selectCurrentUser);

  ngOnInit(): void {
    this.store.dispatch(PlatformActions.loadTenants());
  }

  enter(tenant: Tenant): void {
    this.store.dispatch(AuthActions.enterTenant({ tenantId: tenant.id }));
  }
}
