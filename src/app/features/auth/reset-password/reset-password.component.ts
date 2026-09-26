import { Component, Input, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthActions } from '../store/auth.actions';
import { selectAuthError, selectAuthLoading } from '../store/auth.selectors';

export function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { passwordsMismatch: true } : null;
}

/** Destino do link do e-mail de "esqueci minha senha" / "redefinir senha" (?token=...). */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: '../forgot-password/forgot-password.component.css',
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);

  @Input() token = '';

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);
  success = toSignal(
    this.actions$.pipe(ofType(AuthActions.resetPasswordSuccess), map(() => true)),
    { initialValue: false }
  );

  form = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  onSubmit(): void {
    if (this.form.invalid || !this.token) return;
    this.store.dispatch(AuthActions.resetPassword({ token: this.token, password: this.form.value.password! }));
  }
}
