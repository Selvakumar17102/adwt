import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReliefService } from 'src/app/services/relief.service';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-relief-list',
  templateUrl: './relief-list.component.html',
  styleUrls: ['./relief-list.component.scss'],
  standalone: true,
  imports: [CommonModule,DragDropModule,RouterModule,FormsModule,MatSelectModule,MatOptionModule,MatCheckboxModule],

})
export class ReliefListComponent implements OnInit {
  firList: any[] = []; // Complete FIR list
  displayedFirList: any[] = []; // FIRs to show on current page
  page = 1; // Current page
  itemsPerPage = 10; // Items per page
  totalPages = 1; // Total number of pages
  isLoading = true; // Loading indicator
  searchText: string = '';

  constructor(
    private reliefService: ReliefService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.updateSelectedColumns();
    this.fetchFIRList();
  }

  // Fetch FIR data from the service
  fetchFIRList(): void {
    this.isLoading = true;
    this.reliefService.getFIRReliefList().subscribe(
      (data) => {
        this.firList = (data || []).filter((fir) => [5, 6, 7, 11, 12,13].includes(fir.status)); // Filter data
        this.updatePagination();
        this.isLoading = false;
        this.cdr.detectChanges(); // Ensure the UI is updated immediately
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
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  // Get badge classes for the status
 // Get badge classes for the status
getStatusBadgeClass(status: number): string {
  const badgeClassMap = {
    0: 'badge bg-info text-white',
    1: 'badge bg-warning text-dark',
    2: 'badge bg-warning text-dark',
    3: 'badge bg-warning text-dark',
    4: 'badge bg-warning text-dark',
    5: 'badge bg-danger text-white', // Red for FIR Stage pending
    6: 'badge bg-danger text-white', // Red for Chargesheet Stage pending
    7: 'badge bg-danger text-white',
    // 8: 'badge bg-danger text-white',
    // 9: 'badge bg-danger text-white', // Red for Trial Stage pending
    11: 'badge bg-primary text-white', // On completion of Disbursement of FIR Stage Relief
    12: 'badge bg-success text-white', // Chargesheet Stage completed
    13: 'badge bg-success text-white', // Completed
  } as { [key: number]: string };

  return badgeClassMap[status] || 'badge bg-secondary text-white';
}

// Get status text for the status
getStatusText(status: number, reliefStatus: number, natureOfJudgement?: string): string {
  const statusTextMap = {
    0: 'Just Starting',
    1: 'Pending | FIR Stage | Step 1 Completed',
    2: 'Pending | FIR Stage | Step 2 Completed',
    3: 'Pending | FIR Stage | Step 3 Completed',
    4: 'Pending | FIR Stage | Step 4 Completed',
    5: 'FIR Stage pending',
    6: 'Chargesheet Stage pending',
    7: 'Trial Stage pending',
    // 8: 'Altered case',
    // 9: 'Mistake of Fact',
    11: 'FIR Stage Completed',
    12: 'Chargesheet Stage completed',
    13: 'Trial Completed',
  } as { [key: number]: string };

  if (status === 5 && reliefStatus === 0) {
    return 'FIR relief Stage pending';
  }
  if (status === 5 && reliefStatus === 1) {
    return 'FIR relief Stage completed';
  }
  if (status === 6 && reliefStatus === 1) {
    return 'Chargesheet Stage pending';
  }
  if (status === 6 && reliefStatus === 2) {
    return 'Chargesheet Stage completed';
  }
  if (status === 7 && reliefStatus === 3) {
    return 'Appeal';
  }
  if ((status === 5 || status === 6) && reliefStatus === 0) {
    return 'FIR Stage pending | Chargesheet Stage Pending';
  }
  if (status === 7 && (reliefStatus === 1 || reliefStatus === 2)) {
    return 'Trial Stage pending';
  }
  if ((status === 6 || status === 7) && reliefStatus === 1) {
    return 'Chargesheet Stage Pending | Trial Stage Pending';
  }

  if (( status === 5 || status === 6 || status === 7) && reliefStatus === 0) {
    return 'FIR Stage pending | Charge sheet Stage Pending | Trial stage pending';
  }

  if (( status === 5 || status === 6 || status === 7) && reliefStatus === 3) {
    return 'Completed';
  }

  if (status === 6 && (natureOfJudgement === 'Acquitted' || natureOfJudgement === 'Convicted')) {
    return 'Acquitted';
  }

  if (status === 7 && natureOfJudgement === 'Convicted') {
    return 'Convicted';
  }

  return statusTextMap[status] || 'Unknown';
}


  navigateToRelief(firId: string): void {
    this.router.navigate(['widgets-examples/relief'], {
      queryParams: { fir_id: firId },

    });
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
    { label: 'FIR No.', field: 'fir_id', sortable: true, visible: true },
    { label: 'Police City', field: 'police_city', sortable: true, visible: true },
    { label: 'Police Station Name', field: 'police_station', sortable: true, visible: true },
    { label: 'Created By', field: 'created_by', sortable: true, visible: true },
    { label: 'Created At', field: 'created_at', sortable: true, visible: true },
    { label: 'Status', field: 'status', sortable: false, visible: true },
  ];

  selectedColumns: any[] = [...this.displayedFirList];

  // Sorting variables
  currentSortField: string = '';
  isAscending: boolean = true;




  updateSelectedColumns() {
    this.selectedColumns = this.displayedFirList.filter((col) => col.visible);
  }
  // Toggle column visibility
  toggleColumnVisibility(column: any) {
    column.visible = !column.visible; // Toggle visibility
    this.updateSelectedColumns(); // Update selected columns
  }

  // Drag and drop for rearranging columns
  dropColumn(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.displayedFirList, event.previousIndex, event.currentIndex);
    this.updateSelectedColumns(); // Update selected columns after rearranging
  }

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

  hasNextPage(): boolean {
    return this.page * this.itemsPerPage < this.filteredFirList().length;
  }



}
