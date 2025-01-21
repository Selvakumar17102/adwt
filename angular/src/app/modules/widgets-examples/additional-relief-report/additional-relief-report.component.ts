import { Component, OnInit } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'; 
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-additional-relief-report',
   standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    DragDropModule,
  ],
  providers: [FirListTestService],
  templateUrl: './additional-relief-report.component.html',
  styleUrl: './additional-relief-report.component.scss'
})
export class AdditionalReliefReportComponent implements OnInit{
  searchText: string = '';
  firList: any[] = [];
  page: number = 1;
  filteredData: any[] = []; // Example dummy data for the table
  selectedtypeOfAdditionalReleif: string = '';
  itemsPerPage: number = 10;
  isReliefLoading: boolean = true;

  // Filters
  selectedDistrict: string = '';
  selectedNatureOfOffence: string = '';
  selectedStatusOfCase: string = '';
  selectedStatusOfRelief: string = '';
  // selectedtypeOfAdditionalReleif: string = '';

  // Filter options
  districts: string[] = [
    'Ariyalur',
    'Chengalpattu',
    'Chennai',
    'Coimbatore',
    'Cuddalore',
    'Dharmapuri',
    'Dindigul',
    'Erode',
    'Kallakurichi',
    'Kanchipuram',
    'Kanniyakumari',
    'Karur',
    'Krishnagiri',
    'Madurai',
    'Mayiladuthurai',
    'Nagapattinam',
    'Namakkal',
    'Nilgiris',
    'Perambalur',
    'Pudukkottai',
    'Ramanathapuram',
    'Ranipet',
    'Salem',
    'Sivagangai',
    'Tenkasi',
    'Thanjavur',
    'Theni',
    'Thoothukudi (Tuticorin)',
    'Tiruchirappalli (Trichy)',
    'Tirunelveli',
    'Tirupathur',
    'Tiruppur',
    'Tiruvallur',
    'Tiruvannamalai',
    'Tiruvarur',
    'Vellore',
    'Viluppuram',
    'Virudhunagar',
  ];

  naturesOfOffence: string[] = [
    'Theft',
    'Assault',
    'Fraud',
    'Murder',
    'Kidnapping',
    'Cybercrime',
    'Robbery',
    'Arson',
    'Cheating',
    'Extortion',
    'Dowry Harassment',
    'Rape',
    'Drug Trafficking',
    'Human Trafficking',
    'Domestic Violence',
    'Burglary',
    'Counterfeiting',
    'Attempt to Murder',
    'Hate Crime',
    'Terrorism',
  ];

  statusesOfCase: string[] = ['Just Starting', 'Pending', 'Completed'];
  statusesOfRelief: string[] = ['FIR Stage', 'ChargeSheet Stage', 'Trial Stage'];
  typeOfAdditionalReleif: string[] = ['Employment', 'Pension', 'House Site patta', 'Education Concession'];

  
  // Displayed Columns
  displayedColumns: { label: string; field: string; sortable: boolean; visible: boolean }[] = [];

  // Default Columns
  defaultColumns: { label: string; field: string; sortable: boolean; visible: boolean }[] = [
    { label: 'Sl. No.', field: 'sl_no', sortable: false, visible: true },
    { label: 'Revenue District', field: 'revenue_district', sortable: true, visible: true },
    { label: 'Police Station Name', field: 'police_station_name', sortable: true, visible: true },
    { label: 'FIR Number', field: 'fir_number', sortable: true, visible: true },
    { label: 'Victim Name', field: 'victim_name', sortable: true, visible: true },
    { label: 'Age', field: 'age', sortable: true, visible: true },
    { label: 'Gender', field: 'gender', sortable: true, visible: true },
    { label: 'Nature of Offence', field: 'nature_of_offence', sortable: true, visible: true },
    { label: 'Section of the PoA Act invoked for the offence', field: 'poa_section', sortable: true, visible: true },
  ];

