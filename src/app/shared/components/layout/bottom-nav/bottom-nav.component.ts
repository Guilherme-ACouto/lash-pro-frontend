import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { map } from 'rxjs';
import { BottomSheetMoreComponent } from '../bottom-sheet-more/bottom-sheet-more.component';
import { selectCurrentUser } from '../../../../features/auth/store/auth.selectors';
import { NavItem, navItemsFor } from '../nav-items';

const VISIBLE_ITEMS = 4;

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, MatIconModule, MatRippleModule, MatBottomSheetModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css',
})
export class BottomNavComponent {
  private bottomSheet = inject(MatBottomSheet);
  private store = inject(Store);

  items$ = this.store.select(selectCurrentUser).pipe(map(navItemsFor));
  visible$ = this.items$.pipe(map((items) => items.slice(0, VISIBLE_ITEMS)));

  openMore(items: NavItem[]): void {
    this.bottomSheet.open(BottomSheetMoreComponent, { data: items.slice(VISIBLE_ITEMS) });
  }
}
