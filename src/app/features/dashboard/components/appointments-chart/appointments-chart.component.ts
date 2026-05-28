import { Component, Input, OnChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import { AppointmentDayStat } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-appointments-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './appointments-chart.component.html',
  styleUrl: './appointments-chart.component.css',
})
export class AppointmentsChartComponent implements OnChanges {
  @Input() series: AppointmentDayStat[] = [];

  chartSeries: { name: string; data: number[] }[] = [];
  categories: string[] = [];

  chart: ApexChart = {
    type: 'bar',
    height: 280,
    toolbar: { show: false },
    fontFamily: 'inherit',
  };

  plotOptions: ApexPlotOptions = {
    bar: { columnWidth: '60%', borderRadius: 4 },
  };

  dataLabels: ApexDataLabels = { enabled: false };
  stroke: ApexStroke = { show: true, width: 2, colors: ['transparent'] };

  colors = ['#2E7D32', '#00838F', '#1976D2', '#E53935'];

  legend: ApexLegend = {
    position: 'top',
    horizontalAlign: 'left',
    fontSize: '13px',
  };

  xaxis: ApexXAxis = { categories: [], labels: { style: { fontSize: '12px' } } };
  yaxis: ApexYAxis = { labels: { style: { fontSize: '12px' } } };

  tooltip: ApexTooltip = {
    y: { formatter: (val: number) => `${val} agendamento(s)` },
  };

  ngOnChanges(): void {
    this.categories = this.series.map((s) => this.formatDate(s.date));
    this.xaxis = { ...this.xaxis, categories: this.categories };
    this.chartSeries = [
      { name: 'Realizados', data: this.series.map((s) => s.completed) },
      { name: 'Confirmados', data: this.series.map((s) => s.confirmed) },
      { name: 'Agendados', data: this.series.map((s) => s.scheduled) },
      { name: 'Cancelados', data: this.series.map((s) => s.cancelled) },
    ];
  }

  private formatDate(dateStr: string): string {
    const [, month, day] = dateStr.split('-');
    return `${day}/${month}`;
  }
}
