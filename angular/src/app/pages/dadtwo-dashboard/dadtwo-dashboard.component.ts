import { Component, AfterViewInit,OnInit, ViewChild, ElementRef,ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { Chart,ChartOptions, ChartData, ChartType } from 'chart.js/auto';
import { Color } from '@swimlane/ngx-charts';
import { ScaleType } from '@swimlane/ngx-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dadtwo-dashboard',
  templateUrl: './dadtwo-dashboard.component.html',
  styleUrl: './dadtwo-dashboard.component.scss'
})
export class DadtwoDashboardComponent implements OnInit{

  filterOptions: any = {
    status: [
      { key: 'before', value: 'Before 2016' },
      { key: 'after', value: 'After 2016' },
    ],
    district: [],
    caste: [],
    subcaste: [],
    // nature: [],
    gender: ['Male', 'Female', 'Other'],
  };

  selectedFilters = {
    status: '',
    district: '',
    caste: '',
    subcaste: '',
    gender: '',
    dateRange: '',
    fromDate: '',
    toDate: ''
  };

  onDateRangeChange() {
    const today = new Date();
  
    if (this.selectedFilters.dateRange === 'today') {
      this.selectedFilters.fromDate = today.toISOString().split('T')[0];
      this.selectedFilters.toDate = today.toISOString().split('T')[0];
    } else if (this.selectedFilters.dateRange === 'week') {
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      this.selectedFilters.fromDate = startOfWeek.toISOString().split('T')[0];
      this.selectedFilters.toDate = new Date().toISOString().split('T')[0];
    } else if (this.selectedFilters.dateRange === 'month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      this.selectedFilters.fromDate = startOfMonth.toISOString().split('T')[0];
      this.selectedFilters.toDate = new Date().toISOString().split('T')[0];
    }
    else if (this.selectedFilters.dateRange === 'year') {
      const startOfYear = new Date(today.getFullYear(), today.getMonth(), 1);
      this.selectedFilters.fromDate = startOfYear.toISOString().split('T')[0];
      this.selectedFilters.toDate = new Date().toISOString().split('T')[0];
    }
  
    this.applyFilters();
  }


  constructor(private dashboardService: DashboardService,private cdRef: ChangeDetectorRef) {}

  searchTerm: string = '';


  headerCards = [
    { title: 'Total Number of Cases', value: 0 },
    { title: 'Total Number of Cases Register Before “DATE”', value: 0 },
    { title: 'Total Number of Cases Register After “DATE”', value: 0 },
  ];

  redZoneCards = [
    { title: 'Cases pending for more than 7 days', value: 0 },
    { title: 'Cases pending for more than 60 days', value: 0 },
    { title: 'Cases pending for more than 90 days', value: 0 },
  ];

  redZoneCases = [
    { firNo: '01/2024', district: 'Trichy', pendingDays: 6, status: 'Pending 1st Relief', firstReliefGiven: false, priority: 'High', nextActionDue: 'Within 1 Day' },
    { firNo: '02/2024', district: 'Trichy', pendingDays: 5, status: 'Pending 1st Relief', firstReliefGiven: false, priority: 'Medium', nextActionDue: 'Within 2 Days' },
    { firNo: '04/2024', district: 'Trichy', pendingDays: 7, status: 'Red Zone', firstReliefGiven: false, priority: 'Critical', nextActionDue: 'Immediate' },
    { firNo: '07/2024', district: 'Trichy', pendingDays: 4, status: 'Pending', firstReliefGiven: true, priority: 'Low', nextActionDue: 'N/A' },
  ];

