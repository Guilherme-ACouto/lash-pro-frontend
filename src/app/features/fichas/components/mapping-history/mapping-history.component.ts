import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FichasActions } from '../../store/fichas.actions';
import {
  selectClientMappings,
  selectFichasIsLoading,
} from '../../store/fichas.selectors';
import { LashMapping } from '../../models/fichas.model';

@Component({
  selector: 'app-mapping-history',
  standalone: true,
  imports: [
    AsyncPipe, CommonModule, RouterLink,
    MatButtonModule, MatIconModule, MatCardModule, MatProgressBarModule,
  ],
  templateUrl: './mapping-history.component.html',
  styleUrl: './mapping-history.component.css',
})
export class MappingHistoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private router = inject(Router);

  clientId = '';
  mappings$ = this.store.select(selectClientMappings);
  isLoading$ = this.store.select(selectFichasIsLoading);

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('clientId') ?? '';
    this.store.dispatch(FichasActions.loadClientMappings({ clientId: this.clientId }));
  }

  openMapping(mapping: LashMapping): void {
    this.router.navigate(['/fichas/mapping', this.clientId, mapping.id]);
  }

  newMapping(): void {
    this.router.navigate(['/fichas/mapping', this.clientId, 'nova']);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }
}
