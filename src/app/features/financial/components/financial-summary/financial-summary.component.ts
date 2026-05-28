import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexChart, ApexXAxis, ApexDataLabels, ApexTooltip, ApexPlotOptions } from 'ng-apexcharts';
import { FinancialSummary } from '../../models/financial.model';
import { CurrencyBrPipe } from '../../../../shared/pipes/currency-br.pipe';

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatIconModule, NgApexchartsModule, CurrencyBrPipe],
  templateUrl: './financial-summary.component.html',
  styleUrl: './financial-summary.component.css',
})
export class FinancialSummaryComponent implements OnChanges {
  @Input() summary: FinancialSummary | null = null;
  @Input() isLoading = false;

  chartOptions: any = {};
  currentMonthLabel = '';

  ngOnChanges(): void {
    this.buildChart();
    const now = new Date();
    this.currentMonthLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  get incomeProgress(): number {
    if (!this.summary || this.summary.incomePredicted === 0) return 0;
    return Math.min(100, (this.summary.incomeReceived / this.summary.incomePredicted) * 100);
  }

  get expenseProgress(): number {
    if (!this.summary || this.summary.expensePredicted === 0) return 0;
    return Math.min(100, (this.summary.expensePaid / this.summary.expensePredicted) * 100);
  }

  get expensePending(): number {
    if (!this.summary) return 0;
    return Math.max(0, this.summary.expensePredicted - this.summary.expensePaid);
  }

  get isPositive(): boolean {
    return !this.summary || this.summary.predictedMonthResult >= 0;
  }

  private buildChart(): void {
    if (!this.summary?.monthlySeries?.length) return;

    const months = this.summary.monthlySeries.map((s) =>
      new Date(s.year, s.month - 1, 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
    );

    this.chartOptions = {
      series: [
        { name: 'Recebimentos', data: this.summary.monthlySeries.map((s) => Number(s.income)) },
        { name: 'Despesas', data: this.summary.monthlySeries.map((s) => Number(s.expense)) },
      ],
      chart: { type: 'bar', height: 260, toolbar: { show: false }, fontFamily: 'inherit' } as ApexChart,
      plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } } as ApexPlotOptions,
      dataLabels: { enabled: false } as ApexDataLabels,
      colors: ['#C8A2A2', '#9E9E9E'],
      xaxis: { categories: months } as ApexXAxis,
      yaxis: { labels: { formatter: (v: number) => `R$ ${v.toLocaleString('pt-BR')}` } },
      tooltip: {
        y: { formatter: (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
      } as ApexTooltip,
      legend: { position: 'top' },
      grid: { borderColor: '#f0f0f0' },
    };
  }
}