  // Semi-circle circumference
  cards = [
    { title: 'Job Given', percentage: 0, total: 0, status: 'given' },
    { title: 'Pension Given', percentage: 0, total: 0, status: 'given' },
    { title: 'Patta Given', percentage: 0, total: 0, status: 'given' },
    { title: 'Education Concession Given', percentage: 0, total: 0, status: 'given' },
    { title: 'Job Pending', percentage: 0, total: 0, status: 'pending' },
    { title: 'Pension Pending', percentage: 0, total: 0, status: 'pending' },
    { title: 'Patta Pending', percentage: 0, total: 0, status: 'pending' },
    { title: 'Education Concession Pending', percentage: 0, total: 0, status: 'pending' },
  ];
  getStrokeDashArray(percentage: number): string {
    const circumference = Math.PI * 40;
    const progress = (percentage / 100) * circumference;
    return `${progress} ${circumference - progress}`;
  }

  @ViewChild('pieChart') pieChart!: ElementRef;

  createPieChart(givenPercentage: number, pendingPercentage: number): void {
    new Chart("pieChart", {
      type: 'pie',
      data: {
        labels: ['Relief Pending', 'Relief Given'],
        datasets: [
          {
            data: [pendingPercentage, givenPercentage],
            backgroundColor: ['#007bff', '#ADD8E6'], 
            hoverBackgroundColor: ['#0056b3', '#7ec0ee'],
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
          // tooltip: {
          //   callbacks: {
          //     label: (context) => `${context.label}: ${context.raw}%`
          //   }
          // }
          tooltip: {
            enabled: true
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
                ctx.font = 'bold 13px Arial';
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

  districtNames: string[] = [];
  caseCounts: number[] = [];
  chart: Chart | null = null;
  createBarChart(): void {

    new Chart('districtBarChart', {
      type: 'bar',
      data: {
        labels: this.districtNames,
        datasets: [
          {
            label: 'Cases',
            data: this.caseCounts,
            backgroundColor: '#36b9cc',
            borderColor: '#2c9faf',
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              weight: 'bold',
              size: 12
            },
            formatter: (value) => value
          }
        },
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        },
        aspectRatio: 1
      },
      plugins: [ChartDataLabels]
    });
  }


  districtNames1: string[] = [];
  caseCounts1: number[] = [];
  chart1: Chart | null = null;
  createBarChart1(): void {

    new Chart('districtBarChart1', {
      type: 'bar',
      data: {
        labels: this.districtNames1,
        datasets: [
          {
            label: 'Cases',
            data: this.caseCounts1,
            backgroundColor: '#36b9cc',
            borderColor: '#2c9faf',
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: false, // Disable responsiveness to manually control size
        maintainAspectRatio: false, // Allow explicit height/width control
        plugins: {
          legend: {
            display: false
          },
          datalabels: {
            color: '#fff',
            anchor: 'center', 
            align: 'center', 
            font: {
              weight: 'bold',
              size: 12
            },
            formatter: (value) => value
          }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        },
        aspectRatio: 1,
      },
      plugins: [ChartDataLabels]
    });
  };



  ngOnInit(): void {

    this.dashboardService.getFilterOptions().subscribe(data => {
      this.filterOptions.status = this.filterOptions.status;
      this.filterOptions.gender = this.filterOptions.gender;
      this.filterOptions.district = data.district || [];
      this.filterOptions.caste = data.caste || [];
      this.filterOptions.subcaste = data.subcaste || [];
    });

    this.fetchData();

    this.updateFilter();
    this.updateFilter1();

    this.cdRef.detectChanges();
  }

  fetchData() {
    this.dashboardService.getDadtwoDashboardCountData().subscribe(data => {
      this.headerCards[0].value = data.totalCases;
      this.headerCards[1].value = data.casesBefore2016;
      this.headerCards[2].value = data.casesAfter2016;

      this.redZoneCards[0].value = data.moreThan7Days;
      this.redZoneCards[1].value = data.moreThan60Days;
      this.redZoneCards[2].value = data.moreThan90Days;

      const reliefData = data.reliefData;

      this.cards.forEach((card, index) => {
        switch (card.title) {
          case 'Job Given':
            card.total = reliefData.job_given_count;
            card.percentage = reliefData.job_given_percentage;
            break;
          case 'Pension Given':
            card.total = reliefData.pension_given_count;
            card.percentage = reliefData.pension_given_percentage;
            break;
          case 'Patta Given':
            card.total = reliefData.patta_given_count;
            card.percentage = reliefData.patta_given_percentage;
            break;
          case 'Education Concession Given':
            card.total = reliefData.education_given_count;
            card.percentage = reliefData.education_given_percentage;
            break;
          case 'Job Pending':
            card.total = reliefData.job_pending_count;
            card.percentage = reliefData.job_pending_percentage;
            break;
          case 'Pension Pending':
            card.total = reliefData.pension_pending_count;
            card.percentage = reliefData.pension_pending_percentage;
            break;
          case 'Patta Pending':
            card.total = reliefData.patta_pending_count;
            card.percentage = reliefData.patta_pending_percentage;
            break;
          case 'Education Concession Pending':
            card.total = reliefData.education_pending_count;
            card.percentage = reliefData.education_pending_percentage;
            break;
        }
      });

      const reliefcaseData = data.reliefCaseData;

      this.createPieChart(
        parseFloat(reliefcaseData.given_percentage),
        parseFloat(reliefcaseData.pending_percentage)
      );
      
      this.createBarChart();
      this.createBarChart1();
      
      // console.log(data);
    
      this.cdRef.detectChanges();
    });
  }

  


  applyFilters() {
    let fromDate = '';
    let toDate = '';
    const today = new Date();
  
    if (this.selectedFilters.dateRange === 'today') {
      fromDate = today.toISOString().split('T')[0];
      toDate = today.toISOString().split('T')[0];
    } else if (this.selectedFilters.dateRange === 'week') {
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      fromDate = startOfWeek.toISOString().split('T')[0];
      toDate = new Date().toISOString().split('T')[0];
    } else if (this.selectedFilters.dateRange === 'month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      fromDate = startOfMonth.toISOString().split('T')[0];
      toDate = new Date().toISOString().split('T')[0];
    } else if (this.selectedFilters.dateRange === 'year') {
      const startOfYear = new Date(today.getFullYear(), today.getMonth(), 1);
      fromDate = startOfYear.toISOString().split('T')[0];
      toDate = new Date().toISOString().split('T')[0];
    }


    const filterPayload = {
      status: this.selectedFilters.status,
      district: this.selectedFilters.district,
      caste: this.selectedFilters.caste,
      subcaste: this.selectedFilters.subcaste,
      gender: this.selectedFilters.gender,
      fromDate: fromDate,
      toDate: toDate,
    };
  
    console.log('Sending Filter Data:', filterPayload);
  
    // this.dashboardService.applyFilters(filterPayload).subscribe(
    //   response => {
    //     console.log('Filtered Data from Backend:', response);

    //     this.cdRef.detectChanges(); 
        
    //   },
    //   error => {
    //     console.error('Error while applying filters:', error);
    //   }
    // );
  }


  selectedFilter: string = "Job";

  updateFilter() {
    const filters = { selectedFilter: this.selectedFilter };
    this.dashboardService.applybarchartgivenDataFilters(filters).subscribe(
      response => {

        this.districtNames = response.districtReliefData.map((item: any) => item.district_name);
        this.caseCounts = response.districtReliefData.map((item: any) => item.given_count);

        this.createBarChart();
        this.cdRef.detectChanges();

      }
    );
    this.cdRef.detectChanges();

  }


  selectedFilter1: string = "Job";

  updateFilter1() {
    const filters1 = { selectedFilter: this.selectedFilter1 };
    this.dashboardService.applybarchartpendingDataFilters(filters1).subscribe(
      response => {

        this.districtNames1 = response.districtReliefPendingData.map((item: any) => item.district_name);
        this.caseCounts1 = response.districtReliefPendingData.map((item: any) => item.pending_count);

        this.createBarChart1();
        this.cdRef.detectChanges();

      }
    );

    this.cdRef.detectChanges();

  }
  
}
