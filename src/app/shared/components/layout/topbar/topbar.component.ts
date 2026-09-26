import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthActions } from '../../../../features/auth/store/auth.actions';
import { selectBrand, selectCurrentUser } from '../../../../features/auth/store/auth.selectors';

/**
 * Barra do topo (como na Pontta): à direita, a unidade de negócio em que o usuário está e o menu
 * do usuário — Configurações (administrador), Trocar assinatura (equipe da plataforma) e Sair.
 */
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [AsyncPipe, RouterLink, MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule, MatTooltipModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  private store = inject(Store);

  /** Enquanto não existir public/brava-pro-logo.png, a imagem falha e cai no texto "✦ Brava Pro". */
  logoAvailable = true;

  user$ = this.store.select(selectCurrentUser);
  brand$ = this.store.select(selectBrand);

  exitSupport(): void {
    this.store.dispatch(AuthActions.exitSupport());
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
