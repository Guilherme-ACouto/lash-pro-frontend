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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FichasActions } from '../../store/fichas.actions';
import {
  selectAnamneseSummaries,
  selectTotalAnamneses,
  selectFichasIsLoading,
  selectFichasSearch,
  selectFichasPage,
} from '../../store/fichas.selectors';
import { AnamneseSummary } from '../../models/fichas.model';

@Component({
  selector: 'app-anamnese-list',
  standalone: true,
  imports: [
    AsyncPipe, CommonModule, ReactiveFormsModule,
    MatTableModule, MatPaginatorModule, MatInputModule,
    MatIconModule, MatButtonModule, MatProgressBarModule,
  ],
  templateUrl: './anamnese-list.component.html',
  styleUrl: './anamnese-list.component.css',
})
export class AnamneseListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  summaries$ = this.store.select(selectAnamneseSummaries);
  total$ = this.store.select(selectTotalAnamneses);
  isLoading$ = this.store.select(selectFichasIsLoading);

  searchControl = new FormControl('');
  displayedColumns = ['client', 'status'];
  pageSize = 20;

  ngOnInit(): void {
    this.store.dispatch(FichasActions.loadAnamneseSummaries());
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

  openAnamnese(clientId: string): void {
    this.router.navigate(['/fichas/anamnese', clientId]);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  }
}
