import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NavItem } from '../nav-items';

@Component({
  selector: 'app-bottom-sheet-more',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatListModule],
  templateUrl: './bottom-sheet-more.component.html',
  styleUrl: './bottom-sheet-more.component.css',
})
export class BottomSheetMoreComponent {
  private sheetRef = inject(MatBottomSheetRef<BottomSheetMoreComponent>);

  items: NavItem[] = inject<NavItem[]>(MAT_BOTTOM_SHEET_DATA) ?? [];

  navigate(): void {
    this.sheetRef.dismiss();
  }
}
