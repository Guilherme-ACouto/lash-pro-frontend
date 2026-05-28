import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClientActions } from '../../store/client.actions';
import { selectSelectedClient, selectClientsLoading } from '../../store/client.selectors';
import { DatePtbrPipe } from '../../../../shared/pipes/date-ptbr.pipe';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [RouterLink, AsyncPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule, DatePtbrPipe],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.css',
})
export class ClientDetailComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  client$ = this.store.select(selectSelectedClient);
  loading$ = this.store.select(selectClientsLoading);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.store.dispatch(ClientActions.selectClient({ id }));
  }

  deleteClient(id: string, name: string): void {
    if (confirm(`Excluir "${name}" permanentemente? Esta ação não pode ser desfeita.`)) {
      this.store.dispatch(ClientActions.deleteClient({ id }));
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR');
  }
}
