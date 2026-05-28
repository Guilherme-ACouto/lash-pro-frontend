import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FichasActions } from '../../store/fichas.actions';
import {
  selectMappingSummaries,
  selectTotalMappings,
  selectFichasIsLoading,
} from '../../store/fichas.selectors';

@Component({
  selector: 'app-mapping-list',
  standalone: true,
  imports: [
    AsyncPipe, CommonModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatInputModule,
    MatIconModule, MatButtonModule, MatProgressBarModule, MatBadgeModule,
  ],
  templateUrl: './mapping-list.component.html',
  styleUrl: './mapping-list.component.css',
})
export class MappingListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  summaries$ = this.store.select(selectMappingSummaries);
  total$ = this.store.select(selectTotalMappings);
  isLoading$ = this.store.select(selectFichasIsLoading);

  searchControl = new FormControl('');
  displayedColumns = ['client', 'count', 'lastDate'];
  pageSize = 20;

  ngOnInit(): void {
    this.store.dispatch(FichasActions.loadMappingSummaries());
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.store.dispatch(FichasActions.setSearch({ search: value ?? '' }));
    });
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(FichasActions.setPage({ page: event.pageIndex }));
  }

  openHistory(clientId: string): void {
    this.router.navigate(['/fichas/mapping', clientId]);
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }
}
