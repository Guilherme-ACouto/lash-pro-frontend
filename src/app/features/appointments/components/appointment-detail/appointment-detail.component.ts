import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';
import { AppointmentActions } from '../../store/appointment.actions';
import { selectAppointmentsError, selectAppointmentsLoading, selectAppointmentsSaving, selectSelectedAppointment } from '../../store/appointment.selectors';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    DurationPipe,
  ],
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.css'
})
export class AppointmentDetailComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  appointment$ = this.store.select(selectSelectedAppointment);
  isLoading$ = this.store.select(selectAppointmentsLoading);
  error$ = this.store.select(selectAppointmentsError);
  isSaving$ = this.store.select(selectAppointmentsSaving);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.store.dispatch(AppointmentActions.selectAppointment({ id }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(AppointmentActions.clearSelectedAppointment());
  }

  confirm(id: string): void {
    if (confirm('Confirmar este agendamento?')) {
      this.store.dispatch(AppointmentActions.confirmAppointment({ id }));
    }
  }

  complete(id: string): void {
    const ref = this.dialog.open(PaymentMethodDialogComponent, {
      width: '380px',
      disableClose: true,
    });
    ref.afterClosed().subscribe((paymentMethod: string | undefined) => {
      if (paymentMethod) {
        this.store.dispatch(AppointmentActions.completeAppointment({ id, paymentMethod }));
      }
    });
  }

  cancel(id: string): void {
    if (confirm('Cancelar este agendamento?')) {
      this.store.dispatch(AppointmentActions.cancelAppointment({ id }));
    }
  }

  noShow(id: string): void {
    if (confirm('Registrar que o cliente não compareceu?')) {
      this.store.dispatch(AppointmentActions.noShowAppointment({ id }));
    }
  }

  getEndTime(a: any): string {
    const [h, m] = a.scheduledTime.split(':').map(Number);
    const endMin = h * 60 + m + a.durationMinutes;
    const eh = Math.floor(endMin / 60).toString().padStart(2, '0');
    const em = (endMin % 60).toString().padStart(2, '0');
    return `${eh}:${em}`;
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  formatDateTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}

@Component({
  selector: 'app-payment-method-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatRadioModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Como foi o pagamento?</h2>
    <mat-dialog-content>
      <mat-radio-group [formControl]="paymentControl" class="payment-options">
        @for (opt of options; track opt.value) {
          <mat-radio-button [value]="opt.value" class="payment-option">
            {{ opt.label }}
          </mat-radio-button>
        }
      </mat-radio-group>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-flat-button color="primary"
        [disabled]="paymentControl.invalid"
        (click)="dialogRef.close(paymentControl.value)">
        Confirmar realizado
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 0;
    }
    .payment-option {
      font-size: 15px;
    }
  `],
})
export class PaymentMethodDialogComponent {
  paymentControl = new FormControl('', Validators.required);

  readonly options = [
    { value: 'PIX', label: 'PIX' },
    { value: 'Dinheiro', label: 'Dinheiro' },
    { value: 'Cartão Débito', label: 'Cartão Débito' },
    { value: 'Cartão Crédito', label: 'Cartão Crédito' },
    { value: 'Transferência', label: 'Transferência' },
  ];

  constructor(public dialogRef: MatDialogRef<PaymentMethodDialogComponent>) {}
}
