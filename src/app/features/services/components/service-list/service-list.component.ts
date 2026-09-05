import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Service } from '../../../../core/models/service.model';
import { ServiceActions } from '../../store/service.actions';
import { ServiceService } from '../../services/service.service';
import {
  selectAllServices,
  selectServicesLoading,
  selectServicesTotalElements,
  selectServicesCurrentPage,
  selectServicesPageSize,
} from '../../store/service.selectors';
import { CurrencyBrPipe } from '../../../../shared/pipes/currency-br.pipe';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';
import {
  AppointmentsWarningDialogComponent,
  AppointmentsWarningData,
} from '../../../../shared/components/appointments-warning-dialog/appointments-warning-dialog.component';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTooltipModule,
    CurrencyBrPipe,
    DurationPipe,
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.css',
})
export class ServiceListComponent implements OnInit {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private serviceService = inject(ServiceService);

  services$ = this.store.select(selectAllServices);
  loading$ = this.store.select(selectServicesLoading);
  total$ = this.store.select(selectServicesTotalElements);
  currentPage$ = this.store.select(selectServicesCurrentPage);
  pageSize$ = this.store.select(selectServicesPageSize);

  searchControl = new FormControl('');
  activeFilter: boolean | null = null;

  currentPageValue = 0;
  pageSizeValue = 20;
  totalValue = 0;

  ngOnInit(): void {
    this.store.dispatch(ServiceActions.loadServices({ active: this.activeFilter }));

    this.total$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(t => this.totalValue = t ?? 0);
    this.currentPage$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(p => this.currentPageValue = p ?? 0);
    this.pageSize$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(s => this.pageSizeValue = s ?? 20);

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(search => {
      this.store.dispatch(ServiceActions.loadServices({ search: search ?? '', page: 0, active: this.activeFilter }));
    });
  }

  setActiveFilter(value: boolean | null): void {
    this.activeFilter = value;
    this.store.dispatch(ServiceActions.loadServices({
      search: this.searchControl.value ?? '',
      page: 0,
      active: value,
    }));
  }

  onPage(event: PageEvent): void {
    this.store.dispatch(ServiceActions.loadServices({
      search: this.searchControl.value ?? '',
      page: event.pageIndex,
      active: this.activeFilter,
    }));
  }

  deactivate(service: Service): void {
    this.serviceService.deactivate(service.id).subscribe({
      next: () => this.store.dispatch(ServiceActions.deactivateServiceSuccess({ id: service.id })),
      error: (err) => {
        if (err.status === 409 && err.error?.details) {
          this.openWarningDialog({
            title: 'Agendamentos futuros encontrados',
            message: `"${service.name}" possui agendamentos futuros. Inative-o mesmo assim ou cancele os agendamentos antes.`,
            appointments: err.error.details,
            canForce: true,
            forceLabel: 'Inativar mesmo assim',
          }).then(confirmed => {
            if (confirmed) {
              this.serviceService.deactivate(service.id, true).subscribe({
                next: () => this.store.dispatch(ServiceActions.deactivateServiceSuccess({ id: service.id })),
              });
            }
          });
        }
      },
    });
  }

  reactivate(service: Service): void {
    this.serviceService.reactivate(service.id).subscribe({
      next: () => this.store.dispatch(ServiceActions.reactivateServiceSuccess({ id: service.id })),
    });
  }

  deleteService(service: Service): void {
    if (!confirm(`Excluir "${service.name}" permanentemente? Esta ação não pode ser desfeita.`)) return;

    this.serviceService.delete(service.id).subscribe({
      next: () => this.store.dispatch(ServiceActions.deleteServiceSuccess({ id: service.id })),
      error: (err) => {
        if (err.status === 409 && err.error?.details) {
          this.openWarningDialog({
            title: 'Exclusão bloqueada',
            message: `"${service.name}" possui agendamentos futuros. Cancele-os antes de excluir o serviço.`,
            appointments: err.error.details,
          });
        } else {
          alert(err.error?.message ?? 'Erro ao excluir serviço.');
        }
      },
    });
  }

  private openWarningDialog(data: AppointmentsWarningData): Promise<boolean> {
    return this.dialog.open(AppointmentsWarningDialogComponent, {
      data,
      panelClass: 'warning-dialog',
      maxWidth: '480px',
    }).afterClosed().toPromise().then(result => !!result);
  }

  getRangeLabel(): string {
    if (this.totalValue === 0) return '0 registros';
    const start = this.currentPageValue * this.pageSizeValue + 1;
    const end = Math.min((this.currentPageValue + 1) * this.pageSizeValue, this.totalValue);
    return `Mostrando ${start} a ${end} de ${this.totalValue} registros`;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('pt-BR');
  }
}