  // Column Configurations for Additional Relief Types
  columnConfigs = {
    Employment: [
      { label: 'Status', field: 'status', sortable: true, visible: true },
      { label: 'Reason for Job pending - Previous Month', field: 'reason_job_pending_previous', sortable: true, visible: true },
      { label: 'If "OTHERS" option is selected enter valid reasons - Previous Month', field: 'others_reason_previous', sortable: true, visible: true },
      { label: 'Reason for Job pending - Current Month', field: 'reason_job_pending_current', sortable: true, visible: true },
      { label: 'If "OTHERS" option is selected enter valid reasons - Current Month', field: 'others_reason_current', sortable: true, visible: true },
    ],
    Pension: [
      { label: 'Status', field: 'status', sortable: true, visible: true },
      { label: 'Reason for Pension pending - Previous Month', field: 'reason_pension_pending_previous', sortable: true, visible: true },
      { label: 'If "OTHERS" option is selected enter the valid reason - Previous Month', field: 'others_reason_previous', sortable: true, visible: true },
      { label: 'Reason for Pension pending - Current Month', field: 'reason_pension_pending_current', sortable: true, visible: true },
      { label: 'If "OTHERS" option is selected enter the valid reason - Current Month', field: 'others_reason_current', sortable: true, visible: true },
    ],
    HouseSitePatta: [
      { label: 'Status', field: 'status', sortable: true, visible: true },
      { label: 'Reason for Patta pending - Previous Month', field: 'reason_patta_pending_previous', sortable: true, visible: true },
      { label: 'If "OTHERS" option is selected enter the valid reason - Previous Month', field: 'others_reason_previous', sortable: true, visible: true },
      { label: 'Reason for Patta pending - Current Month', field: 'reason_patta_pending_current', sortable: true, visible: true },
      { label: 'If "OTHERS" option is selected enter the valid reason - Current Month', field: 'others_reason_current', sortable: true, visible: true },
    ],
    EducationConcession: [
      { label: 'Status of the Current Month', field: 'status', sortable: true, visible: true },
      { label: 'Reason for Education concession  pending - Previous Month', field: 'reason_patta_pending_previous', sortable: true, visible: true },
      { label: 'If "OTHERS" option is selected enter the valid reason - Previous Month', field: 'others_reason_previous', sortable: true, visible: true },
      { label: 'Reason for Education Concession pending - Current Month', field: 'reason_patta_pending_current', sortable: true, visible: true },
      { label: 'If "OTHERS" option is selected enter the valid reason - Current Month', field: 'others_reason_current', sortable: true, visible: true },
    ],
  };


  selectedColumns: any[] = [...this.displayedColumns];
  currentSortField: string = '';
  isAscending: boolean = true;

  constructor(
    private firService: FirListTestService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.displayedColumns = [...this.defaultColumns];// Initialize default columns
    this.loadDummyData(); // Load dummy data for testing
    this.loadFirList();
    this.updateSelectedColumns();
  }
  updateDisplayedColumns(): void {
    console.log('Selected Type:', this.selectedtypeOfAdditionalReleif); // Debugging log
    switch (this.selectedtypeOfAdditionalReleif) {
      case 'Employment':
        this.displayedColumns = [...this.defaultColumns, ...this.columnConfigs.Employment];
        break;
      case 'Pension':
        this.displayedColumns = [...this.defaultColumns, ...this.columnConfigs.Pension];
        break;
      case 'House Site patta':
        this.displayedColumns = [...this.defaultColumns, ...this.columnConfigs.HouseSitePatta];
        break;
      case 'Education Concession':
        this.displayedColumns = [...this.defaultColumns, ...this.columnConfigs.EducationConcession];
        break;
      default:
        this.displayedColumns = [...this.defaultColumns]; // Fallback to default columns
        break;
    }
    console.log('Updated Columns:', this.displayedColumns); // Debugging log
  }

  loadDummyData(): void {
    this.filteredData = Array.from({ length: 25 }, (_, index) => ({
      sl_no: index + 1,
      revenue_district: 'District ' + (index + 1),
      police_station_name: 'Station ' + (index + 1),
      fir_number: 'FIR-' + (index + 1000),
      victim_name: 'Victim ' + (index + 1),
      age: 20 + index,
      gender: index % 2 === 0 ? 'Male' : 'Female',
      nature_of_offence: 'Offence ' + (index + 1),
      poa_section: 'Section ' + (index % 5 + 1),
      status: index % 2 === 0 ? 'Completed' : 'Pending',
      reason_job_pending_previous: 'Reason ' + index,
      others_reason_previous: index % 3 === 0 ? 'Other Reason ' + index : '',
      reason_job_pending_current: 'Reason ' + (index + 1),
      others_reason_current: index % 4 === 0 ? 'Other Reason ' + index : '',
    }));
  }



