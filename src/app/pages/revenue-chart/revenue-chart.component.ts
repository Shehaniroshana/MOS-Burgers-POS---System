import { AfterViewInit, Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { getRevenueByLast6Month } from '../../Service/DashboardService';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.component.html',
  styleUrl: './revenue-chart.component.css'
})
export class RevenueChartComponent implements AfterViewInit {
  revenueByLast6Month: number[] = [];
  private chart: Chart | undefined;
  private monthLabels: string[] = [];

  // Function to generate the last 6 months' labels
  private generateMonthLabels(): string[] {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const labels: string[] = [];
    const currentDate = new Date('2025-04-16'); // Current date: April 16, 2025
    for (let i = 6; i > 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      const monthName = months[date.getMonth()];
      const year = date.getFullYear();
      labels.push(`${monthName} ${year}`);
    }
    return labels;
  }

  public config: any = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Monthly Revenue',
        data: [],
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
            text: 'Revenue ($)',
            font: {
              size: 14
            }
          },
          ticks: {
            callback: (value: number) => `$${value.toLocaleString()}`
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
          },
          callbacks: {
            label: (context: any) => `Revenue: $${context.raw.toLocaleString()}`
          }
        }
      }
    }
  };

  constructor() {
    this.monthLabels = this.generateMonthLabels();
    this.config.data.labels = this.monthLabels;

    this.getData().then(() => {
      this.chartInit();
    });
  }

  async getData() {
    try {
      this.revenueByLast6Month = await getRevenueByLast6Month();
      console.log('====================================');
      console.log(this.revenueByLast6Month);
      console.log('====================================');
      this.updateChartData();
    } catch (error) {
      console.error('Error in getData:', error);
    }
  }

  ngAfterViewInit() {
    // Chart initialization is handled in the constructor after getData
  }

  updateChartData() {
    if (this.chart) {
      this.chart.data.datasets[0].data = this.revenueByLast6Month;
      this.chart.update();
    } else {
      this.config.data.datasets[0].data = this.revenueByLast6Month;
    }
  }

  chartInit() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (canvas) {
      this.chart = new Chart(canvas, this.config);
    } else {
      console.error('Canvas element not found');
    }
  }
}