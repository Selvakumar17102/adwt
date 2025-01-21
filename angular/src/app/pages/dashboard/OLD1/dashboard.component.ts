import { Component, AfterViewInit, ViewChild, ElementRef,ChangeDetectorRef, EventEmitter, OnInit, Output  } from '@angular/core';
import * as L from 'leaflet';
import { Chart,ChartOptions, ChartData, ChartType } from 'chart.js/auto';
import { Color } from '@swimlane/ngx-charts';
import { ScaleType } from '@swimlane/ngx-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { DashboardService } from '../../services/dashboard.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit  {

  @Output() filterChanged = new EventEmitter<any>();

  filterOptions: any = {
    status: [
      { key: 'UI', value: 'UI Stage' },
      { key: 'PT', value: 'PT Stage' },
    ],
    district: [],
    caste: [],
    subcaste: [],
    // nature: [],
    gender: ['Male', 'Female', 'Other'],
  };

  selectedFilters: any = {
    status: '',
    district: '',
    caste: '',
    subcaste: '',
    // nature: '',
    gender: '',
  };



  totalCases: number = 0;
  minorCases: number = 0;
  pendingTrials: number = 0;
  acquitted: number = 0;
  convicted: number = 0;

  cases = {
    '<1Year': 0,
    '1-5Years': 0,
    '6-10Years': 0,
    '11-20Years': 0,
    '>20Years': 0,
  };

  uicases = {
    '<2Mos': 0,
    '2-4Mos': 0,
    '4-6Mos': 0,
    '6-12Mos': 0,
    '>1Years': 0,
  };

  caseCounts1 = {
    fir: 0,
    chargesheet: 0,
    trial: 0
  };

  caseCounts2 = {
    death: 0,
    rape: 0,
    others: 0
  };

  constructor(private dashboardService: DashboardService,private cdRef: ChangeDetectorRef) {}



  @ViewChild('pieChart1') pieChart1!: ElementRef;

  @ViewChild('pieChart2') pieChart2!: ElementRef;


  createPieChart(): void {

    new Chart("pieChart1", {
      type: 'pie',
      data: {
        labels: ['FIR', 'Chargesheet', 'Trial'],
        datasets: [{
          data: [
            Number(this.caseCounts1.fir),
            Number(this.caseCounts1.chargesheet),
            Number(this.caseCounts1.trial)
          ],
          backgroundColor: ['#e12a2a', '#3e42ea', '#e3a01c'],
          hoverBackgroundColor: ['#e12a2a', '#3e42ea', '#e3a01c'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          },
        },
        interaction: {
          mode: 'none' as any,
          intersect: false
        },
        hover: {
          mode: undefined
        },
        animation: {
          onComplete: function (this: Chart) {
            const chart = this;
            const ctx = chart.ctx;

            chart.data.datasets.forEach((dataset, i) => {
              const numericData = dataset.data.filter((value): value is number => typeof value === 'number');
              const total = numericData.reduce((sum, value) => sum + value, 0);
              const meta = chart.getDatasetMeta(i);

              meta.data.forEach((slice, index) => {
                const value = numericData[index];
                const percentage = ((value / total) * 100).toFixed(2);
                const label = chart.data.labels![index] as string;
                const position = slice.tooltipPosition(true);
                const posX = position.x;
                const posY = position.y;
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                // ctx.fillText(`${label}: ${value} (${percentage}%)`, posX, posY - 5); // Adjusted position
                ctx.fillText(label, posX, posY - 15);
                ctx.fillText(`${value}`, posX, posY);
                ctx.fillText(`(${percentage}%)`, posX, posY + 15);
              });
            });
          }
        }
      }
    });

  }

  createPieChart1(): void {

    new Chart("pieChart2", {
      type: 'pie',
      data: {
        labels: ['Death', 'Rape','Others'],
        datasets: [
          {
            // data: [40, 30, 30],
            data: [
              Number(this.caseCounts2.death),
              Number(this.caseCounts2.rape),
              Number(this.caseCounts2.others)
            ],
            backgroundColor: ['#e12a2a', '#3e42ea', '#e3a01c'],
            hoverBackgroundColor: ['#e12a2a', '#3e42ea', '#e3a01c'],
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
        },
        interaction: {
          mode: 'none' as any,
          intersect: false
        },
        hover: {
          mode: undefined
        },
        animation: {
          onComplete: function (this: Chart) {
            const chart = this;
            const ctx = chart.ctx;

            chart.data.datasets.forEach((dataset, i) => {
              const numericData = dataset.data.filter((value): value is number => typeof value === 'number');
              const total = numericData.reduce((sum, value) => sum + value, 0);
              const meta = chart.getDatasetMeta(i);

              meta.data.forEach((slice, index) => {
                const value = numericData[index];
                const percentage = ((value / total) * 100).toFixed(2);
                const label = chart.data.labels![index] as string;
                const position = slice.tooltipPosition(true);
                const posX = position.x;
                const posY = position.y;
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                // ctx.fillText(`${label}: ${value} (${percentage}%)`, posX, posY - 5); // Adjusted position
                ctx.fillText(label, posX, posY - 15);
                ctx.fillText(`${value}`, posX, posY);
                ctx.fillText(`(${percentage}%)`, posX, posY + 15);
              });
            });
          }
        }
      }
    });
  }


  createBarChart(): void {
    this.dashboardService.getBarChartData().subscribe(data => {
      const uiBar = data.uiBar;
      const ptBar = data.ptBar;

      let barChart: Chart;

      // Initialize the chart
      barChart = new Chart('barChart', {
        type: 'bar',
        data: {
          labels: ['<1 Year', '1-5 Yrs', '6-10 Yrs', '11-20 Yrs', '>20 Yrs'], // Short names
          datasets: [
            {
              label: 'UI (Under Investigation)',
              data: uiBar,
              backgroundColor: '#414ce7',
            },
            {
              label: 'PTR (Pending Trial)',
              data: ptBar,
              backgroundColor: '#c7c7fa',
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
          interaction: {
            mode: 'none' as any,
            intersect: false
          },
          animation: {
            onComplete: () => {
              const ctx = barChart.ctx;
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              barChart.data.datasets.forEach((dataset, datasetIndex) => {
                const meta = barChart.getDatasetMeta(datasetIndex);
                meta.data.forEach((bar, dataIndex) => {
                  const value = dataset.data[dataIndex];
                  const label = barChart.data.labels?.[dataIndex];
                  if (label && value !== undefined) {
                    const text = `${label}: ${value}`;
                    const x = bar.x;
                    const y = bar.y - 5;
                    ctx.fillStyle = '#000000';
                    ctx.fillText(text, x, y);
                  }
                });
              });
            },
          },
        },
      });
    });
  }


  renderLineChart(): void {

    this.dashboardService.getLineChartData().subscribe(data => {
      const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: data.datasets[0].label,
              data: data.datasets[0].data,
              backgroundColor: 'rgba(0, 123, 255, 0.3)',
              borderColor: '#007bff',
              borderWidth: 2,
              fill: true,
              tension: 0.3,
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
                drawOnChartArea: true,
              },
            },
            y: {
              min: 0,
              max: Math.max(...data.datasets[0].data) + 10,
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
              display: false,
            },
          },
        },
      });
    });
  }


  ngOnInit(): void {

    this.dashboardService.getFilterOptions().subscribe(data => {

      this.filterOptions.status = this.filterOptions.status;
      this.filterOptions.gender = this.filterOptions.gender;

      this.filterOptions.district = data.district || [];
      this.filterOptions.caste = data.caste || [];
      this.filterOptions.subcaste = data.subcaste || [];
      // this.filterOptions.nature = data.nature || [];
    });


    this.dashboardService.getDashboardCountData().subscribe(data => {
      this.totalCases = data.totalCases;
      this.minorCases = data.minorCases;
      this.pendingTrials = data.pendingTrials;
      this.acquitted = data.acquittedCases;
      this.convicted = data.convictedCases;
      this.cdRef.detectChanges();
    });

    this.dashboardService.getCasesByYearRange().subscribe(data => {
      this.cases = data.cases;
      this.cdRef.detectChanges();
    });

    this.dashboardService.getCasesByMonthRange().subscribe(data => {
      this.uicases = data.uicases;
      this.cdRef.detectChanges();
    });


    this.dashboardService.getCaseStatusCounts().subscribe(data => {
      this.caseCounts1 = data;
      this.createPieChart();
      this.cdRef.detectChanges();
    });

    this.dashboardService.getCaseStatus1Counts().subscribe(data => {
      this.caseCounts2 = data;
      this.createPieChart1();
      this.cdRef.detectChanges();
    });


    this.createBarChart();

    this.renderLineChart();



  }

  // Emit changes whenever a filter is applied
  applyFilters() {
    const filterPayload = {
      status: this.selectedFilters.status,
      district: this.selectedFilters.district,
      caste: this.selectedFilters.caste,
      subcaste: this.selectedFilters.subcaste,
      // nature: this.selectedFilters.nature,
      gender: this.selectedFilters.gender,
    };

    console.log('Sending Filter Data:', filterPayload);

    // Call the backend API to apply filters
    this.dashboardService.applyFilters(filterPayload).subscribe(
      response => {
        console.log('Filtered Data from Backend:', response);
        // Handle the filtered data (e.g., update the UI)
      },
      error => {
        console.error('Error while applying filters:', error);
      }
    );
  }


  logout() {
    sessionStorage.clear();
  }



  ngAfterViewInit() {


  }

}