  updateSelectedColumns(): void {
    this.selectedColumns = this.displayedColumns.filter((column) => column.visible);
  }
  onColumnSelectionChange(): void {
    this.updateSelectedColumns(); // Call the method to update the selected columns based on visibility
  }
    
  toggleColumnVisibility(column: any): void {
  column.visible = !column.visible; // Toggle the visibility of the column
  this.updateSelectedColumns(); // Update the selected columns to reflect changes
}

  // Drag and drop for rearranging columns
  dropColumn(event: CdkDragDrop<any[]>) {
    // Perform the column reordering when an item is dropped
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    this.updateSelectedColumns();  // Make sure to update the selected columns
  }

  // Load FIR list from the backend (dummy data for now)
  loadFirList() {
    this.isReliefLoading = true;
    // Dummy data for FIR list
    this.firList = [
      { fir_id: 1, police_city: 'Chennai', police_station: 'Station A', nature_of_offence: 'Theft', case_status: 'Pending', relief_status: 'FIR Stage', victim_name: 'John Doe', reason_previous_month: 'Pending', reason_current_month: 'In Progress' },
      { fir_id: 2, police_city: 'Coimbatore', police_station: 'Station B', nature_of_offence: 'Assault', case_status: 'Completed', relief_status: 'ChargeSheet Stage', victim_name: 'Jane Doe', reason_previous_month: 'Completed', reason_current_month: 'Resolved' }
    ];
    this.isReliefLoading = false;
    this.cdr.detectChanges();
  }

  // Apply filters to the FIR list
  applyFilters() {
    this.page = 1; // Reset to the first page
    this.cdr.detectChanges();
  }

  // Filtered FIR list based on search and filter criteria
  filteredFirList() {
    const searchLower = this.searchText.toLowerCase();

    return this.firList.filter((fir) => {
      // Apply search filter
      const matchesSearch =
        fir.fir_id.toString().includes(searchLower) ||
        (fir.police_city || '').toLowerCase().includes(searchLower) ||
        (fir.police_station || '').toLowerCase().includes(searchLower) ||
        (fir.nature_of_offence || '').toLowerCase().includes(searchLower) ||
        (fir.case_status || '').toLowerCase().includes(searchLower);

      // Apply dropdown filters
      const matchesDistrict =
        this.selectedDistrict ? fir.district === this.selectedDistrict : true;
      const matchesNatureOfOffence =
        this.selectedNatureOfOffence
          ? fir.nature_of_offence === this.selectedNatureOfOffence
          : true;
      const matchesStatusOfCase =
        this.selectedStatusOfCase ? fir.status_of_case === this.selectedStatusOfCase : true;
      const matchesStatusOfRelief =
        this.selectedStatusOfRelief
          ? fir.status_of_relief === this.selectedStatusOfRelief
          : true;

      return (
        matchesSearch &&
        matchesDistrict &&
        matchesNatureOfOffence &&
        matchesStatusOfCase &&
        matchesStatusOfRelief
      );
    });
  }

  // Sorting logic
  sortTable(field: string) {
    if (this.currentSortField === field) {
      this.isAscending = !this.isAscending;
    } else {
      this.currentSortField = field;
      this.isAscending = true;
    }

    this.firList.sort((a, b) => {
      const valA = a[field]?.toString().toLowerCase() || '';
      const valB = b[field]?.toString().toLowerCase() || '';
      return this.isAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  // Get the sort icon class
  getSortIcon(field: string): string {
    return this.currentSortField === field
      ? this.isAscending
        ? 'fa-sort-up'
        : 'fa-sort-down'
      : 'fa-sort';
  }

  // Pagination controls
  totalPagesArray(): number[] {
    return Array(Math.ceil(this.filteredFirList().length / this.itemsPerPage))
      .fill(0)
      .map((_, i) => i + 1);
  }

  nextPage() {
    if (this.hasNextPage()) this.page++;
  }

  previousPage() {
    if (this.page > 1) this.page--;
  }

  goToPage(pageNum: number) {
    this.page = pageNum;
  }

  hasNextPage(): boolean {
    return this.page * this.itemsPerPage < this.filteredFirList().length;
  }
  openEditPage(firId: number): void {
    // Navigate to the 'edit-fir' page with the FIR id as a query parameter
    this.router.navigate(['/widgets-examples/edit-fir'], { queryParams: { fir_id: firId } });
  }
  paginatedFirList() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = this.page * this.itemsPerPage;
    return this.firList.slice(startIndex, endIndex); // Returns the items for the current page
  }
}

