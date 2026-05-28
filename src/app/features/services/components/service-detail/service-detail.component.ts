import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ServiceActions } from '../../store/service.actions';
import { selectSelectedService, selectServicesLoading } from '../../store/service.selectors';
import { CurrencyBrPipe } from '../../../../shared/pipes/currency-br.pipe';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';
import { DatePtbrPipe } from '../../../../shared/pipes/date-ptbr.pipe';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [RouterLink, AsyncPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule, CurrencyBrPipe, DurationPipe, DatePtbrPipe],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.css',
})
export class ServiceDetailComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  service$ = this.store.select(selectSelectedService);
  loading$ = this.store.select(selectServicesLoading);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.store.dispatch(ServiceActions.selectService({ id }));
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
