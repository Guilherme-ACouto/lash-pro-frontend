import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ServiceActions } from '../../store/service.actions';
import { selectSelectedService, selectServicesLoading } from '../../store/service.selectors';
import { CurrencyBrPipe } from '../../../../shared/pipes/currency-br.pipe';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';
import { DatePtbrPipe } from '../../../../shared/pipes/date-ptbr.pipe';
import { ServiceFormComponent } from '../service-form/service-form.component';
import { CanDirective } from '../../../../core/auth/can.directive';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [
    CanDirective,RouterLink, AsyncPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule, CurrencyBrPipe, DurationPipe, DatePtbrPipe],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.css',
})
export class ServiceDetailComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  service$ = this.store.select(selectSelectedService);
  loading$ = this.store.select(selectServicesLoading);

  private serviceId: string | null = null;

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id');
    if (this.serviceId) this.store.dispatch(ServiceActions.selectService({ id: this.serviceId }));
  }

  editService(): void {
    if (!this.serviceId) return;
    this.dialog.open(ServiceFormComponent, {
      data: { id: this.serviceId },
      width: '640px',
      maxWidth: '95vw',
      autoFocus: false,
      panelClass: 'service-form-dialog-panel',
    }).afterClosed().subscribe(saved => {
      if (saved && this.serviceId) {
        this.store.dispatch(ServiceActions.selectService({ id: this.serviceId }));
      }
    });
  }

  deleteService(id: string, name: string): void {
    if (confirm(`Excluir "${name}" permanentemente? Esta ação não pode ser desfeita.`)) {
      this.store.dispatch(ServiceActions.deleteService({ id }));
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR');
  }
}
