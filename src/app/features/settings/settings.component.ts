import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { TeamUsersComponent } from './components/team-users/team-users.component';
import { BusinessUnitFormComponent } from './components/business-unit-form/business-unit-form.component';

/** Administração da assinatura (só administradores — ver adminGuard). */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, TeamUsersComponent, BusinessUnitFormComponent],
  template: `
    <div class="settings-page">
      <div class="settings-header">
        <h1>Configurações</h1>
        <p>Equipe, permissões e cadastro da empresa</p>
      </div>

      <mat-tab-group animationDuration="150ms" class="settings-tabs">
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>group</mat-icon>
            <span class="tab-label">Equipe</span>
          </ng-template>
          <div class="tab-body"><app-team-users /></div>
        </mat-tab>
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>storefront</mat-icon>
            <span class="tab-label">Unidade de negócio</span>
          </ng-template>
          <ng-template matTabContent>
            <div class="tab-body"><app-business-unit-form /></div>
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: `
    .settings-page {
      max-width: 1100px;
      margin: 0 auto;
    }
    .settings-header h1 {
      font-family: var(--font-brand);
      font-weight: 400;
      font-size: 28px;
      margin: 0;
      color: var(--color-text);
    }
    .settings-header p {
      margin: 4px 0 16px;
      color: var(--color-text-secondary);
    }
    .tab-label {
      margin-left: 8px;
    }
    .tab-body {
      padding-top: 20px;
    }
  `,
})
export class SettingsComponent {}
