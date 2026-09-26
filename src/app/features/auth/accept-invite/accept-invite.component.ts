import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthActions } from '../store/auth.actions';
import { selectAuthError, selectAuthLoading, selectInvitation } from '../store/auth.selectors';
import { passwordsMatch } from '../reset-password/reset-password.component';

/** Destino do link do e-mail de convite (?token=...): cria a senha e entra na assinatura. */
@Component({
  selector: 'app-accept-invite',
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
  templateUrl: './accept-invite.component.html',
  styleUrl: '../forgot-password/forgot-password.component.css',
})
export class AcceptInviteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private actions$ = inject(Actions);

  @Input() token = '';

  invitation$ = this.store.select(selectInvitation);
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);
  success = toSignal(
    this.actions$.pipe(ofType(AuthActions.acceptInvitationSuccess), map(() => true)),
    { initialValue: false }
  );

  form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch }
  );

  constructor() {
    // Nome sugerido pelo administrador no convite — a pessoa pode ajustar.
    this.actions$
      .pipe(
        ofType(AuthActions.loadInvitationSuccess),
        map(({ invitation }) => invitation.name),
        takeUntilDestroyed()
      )
      .subscribe((name) => {
        if (!this.form.value.name) this.form.patchValue({ name });
      });
  }

  ngOnInit(): void {
    if (this.token) {
      this.store.dispatch(AuthActions.loadInvitation({ token: this.token }));
    }
  }

  onSubmit(): void {
    if (this.form.invalid || !this.token) return;
    const v = this.form.value;
    this.store.dispatch(AuthActions.acceptInvitation({ token: this.token, name: v.name!, password: v.password! }));
  }
}
