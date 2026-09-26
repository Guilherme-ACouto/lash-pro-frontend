import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';
import { selectCurrentUser } from '../../../../features/auth/store/auth.selectors';
import { navItemsFor } from '../nav-items';

/** Só os módulos. Usuário, unidade de negócio, Configurações e Sair ficam na barra do topo. */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatTooltipModule, AsyncPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private store = inject(Store);
  navItems$ = this.store.select(selectCurrentUser).pipe(map(navItemsFor));
  collapsed = false;

  toggle(): void {
    this.collapsed = !this.collapsed;
  }
}
