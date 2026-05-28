import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServiceActions } from '../../store/service.actions';
import { selectServicesSaving, selectServicesError, selectSelectedService } from '../../store/service.selectors';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-service-form',
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
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.css',
})
export class ServiceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  saving$ = this.store.select(selectServicesSaving);
  error$ = this.store.select(selectServicesError);

  isEditMode = false;
  private serviceId: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    durationMinutes: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.serviceId;

    if (this.isEditMode && this.serviceId) {
      this.store.dispatch(ServiceActions.selectService({ id: this.serviceId }));
      this.store.select(selectSelectedService).pipe(take(2)).subscribe((service) => {
        if (service) {
          this.form.patchValue({
            name: service.name,
            description: service.description ?? '',
            price: service.price,
            durationMinutes: service.durationMinutes,
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
      description: value.description || undefined,
      price: +value.price!,
      durationMinutes: +value.durationMinutes!,
    };

    if (this.isEditMode && this.serviceId) {
      this.store.dispatch(ServiceActions.updateService({ id: this.serviceId, request }));
    } else {
      this.store.dispatch(ServiceActions.createService({ request }));
    }
  }

  goBack(): void {
    if (this.isEditMode && this.serviceId) {
      this.router.navigate(['/services', this.serviceId]);
    } else {
      this.router.navigate(['/services']);
    }
  }
}
