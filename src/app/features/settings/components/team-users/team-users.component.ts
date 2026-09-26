import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogService } from '../../../../shared/components/confirm-dialog/confirm-dialog.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { selectCurrentUser } from '../../../auth/store/auth.selectors';
import { PERMISSION_MODULES, TeamInvite, TeamUser } from '../../models/settings.model';
import { SettingsActions } from '../../store/settings.actions';
import { selectSettingsLoading, selectTeamInvites, selectTeamUsers } from '../../store/settings.selectors';
import { TeamUserFormComponent, TeamUserFormData } from '../team-user-form/team-user-form.component';

@Component({
  selector: 'app-team-users',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './team-users.component.html',
  styleUrl: './team-users.component.css',
})
export class TeamUsersComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private confirmDialog = inject(ConfirmDialogService);
  private snackbar = inject(SnackbarService);

  users$ = this.store.select(selectTeamUsers);
  invites$ = this.store.select(selectTeamInvites);
  loading$ = this.store.select(selectSettingsLoading);
  me$ = this.store.select(selectCurrentUser);

  ngOnInit(): void {
    this.store.dispatch(SettingsActions.loadTeam());
  }

  /** Resumo do acesso pra lista: "Administrador" ou os módulos que a pessoa pode ver. */
  accessSummary(user: TeamUser | TeamInvite): string {
    if (user.admin) return 'Acesso total';
    const modules = PERMISSION_MODULES.filter((m) => user.permissions.includes(m.key)).map((m) => m.label);
    return modules.length ? modules.join(' · ') : 'Nenhum módulo liberado';
  }

  openInvite(): void {
    this.openForm({ mode: 'invite' });
  }

  edit(user: TeamUser): void {
    this.openForm({ mode: 'edit', user });
  }

  private openForm(data: TeamUserFormData): void {
    this.dialog.open<TeamUserFormComponent, TeamUserFormData>(TeamUserFormComponent, {
      data,
      maxWidth: '760px',
      width: '100%',
      panelClass: 'settings-dialog-panel',
    });
  }

  deactivate(user: TeamUser): void {
    this.confirmDialog
      .confirm({
        title: 'Inativar usuário',
        message: `"${user.name}" perde o acesso na hora (inclusive se estiver logado agora). O histórico continua salvo e você pode reativar quando quiser.`,
        confirmLabel: 'Inativar',
        variant: 'primary',
        icon: 'block',
      })
      .subscribe((ok) => ok && this.store.dispatch(SettingsActions.deactivateUser({ id: user.id })));
  }

  reactivate(user: TeamUser): void {
    this.store.dispatch(SettingsActions.reactivateUser({ id: user.id }));
  }

  delete(user: TeamUser): void {
    this.confirmDialog
      .confirm({
        title: 'Excluir usuário',
        message: `Excluir "${user.name}" permanentemente? Só é possível para quem nunca fez nada no sistema — quem já tem histórico deve ser inativado.`,
        confirmLabel: 'Excluir',
        variant: 'danger',
      })
      .subscribe((ok) => ok && this.store.dispatch(SettingsActions.deleteUser({ id: user.id })));
  }

  resetPassword(user: TeamUser): void {
    this.confirmDialog
      .confirm({
        title: 'Redefinir senha',
        message: `Enviar para ${user.email} um e-mail com o link para criar uma nova senha? A senha atual continua valendo até a nova ser criada.`,
        confirmLabel: 'Enviar e-mail',
        variant: 'primary',
        icon: 'lock_reset',
      })
      .subscribe((ok) => ok && this.store.dispatch(SettingsActions.resetUserPassword({ id: user.id })));
  }

  endSessions(user: TeamUser): void {
    this.confirmDialog
      .confirm({
        title: 'Encerrar sessões',
        message: `"${user.name}" vai sair de todos os aparelhos em que o acesso estiver aberto e precisará entrar de novo.`,
        confirmLabel: 'Encerrar sessões',
        variant: 'primary',
        icon: 'logout',
      })
      .subscribe((ok) => ok && this.store.dispatch(SettingsActions.endUserSessions({ id: user.id })));
  }

  resendInvite(invite: TeamInvite): void {
    this.store.dispatch(SettingsActions.resendInvite({ id: invite.id }));
  }

  cancelInvite(invite: TeamInvite): void {
    this.confirmDialog
      .confirm({
        title: 'Cancelar convite',
        message: `O link enviado para ${invite.email} deixa de funcionar.`,
        confirmLabel: 'Cancelar convite',
        cancelLabel: 'Voltar',
        variant: 'danger',
      })
      .subscribe((ok) => ok && this.store.dispatch(SettingsActions.cancelInvite({ id: invite.id })));
  }

  /** Útil quando o e-mail não chega: a administração manda o link por WhatsApp, por exemplo. */
  copyInviteLink(invite: TeamInvite): void {
    const link = `${window.location.origin}/auth/convite?token=${invite.token}`;
    navigator.clipboard
      .writeText(link)
      .then(() => this.snackbar.success('Link do convite copiado'))
      .catch(() => this.snackbar.error('Não foi possível copiar o link'));
  }
}
