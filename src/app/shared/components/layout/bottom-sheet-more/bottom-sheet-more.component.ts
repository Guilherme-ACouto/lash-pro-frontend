import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-bottom-sheet-more',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatListModule],
  templateUrl: './bottom-sheet-more.component.html',
  styleUrl: './bottom-sheet-more.component.css',
})
export class BottomSheetMoreComponent {
  private sheetRef = inject(MatBottomSheetRef<BottomSheetMoreComponent>);

  items = [
    { label: 'Serviços', icon: 'design_services', route: '/services' },
    { label: 'Estoque', icon: 'inventory_2', route: '/inventory' },
  ];

  navigate(): void {
    this.sheetRef.dismiss();
  }
}
