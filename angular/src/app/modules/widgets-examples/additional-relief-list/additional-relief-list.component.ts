import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalReliefService } from 'src/app/services/additional-relief.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-additional-relief-list',
  standalone: true,
  imports: [CommonModule,DragDropModule,FormsModule,MatSelectModule,MatOptionModule,MatCheckboxModule],
  templateUrl: './additional-relief-list.component.html',
  styleUrls: ['./additional-relief-list.component.scss']
})
export class AdditionalReliefListComponent implements OnInit {
  searchText: string = '';
  firList: any[] = []; // Complete FIR list
  displayedFirList: any[] = []; // Paginated FIRs
  page = 1; // Current page
  itemsPerPage = 10; // Items per page
  totalPages = 1; // Total number of pages
  isLoading = true; // Loading indicator

  constructor(
    private additionalreliefService: AdditionalReliefService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchFIRList();
    this.updateSelectedColumns();
  }

  // Filters
  selectedDistrict: string = '';
  selectedNatureOfOffence: string = '';
  selectedStatusOfCase: string = '';
  selectedStatusOfRelief: string = '';

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
    'Virudhunagar'
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
    'Terrorism'
  ];

  statusesOfCase: string[] = ['Just Starting', 'Pending', 'Completed'];
  statusesOfRelief: string[] = ['FIR Stage', 'ChargeSheet Stage', 'Trial Stage'];

  // Visible Columns Management

  displayedColumns: { label: string; field: string; sortable: boolean; visible: boolean }[] = [
    { label: 'Sl.No', field: 'sl_no', sortable: false, visible: true },
    { label: 'FIR ID', field: 'fir_id', sortable: true, visible: true },
    { label: 'Total Victims', field: 'victims_with_relief', sortable: true, visible: true },
    { label: 'Victims with Relief', field: 'victim_relief', sortable: true, visible: true },
    // { label: 'Actions', field: 'created_by', sortable: true, visible: true },
    // { label: 'Created At', field: 'created_at', sortable: true, visible: true },
    // { label: 'Status', field: 'status', sortable: false, visible: true },
  ];

  selectedColumns: any[] = [...this.displayedColumns];

  // Sorting variables
  currentSortField: string = '';
  isAscending: boolean = true;

  // Fetch FIR data from the service
  fetchFIRList(): void {
    this.isLoading = true;
    this.additionalreliefService.getFIRAdditionalReliefList().subscribe(
      (data) => {
        console.log('Raw API Response:', data);
        // Filter FIRs with at least one victim with relief
        this.firList = (data || []).filter((fir) => fir.victims_with_relief > 0);
        console.log('Filtered FIR List:', this.firList);
        this.updatePagination();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching FIR data:', error);
        this.isLoading = false;
      }
    );
  }

  // Update pagination data
  updatePagination(): void {
    this.totalPages = Math.ceil(this.firList.length / this.itemsPerPage);
    this.updateDisplayedList();
  }

  // Update the list of FIRs for the current page
  updateDisplayedList(): void {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    this.displayedFirList = this.firList.slice(startIndex, startIndex + this.itemsPerPage);
    console.log('Displayed FIR List:', this.displayedFirList);
  }

  // Pagination controls
  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updateDisplayedList();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.updateDisplayedList();
    }
  }

  goToPage(pageNum: number): void {
    this.page = pageNum;
    this.updateDisplayedList();
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Navigate to the additional relief details page
  navigateToRelief(firId: string): void {
    this.router.navigate(['widgets-examples/additional-relief'], {
      queryParams: { fir_id: firId },
    });
  }


  updateSelectedColumns() {
    this.selectedColumns = this.displayedColumns.filter((col) => col.visible);
  }
  // Toggle column visibility
  toggleColumnVisibility(column: any) {
    column.visible = !column.visible; // Toggle visibility
    this.updateSelectedColumns(); // Update selected columns
  }

  // Drag and drop for rearranging columns
  dropColumn(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    this.updateSelectedColumns(); // Update selected columns after rearranging
  }

  // dropRow(event: CdkDragDrop<any[]>) {
  //   moveItemInArray(this.firList, event.previousIndex, event.currentIndex);
  // }



  // Load FIR list from the backend
  // loadFirList() {
  //   this.isLoading = true;
  //   this.firService.getFirList().subscribe(
  //     (data: any[]) => {
  //       this.firList = data;
  //       this.isLoading = false;
  //       this.cdr.detectChanges();
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       Swal.fire('Error', 'Failed to load FIR data', 'error');
  //     }
  //   );
  // }

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
        (fir.police_station || '').toLowerCase().includes(searchLower);

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

  // Paginated FIR list
  paginatedFirList() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.filteredFirList().slice(startIndex, startIndex + this.itemsPerPage);
  }


}
