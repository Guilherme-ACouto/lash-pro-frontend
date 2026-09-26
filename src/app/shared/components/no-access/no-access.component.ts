import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Usuário sem nenhuma permissão de leitura: nada pra mostrar até o administrador liberar algo. */
@Component({
  selector: 'app-no-access',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="no-access">
      <mat-icon>lock</mat-icon>
      <h1>Sem acesso liberado</h1>
      <p>Seu usuário ainda não tem permissão para nenhum módulo. Fale com o administrador da assinatura.</p>
    </div>
  `,
  styles: `
    .no-access {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 8px;
      min-height: 60vh;
      padding: 24px;
      color: var(--color-text-secondary);
    }
    mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--color-primary);
    }
    h1 {
      font-family: var(--font-brand);
      font-weight: 400;
      color: var(--color-text);
      margin: 8px 0 0;
    }
    p {
      max-width: 420px;
      margin: 0;
    }
  `,
})
export class NoAccessComponent {}
