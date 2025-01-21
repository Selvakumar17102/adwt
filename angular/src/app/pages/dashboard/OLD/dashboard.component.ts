import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { Chart,ChartOptions, ChartData, ChartType } from 'chart.js/auto';
import { Color } from '@swimlane/ngx-charts';
import { ScaleType } from '@swimlane/ngx-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit  {

  cases = {
    '<1Year': 300,
    '1-5Years': 100,
    '6-10Years': 300,
    '11-20Years': 100,
    '>20Years': 100,
  };

  totalCases: number = 1500;
  pendingTrials: number = 500;
  minorCases: number = 1000;

  @ViewChild('pieChart1') pieChart1!: ElementRef;

  @ViewChild('pieChart2') pieChart2!: ElementRef;

  private map: any;

  districtData = [
    { name: 'Madurai', value: 20, status: 'Normal' },
    { name: 'Thirunelveli', value: 30, status: 'Mild' },
    { name: 'Thiruvannamalai', value: 40, status: 'Normal' },
    { name: 'Thanjavur', value: 20, status: 'Normal' },
    { name: 'Sivagangai', value: 2, status: 'Normal' },
    { name: 'Thenkasi', value: 10, status: 'Normal' },
    { name: 'Theni', value: 45, status: 'Mild' },
    { name: 'Salem', value: 97, status: 'Critical' },
    { name: 'Cuddalore', value: 57, status: 'Critical' },
    { name: 'Vilupuram', value: 59, status: 'Critical' },
    { name: 'Coimbatore', value: 38, status: 'Mild' },
    { name: 'Erode', value: 52, status: 'Mild' },
    { name: 'Tiruvarur', value: 64, status: 'Critical' },
    { name: 'Namakkal', value: 42, status: 'Mild' },
    { name: 'Krishnagiri', value: 64, status: 'Critical' }
  ];






  createPieChart(): void {

    new Chart("pieChart1", {
      type: 'pie',
      data: {
        labels: ['FIR', 'Chargesheet','Trial'],
        datasets: [
          {
            data: [60, 20,20], // Adjust the values here
            backgroundColor: ['#007bff', '#5bc0de', '#6c757d'], // Colors for the chart segments
            hoverBackgroundColor: ['#0056b3', '#7ec0ee', '#7ec0ee'], // Hover effect colors
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false // Hides default legend
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}%`
            }
          }
        }
      }
    });

    new Chart("pieChart2", {
      type: 'pie',
      data: {
        labels: ['Death', 'Rape','Others'],
        datasets: [
          {
            data: [40, 30, 30],
            backgroundColor: ['#007bff', '#5bc0de', '#6c757d'], // Colors for the chart segments
            hoverBackgroundColor: ['#0056b3', '#7ec0ee', '#7ec0ee'], // Hover effect colors
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false // Hides default legend
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}%`
            }
          }
        }
      }
    });
  }




  view: [number, number] = [500, 400];

  givenCasesData = [
    { name: 'Madurai', value: 20 },
    { name: 'Thirunelveli', value: 30 },
    { name: 'Thiruvannamalai', value: 40 },
    { name: 'Thanjavur', value: 20 },
    { name: 'Salem', value: 97 },
    { name: 'Sale', value: 97 },
    { name: 'Sal', value: 97 },
    { name: 'S', value: 97 },
    { name: 'Salem4444', value: 97 },
    { name: 'Salemwew', value: 97 },
    { name: 'Salemsdsd', value: 97 },
    { name: 'Salems', value: 97 },
    { name: 'Salemxcxx', value: 97 },
    { name: 'Salemxcxv', value: 97 },
    { name: 'Salemrete', value: 97 },
    { name: 'Salem111', value: 97 },
    { name: 'Salem22222', value: 97 },
    { name: 'Salem3333', value: 97 },
    { name: 'Salem5555', value: 97 },
    { name: 'Salem667', value: 97 },
    { name: 'Salem89', value: 97 },
  ];

  pendingCasesData = [
    { name: 'Madurai', value: 20 },
    { name: 'Thirunelveli', value: 30 },
    { name: 'Thiruvannamalai', value: 40 },
    { name: 'Thanjavur', value: 20 },
    { name: 'Salem', value: 97 },
    { name: 'Sale', value: 97 },
    { name: 'Sal', value: 97 },
    { name: 'S', value: 97 },
    { name: 'Salem4444', value: 97 },
    { name: 'Salemwew', value: 97 },
    { name: 'Salemsdsd', value: 97 },
    { name: 'Salems', value: 97 },
    { name: 'Salemxcxx', value: 97 },
    { name: 'Salemxcxv', value: 97 },
    { name: 'Salemrete', value: 97 },
    { name: 'Salem111', value: 97 },
    { name: 'Salem22222', value: 97 },
    { name: 'Salem3333', value: 97 },
    { name: 'Salem5555', value: 97 },
    { name: 'Salem667', value: 97 },
    { name: 'Salem89', value: 97 },
  ];




  user: any = {};

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.user = {
      id: sessionStorage.getItem('userId'),
      name: sessionStorage.getItem('userName'),
      role: sessionStorage.getItem('userRole'),
      email: sessionStorage.getItem('userEmail'),
    };
  }

  logout() {
    sessionStorage.clear();
  }



  ngAfterViewInit() {

    const districtNames = [
      'Madurai', 'Thirunelveli', 'Thiruvannamalai', 'Thanjavur',
      'Sivagangai', 'Thenkasi', 'Theni', 'Salem',
      'Cuddalore', 'Vilupuram', 'Coimbatore', 'Erode',
      'Tiruvarur', 'Namakkal', 'Krishnagiri'
    ];
    const caseCounts = [20, 30, 40, 20, 2, 10, 45, 97, 57, 59, 38, 52, 64, 42, 64];




    new Chart('districtBarChart2', {
      type: 'bar',
      data: {
        labels: districtNames,
        datasets: [
          {
            label: 'Cases',
            data: caseCounts,
            backgroundColor: '#36b9cc',
            borderColor: '#2c9faf',
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y', // Horizontal bar chart
        responsive: true,
        plugins: {
          legend: {
            display: false // Hides the dataset label
          }
        },
        scales: {
          x: {
            beginAtZero: true // Ensures x-axis starts from 0
          }
        }
      }
    });

    // Initialize Map
    this.initializeMap();

    this.renderLineChart();

    // Add District Layers
    this.addDistrictsToMap();

    this.createPieChart();


    // Bar Chart
    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['<1 Year', '1-5 Yrs', '6-10 Yrs', '11-20 Yrs', '>20 Yrs'],
        datasets: [
          {
            label: 'UI (Under Investigation)',
            data: [150, 250, 200, 80, 180],
            backgroundColor: '#4e73df',
          },
          {
            label: 'PTR (Pending Trial)',
            data: [120, 180, 150, 70, 160],
            backgroundColor: '#36b9cc',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });

    // Doughnut Chart 1
    new Chart('doughnutChart1', {
      type: 'doughnut',
      data: {
        labels: ['Acquitted', 'Remaining'],
        datasets: [
          {
            data: [78, 22],
            backgroundColor: ['#4e73df', '#e9ecef'],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    // Doughnut Chart 2
    new Chart('doughnutChart2', {
      type: 'doughnut',
      data: {
        labels: ['Convicted', 'Remaining'],
        datasets: [
          {
            data: [73, 27],
            backgroundColor: ['#1cc88a', '#e9ecef'],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  private initializeMap() {
    this.map = L.map('districtMap').setView([10.8505, 78.6509], 7); // Coordinates of Tamil Nadu, India

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private addDistrictsToMap() {
    this.districtData.forEach((district) => {
      const color =
        district.status === 'Normal'
          ? '#28a745'
          : district.status === 'Mild'
          ? '#ffc107'
          : '#dc3545';

      // Create a circle for each district
      L.circle([10.8505 + Math.random(), 78.6509 + Math.random()], {
        color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 10000
      })
        .bindPopup(`<b>${district.name}</b><br>Cases: ${district.value}`)
        .addTo(this.map);
    });
  }


  renderLineChart(): void {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          '1997', '2000', '2001', '2002', '2004', '2006', '2007',
          '2008', '2010', '2012', '2013', '2014', '2016',
        ],
        datasets: [
          {
            label: 'Pending Cases',
            data: [10, 20, 15, 40, 60, 50, 45, 50, 70, 80, 65, 70, 90],
            backgroundColor: 'rgba(0, 123, 255, 0.3)',
            borderColor: '#007bff',
            borderWidth: 2,
            fill: true,
            tension: 0.3, // smooth curve
            pointRadius: 4,
            pointBackgroundColor: '#007bff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              drawOnChartArea: false,
            },
          },
          y: {
            min: 0,
            max: 100,
            ticks: {
              stepSize: 10,
            },
            grid: {
              drawOnChartArea: true,
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Hides the legend
          },
        },
      },
    });
  }
}
