import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { BottomSheetMoreComponent } from '../bottom-sheet-more/bottom-sheet-more.component';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatRippleModule, MatBottomSheetModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
})
export class BottomNavComponent {
  private bottomSheet = inject(MatBottomSheet);

  navItems: NavItem[] = [
    { label: 'Início', icon: 'home', route: '/dashboard' },
    { label: 'Agenda', icon: 'calendar_month', route: '/appointments' },
    { label: 'Clientes', icon: 'people', route: '/clients' },
    { label: 'Fichas', icon: 'assignment', route: '/fichas' },
    { label: 'Financeiro', icon: 'account_balance_wallet', route: '/financial' },
  ];

  openMore(): void {
    this.bottomSheet.open(BottomSheetMoreComponent);
  }
}
