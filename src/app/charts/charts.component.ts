import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() chartType: ChartType = 'bar'; // Default to bar chart
  @Input() chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [],
  };
  @Input() chartOptions: ChartConfiguration['options'] = {};

  private chart!: Chart;

  ngOnInit(): void {
    this.initializeChart();
  }

  private initializeChart(): void {
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: this.chartType,
      data: this.chartData,
      options: this.chartOptions,
    });
  }
}
