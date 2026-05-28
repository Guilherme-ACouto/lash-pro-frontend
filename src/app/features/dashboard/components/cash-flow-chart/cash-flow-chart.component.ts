import { Component, Input, OnChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import { CashFlowDayStat } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-cash-flow-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './cash-flow-chart.component.html',
  styleUrl: './cash-flow-chart.component.css',
})
export class CashFlowChartComponent implements OnChanges {
  @Input() series: CashFlowDayStat[] = [];

  chartSeries: { name: string; data: number[] }[] = [];

  chart: ApexChart = {
    type: 'area',
    height: 240,
    toolbar: { show: false },
    fontFamily: 'inherit',
  };

  dataLabels: ApexDataLabels = { enabled: false };

  stroke: ApexStroke = { curve: 'smooth', width: 2 };

  colors = ['#C8A2A2', '#D4AF37'];

  fill: ApexFill = {
    type: 'gradient',
    gradient: { opacityFrom: 0.3, opacityTo: 0.05 },
  };

  legend: ApexLegend = {
    position: 'top',
    horizontalAlign: 'left',
    fontSize: '13px',
  };

  xaxis: ApexXAxis = { categories: [], labels: { style: { fontSize: '12px' } } };
  yaxis: ApexYAxis = {
    labels: {
      style: { fontSize: '12px' },
      formatter: (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
    },
  };

  tooltip: ApexTooltip = {
    y: { formatter: (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
  };

  ngOnChanges(): void {
    const categories = this.series.map((s) => this.formatDate(s.date));
    this.xaxis = { ...this.xaxis, categories };
    this.chartSeries = [
      { name: 'Receitas', data: this.series.map((s) => s.income) },
      { name: 'Despesas', data: this.series.map((s) => s.expense) },
    ];
  }

  private formatDate(dateStr: string): string {
    const [, month, day] = dateStr.split('-');
    return `${day}/${month}`;
  }
}
