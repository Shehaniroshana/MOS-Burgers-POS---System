import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';
import { RouterLink } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports:[RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  date = new Date().toDateString();
  time= new Date().toLocaleTimeString();
  @ViewChild('myChart') private chartRef!: ElementRef;
  private chart!: Chart;

  public config: any = {
    type: 'bar',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [{
        label: 'Monthly Performance',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(239, 68, 68, 0.7)',  // Tailwind red-500 (#ef4444) with opacity
        borderColor: 'rgba(239, 68, 68, 1)',        // Solid red-500 border
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(239, 68, 68, 0.9)',  // Slightly darker on hover
        hoverBorderColor: 'rgba(239, 68, 68, 1)',
        barThickness: 20,  // Keeping the smaller bars
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

  ngAfterViewInit(): void {
    this.chart = new Chart(this.chartRef.nativeElement, this.config);
  }
}