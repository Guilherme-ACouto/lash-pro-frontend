import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.css',
})
export class KpiCardComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() value: number = 0;
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() trend: number | null = null;
  @Input() color = '#C8A2A2';

  get formattedValue(): string {
    if (this.prefix === 'R$') {
      return this.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return String(this.value);
  }

  get trendPositive(): boolean {
    return this.trend !== null && this.trend > 0;
  }

  get trendNegative(): boolean {
    return this.trend !== null && this.trend < 0;
  }

  get trendAbs(): string {
    return this.trend !== null ? Math.abs(this.trend).toFixed(1) + '%' : '';
  }
}
