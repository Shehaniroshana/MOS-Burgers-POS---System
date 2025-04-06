import { AfterViewInit, Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.component.html',
  styleUrl: './revenue-chart.component.css'
})
export class RevenueChartComponent implements AfterViewInit {
  public config: any = {
    type: 'bar',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [{
        label: 'Monthly Performance',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 0,
        hoverBackgroundColor: 'rgba(239, 68, 68, 0.9)',
        hoverBorderColor: 'rgba(239, 68, 68, 1)',
        barThickness: 20,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          title: {
            display: true,
            text: 'Number of Votes',
            font: {
              size: 14
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          title: {
            display: true,
            text: 'Months',
            font: {
              size: 14
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 12
          }
        }
      }
    }
  };

  constructor() { }

  ngAfterViewInit() {
    this.chartInit();
  }

  chartInit() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (canvas) {
      new Chart(canvas, this.config);
    } else {
      console.error('Canvas element not found');
    }
  }
}