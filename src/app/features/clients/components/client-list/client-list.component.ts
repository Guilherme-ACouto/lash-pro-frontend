import { Component, DestroyRef, OnInit, inject } from '@angular/core';
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
import { Client } from '../../../../core/models/client.model';
import { ClientActions } from '../../store/client.actions';
import { ClientService } from '../../services/client.service';
import {
  selectClients,
  selectClientsLoading,
  selectTotalElements,
  selectCurrentPage,
  selectPageSize,
} from '../../store/client.selectors';
import {
  AppointmentsWarningDialogComponent,
  AppointmentsWarningData,
} from '../../../../shared/components/appointments-warning-dialog/appointments-warning-dialog.component';
import { ConfirmDialogService } from '../../../../shared/components/confirm-dialog/confirm-dialog.service';
import { ClientFormComponent, ClientFormDialogData } from '../client-form/client-form.component';
import {
  ClientViewDialogComponent,
  ClientViewDialogData,
  ClientViewDialogResult,
} from '../client-view-dialog/client-view-dialog.component';
import { CanDirective } from '../../../../core/auth/can.directive';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CanDirective,
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css',
})
export class ClientListComponent implements OnInit {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private clientService = inject(ClientService);
  private confirmDialog = inject(ConfirmDialogService);

  clients$ = this.store.select(selectClients);
  loading$ = this.store.select(selectClientsLoading);
  total$ = this.store.select(selectTotalElements);
  currentPage$ = this.store.select(selectCurrentPage);
  pageSize$ = this.store.select(selectPageSize);

  searchControl = new FormControl('');
  activeFilter: boolean | null = null;

  currentPageValue = 0;
  pageSizeValue = 20;
  totalValue = 0;

  ngOnInit(): void {
    this.store.dispatch(ClientActions.loadClients({ active: this.activeFilter }));

    this.total$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(t => this.totalValue = t ?? 0);
    this.currentPage$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(p => this.currentPageValue = p ?? 0);
    this.pageSize$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(s => this.pageSizeValue = s ?? 20);

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(search => {
      this.store.dispatch(ClientActions.loadClients({ search: search ?? '', page: 0, active: this.activeFilter }));
    });
  }

  openClientView(client: Client): void {
    this.dialog.open<ClientViewDialogComponent, ClientViewDialogData, ClientViewDialogResult>(ClientViewDialogComponent, {
      data: { client },
      width: '640px',
      maxWidth: '95vw',
      autoFocus: false,
      panelClass: 'client-form-dialog-panel',
    }).afterClosed().subscribe(result => {
      if (result === 'edit') {
        this.openClientForm({ id: client.id });
      }
    });
  }

  openClientForm(data?: ClientFormDialogData): void {
    this.dialog.open(ClientFormComponent, {
      data: data ?? null,
      width: '640px',
      maxWidth: '95vw',
      autoFocus: false,
      panelClass: 'client-form-dialog-panel',
    }).afterClosed().subscribe(saved => {
      if (saved) {
        this.store.dispatch(ClientActions.loadClients({
          search: this.searchControl.value ?? '',
          page: this.currentPageValue,
          active: this.activeFilter,
        }));
      }
    });
  }

  setActiveFilter(value: boolean | null): void {
    this.activeFilter = value;
    this.store.dispatch(ClientActions.loadClients({
      search: this.searchControl.value ?? '',
      page: 0,
      active: value,
    }));
  }

  onPage(event: PageEvent): void {
    this.store.dispatch(ClientActions.loadClients({
      search: this.searchControl.value ?? '',
      page: event.pageIndex,
      active: this.activeFilter,
    }));
  }

  deactivate(client: Client): void {
    this.confirmDialog.confirm({
      title: 'Inativar cliente',
      message: `Tem certeza que deseja inativar "${client.name}"? O cadastro não aparecerá mais na busca de novos agendamentos, mas o histórico continua salvo e você pode reativar quando quiser.`,
      confirmLabel: 'Inativar',
      variant: 'primary',
      icon: 'block',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.doDeactivate(client);
      }
    });
  }

  private doDeactivate(client: Client): void {
    this.clientService.deactivate(client.id).subscribe({
      next: () => this.store.dispatch(ClientActions.deactivateClientSuccess({ id: client.id })),
      error: (err) => {
        if (err.status === 409 && err.error?.details) {
          this.openWarningDialog({
            title: 'Agendamentos futuros encontrados',
            message: `"${client.name}" possui agendamentos futuros. Inative-a mesmo assim ou cancele os agendamentos antes.`,
            appointments: err.error.details,
            canForce: true,
            forceLabel: 'Inativar mesmo assim',
          }).then(confirmed => {
            if (confirmed) {
              this.clientService.deactivate(client.id, true).subscribe({
                next: () => this.store.dispatch(ClientActions.deactivateClientSuccess({ id: client.id })),
              });
            }
          });
        }
      },
    });
  }

  reactivate(client: Client): void {
    this.confirmDialog.confirm({
      title: 'Reativar cliente',
      message: `Tem certeza que deseja reativar "${client.name}"? O cadastro volta a aparecer na busca de novos agendamentos.`,
      confirmLabel: 'Reativar',
      variant: 'primary',
      icon: 'check_circle',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.clientService.reactivate(client.id).subscribe({
          next: () => this.store.dispatch(ClientActions.reactivateClientSuccess({ id: client.id })),
        });
      }
    });
  }

  deleteClient(client: Client): void {
    this.confirmDialog.confirm({
      title: 'Excluir cliente',
      message: `Tem certeza que deseja excluir "${client.name}" permanentemente? Essa ação não pode ser desfeita.`,
      confirmLabel: 'Excluir',
      variant: 'danger',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.doDelete(client);
      }
    });
  }

  private doDelete(client: Client): void {
    this.clientService.delete(client.id).subscribe({
      next: () => this.store.dispatch(ClientActions.deleteClientSuccess({ id: client.id })),
      error: (err) => {
        if (err.status === 409 && err.error?.details) {
          this.openWarningDialog({
            title: 'Exclusão bloqueada',
            message: `"${client.name}" possui agendamentos futuros. Cancele-os antes de excluir o cliente.`,
            appointments: err.error.details,
          });
        } else {
          alert(err.error?.message ?? 'Erro ao excluir cliente.');
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
