import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, take } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateAppointmentRequest } from '../../../../core/models/appointment.model';
import { Service } from '../../../../core/models/service.model';
import { ClientService } from '../../../clients/services/client.service';
import { ServiceActions } from '../../../services/store/service.actions';
import { selectAllServices, selectServicesLoading } from '../../../services/store/service.selectors';
import { AppointmentActions } from '../../store/appointment.actions';
import { selectAppointmentsError, selectAppointmentsSaving, selectSelectedAppointment } from '../../store/appointment.selectors';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.css'
})
export class AppointmentFormComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clientService = inject(ClientService);

  isEditMode = false;
  appointmentId: string | null = null;
  filteredClients: any[] = [];
  selectedClientId: string | null = null;
  selectedClient: { name: string; phone?: string } | null = null;

  isSaving$ = this.store.select(selectAppointmentsSaving);
  error$ = this.store.select(selectAppointmentsError);
  servicesLoading$ = this.store.select(selectServicesLoading);
  activeServices$ = this.store.select(selectAllServices).pipe(
    map((services: Service[]) => services.filter(s => s.active))
  );

  form = new FormGroup({
    clientSearch: new FormControl(''),
    clientId: new FormControl('', Validators.required),
    serviceId: new FormControl('', Validators.required),
    scheduledDate: new FormControl('', Validators.required),
    scheduledTime: new FormControl('', Validators.required),
    durationMinutes: new FormControl(60, [Validators.required, Validators.min(1)]),
    notes: new FormControl(''),
  });

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.appointmentId;

    const dateParam = this.route.snapshot.queryParamMap.get('date');
    const timeParam = this.route.snapshot.queryParamMap.get('time');
    if (dateParam) this.form.patchValue({ scheduledDate: dateParam });
    if (timeParam) this.form.patchValue({ scheduledTime: timeParam });

    this.store.dispatch(ServiceActions.loadServices({}));

    this.form.get('clientSearch')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(search => this.clientService.list(search ?? '', 0, 20))
    ).subscribe(res => {
      this.filteredClients = res.content.filter((c: any) => c.active);
    });

    if (this.isEditMode && this.appointmentId) {
      this.store.dispatch(AppointmentActions.selectAppointment({ id: this.appointmentId }));
      this.store.select(selectSelectedAppointment).pipe(
        filter(a => !!a),
        take(1)
      ).subscribe(a => {
        if (a) {
          this.form.patchValue({
            clientSearch: a.clientName,
            clientId: a.clientId,
            serviceId: a.serviceId,
            scheduledDate: a.scheduledDate,
            scheduledTime: a.scheduledTime.slice(0, 5),
            durationMinutes: a.durationMinutes,
            notes: a.notes ?? '',
          });
          this.selectedClientId = a.clientId;
          this.selectedClient = { name: a.clientName };
        }
      });
    }
  }

  onClientSelect(client: any): void {
    this.form.patchValue({ clientId: client.id, clientSearch: client.name });
    this.selectedClientId = client.id;
    this.selectedClient = { name: client.name, phone: client.phone };
  }

  clearClient(): void {
    this.form.patchValue({ clientId: '', clientSearch: '' });
    this.selectedClientId = null;
    this.selectedClient = null;
    this.filteredClients = [];
  }

  onServiceChange(): void {
    const serviceId = this.form.value.serviceId;
    this.activeServices$.pipe(take(1)).subscribe(services => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        this.form.patchValue({ durationMinutes: service.durationMinutes });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;

    // O datepicker pode retornar um objeto Date; converter para string ISO se necessário
    const rawDate: any = v.scheduledDate;
    const scheduledDate: string = (rawDate instanceof Date)
      ? rawDate.toISOString().split('T')[0]
      : (rawDate as string);

    const request: CreateAppointmentRequest = {
      clientId: v.clientId!,
      serviceId: v.serviceId!,
      scheduledDate,
      scheduledTime: v.scheduledTime! + ':00',
      durationMinutes: v.durationMinutes!,
      notes: v.notes || undefined,
    };

    if (this.isEditMode && this.appointmentId) {
      this.store.dispatch(AppointmentActions.updateAppointment({ id: this.appointmentId, request }));
    } else {
      this.store.dispatch(AppointmentActions.createAppointment({ request }));
    }
  }

  cancel(): void {
    this.router.navigate(['/appointments']);
  }
}
