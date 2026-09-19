import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClientActions } from '../../store/client.actions';
import { selectSelectedClient, selectClientsLoading } from '../../store/client.selectors';
import { DatePtbrPipe } from '../../../../shared/pipes/date-ptbr.pipe';
import { ClientFormComponent } from '../client-form/client-form.component';

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
  private dialog = inject(MatDialog);

  client$ = this.store.select(selectSelectedClient);
  loading$ = this.store.select(selectClientsLoading);

  private clientId: string | null = null;

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
    if (this.clientId) this.store.dispatch(ClientActions.selectClient({ id: this.clientId }));
  }

  editClient(): void {
    if (!this.clientId) return;
    this.dialog.open(ClientFormComponent, {
      data: { id: this.clientId },
      width: '640px',
      maxWidth: '95vw',
      autoFocus: false,
      panelClass: 'client-form-dialog-panel',
    }).afterClosed().subscribe(saved => {
      if (saved && this.clientId) {
        this.store.dispatch(ClientActions.selectClient({ id: this.clientId }));
      }
    });
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
