import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { AsyncPipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ClientActions } from '../../store/client.actions';
import { selectClientsSaving, selectClientsError, selectSelectedClient } from '../../store/client.selectors';
import { take } from 'rxjs/operators';

export interface ClientFormDialogData {
  id?: string;
}

@Component({
  selector: 'app-client-form',
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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css',
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private actions$ = inject(Actions);
  private dialogRef = inject(MatDialogRef<ClientFormComponent>, { optional: true });
  private dialogData = inject<ClientFormDialogData | null>(MAT_DIALOG_DATA, { optional: true });

  saving$ = this.store.select(selectClientsSaving);
  error$ = this.store.select(selectClientsError);

  isEditMode = false;
  isDialogMode = false;
  private clientId: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: ['', [Validators.email]],
    birthDate: [null as Date | null],
    notes: [''],
  });

  ngOnInit(): void {
    this.isDialogMode = !!this.dialogRef;
    this.clientId = this.dialogData?.id ?? this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.clientId;

    if (this.dialogRef) {
      this.actions$.pipe(
        ofType(ClientActions.createClientSuccess, ClientActions.updateClientSuccess),
        take(1)
      ).subscribe(() => this.dialogRef?.close(true));
    }

    if (this.isEditMode && this.clientId) {
      this.store.dispatch(ClientActions.selectClient({ id: this.clientId }));
      this.store.select(selectSelectedClient).pipe(take(2)).subscribe((client) => {
        if (client) {
          this.form.patchValue({
            name: client.name,
            phone: client.phone,
            email: client.email ?? '',
            birthDate: client.birthDate ? new Date(client.birthDate + 'T12:00:00') : null,
            notes: client.notes ?? '',
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const value = this.form.value;
    const request = {
      name: value.name!,
      phone: value.phone!,
      email: value.email || undefined,
      birthDate: value.birthDate
        ? (value.birthDate as Date).toISOString().split('T')[0]
        : undefined,
      notes: value.notes || undefined,
    };

    if (this.isEditMode && this.clientId) {
      this.store.dispatch(ClientActions.updateClient({ id: this.clientId, request }));
    } else {
      this.store.dispatch(ClientActions.createClient({ request }));
    }
  }

  goBack(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
      return;
    }
    if (this.isEditMode && this.clientId) {
      this.router.navigate(['/clients', this.clientId]);
    } else {
      this.router.navigate(['/clients']);
    }
  }
}
