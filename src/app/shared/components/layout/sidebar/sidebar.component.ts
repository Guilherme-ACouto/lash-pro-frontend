import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { AuthActions } from '../../../../features/auth/store/auth.actions';
import { selectCurrentUser } from '../../../../features/auth/store/auth.selectors';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatButtonModule, MatDividerModule, MatTooltipModule, AsyncPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private store = inject(Store);
  user$ = this.store.select(selectCurrentUser);
  collapsed = false;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Clientes', icon: 'people', route: '/clients' },
    { label: 'Agendamentos', icon: 'calendar_month', route: '/appointments' },
    { label: 'Fichas', icon: 'assignment', route: '/fichas' },
    { label: 'Serviços', icon: 'design_services', route: '/services' },
    { label: 'Financeiro', icon: 'account_balance_wallet', route: '/financial' },
    { label: 'Estoque', icon: 'inventory_2', route: '/inventory' },
  ];

  toggle(): void {
    this.collapsed = !this.collapsed;
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
