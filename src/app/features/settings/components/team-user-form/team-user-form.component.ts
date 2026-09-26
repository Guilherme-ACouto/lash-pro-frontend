import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { selectCurrentUser } from '../../../auth/store/auth.selectors';
import {
  PERMISSION_ACTIONS,
  PERMISSION_MODULES,
  PERMISSION_TEMPLATES,
  PermissionAction,
  PermissionModule,
  TeamUser,
  permissionKey,
} from '../../models/settings.model';
import { SettingsActions } from '../../store/settings.actions';
import { selectSettingsSaving } from '../../store/settings.selectors';

export type TeamUserFormData = { mode: 'invite' } | { mode: 'edit'; user: TeamUser };

/** Convidar ou editar alguém da equipe: administrador (tudo) ou permissões por módulo e ação. */
@Component({
  selector: 'app-team-user-form',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './team-user-form.component.html',
  styleUrl: './team-user-form.component.css',
})
export class TeamUserFormComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<TeamUserFormComponent>);
  readonly data = inject<TeamUserFormData>(MAT_DIALOG_DATA);

  readonly modules = PERMISSION_MODULES;
  readonly actions = PERMISSION_ACTIONS;
  readonly templates = PERMISSION_TEMPLATES;
  readonly isInvite = this.data.mode === 'invite';
  readonly user = this.data.mode === 'edit' ? this.data.user : null;

  saving$ = this.store.select(selectSettingsSaving);

  /** Titular é sempre admin; ninguém tira o próprio acesso de admin. */
  adminLocked = false;
  adminLockedReason = '';

  form = this.fb.group({
    name: [this.user?.name ?? '', [Validators.required, Validators.minLength(2)]],
    email: [{ value: this.user?.email ?? '', disabled: !this.isInvite }, [Validators.required, Validators.email]],
    admin: [this.user?.admin ?? false],
    professional: [this.user?.professional ?? false],
    permissions: [this.user?.permissions ?? ([] as string[])],
    template: [''],
  });

  constructor() {
    this.store
      .select(selectCurrentUser)
      .pipe(takeUntilDestroyed())
      .subscribe((me) => {
        if (this.user?.accountOwner) {
          this.lockAdmin('A titular da assinatura sempre tem acesso de administrador');
        } else if (this.user && this.user.id === me?.id && this.user.admin) {
          this.lockAdmin('Você não pode remover o seu próprio acesso de administrador');
        }
      });

    inject(Actions)
      .pipe(ofType(SettingsActions.teamCommandSuccess), takeUntilDestroyed())
      .subscribe(() => this.dialogRef.close(true));
  }

  get title(): string {
    return this.isInvite ? 'Convidar usuário' : `Editar acesso — ${this.user?.name}`;
  }

  get isAdmin(): boolean {
    return !!this.form.controls.admin.value;
  }

  private get permissions(): string[] {
    return this.form.controls.permissions.value ?? [];
  }

  private lockAdmin(reason: string): void {
    this.adminLocked = true;
    this.adminLockedReason = reason;
    this.form.controls.admin.setValue(true);
    this.form.controls.admin.disable();
  }

  has(module: PermissionModule, action: PermissionAction): boolean {
    return this.permissions.includes(permissionKey(module.key, action));
  }

  supports(module: PermissionModule, action: PermissionAction): boolean {
    return module.actions.includes(action);
  }

  /** Marcar criar/editar/excluir liga o "ver" do módulo; desmarcar "ver" desliga o módulo inteiro. */
  toggle(module: PermissionModule, action: PermissionAction, checked: boolean): void {
    const key = permissionKey(module.key, action);
    let next = this.permissions.filter((p) => p !== key);
    if (checked) {
      next.push(key);
      if (action !== 'view' && !next.includes(module.key)) next.push(module.key);
    } else if (action === 'view') {
      next = next.filter((p) => p !== module.key && !p.startsWith(`${module.key}.`));
    }
    this.form.controls.permissions.setValue(next);
    this.form.controls.template.setValue('', { emitEvent: false });
  }

  toggleModule(module: PermissionModule, checked: boolean): void {
    const keys = module.actions.map((a) => permissionKey(module.key, a));
    const others = this.permissions.filter((p) => p !== module.key && !p.startsWith(`${module.key}.`));
    this.form.controls.permissions.setValue(checked ? [...others, ...keys] : others);
    this.form.controls.template.setValue('', { emitEvent: false });
  }

  isModuleFull(module: PermissionModule): boolean {
    return module.actions.every((a) => this.has(module, a));
  }

  applyTemplate(templateKey: string): void {
    const template = this.templates.find((t) => t.key === templateKey);
    if (!template) return;
    this.form.patchValue({ permissions: [...template.permissions], professional: template.professional });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const request = {
      name: v.name!.trim(),
      admin: !!v.admin,
      professional: !!v.professional,
      permissions: v.admin ? [] : v.permissions ?? [],
    };
    if (this.isInvite) {
      this.store.dispatch(SettingsActions.inviteUser({ request: { ...request, email: v.email!.trim() } }));
    } else if (this.user) {
      this.store.dispatch(SettingsActions.updateUser({ id: this.user.id, request }));
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
