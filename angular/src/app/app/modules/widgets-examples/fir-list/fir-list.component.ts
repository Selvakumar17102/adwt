import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fir-list',
  templateUrl: './fir-list.component.html',
})
export class FirListComponent implements OnInit {
  searchText: string = '';
  firList: any[] = [];
  page: number = 1;
  itemsPerPage: number = 10;
  isLoading: boolean = true;

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
    { label: 'Actions', field: 'actions', sortable: false, visible: true },
  ];


  selectedColumns: any[] = [...this.displayedColumns];

  // Sorting variables
  currentSortField: string = '';
  isAscending: boolean = true;

  constructor(
    private firService: FirListTestService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFirList();
    this.updateSelectedColumns();
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

  // Load FIR list from the backend
  loadFirList() {
    this.isLoading = true;
    this.firService.getFirList().subscribe(
      (data: any[]) => {
        this.firList = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load FIR data', 'error');
      }
    );
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

  // Get status text based on status value
  getStatusText(status: number): string {
    const statusTextMap = {
      0: 'FIR Draft',
      1: 'Pending | FIR Stage | Step 1 Completed',
      2: 'Pending | FIR Stage | Step 2 Completed',
      3: 'Pending | FIR Stage | Step 3 Completed',
      4: 'Pending | FIR Stage | Step 4 Completed',
      5: 'Completed | FIR Stage',
      6: 'Charge Sheet Completed',
      7: 'Trial Stage Completed',
      8: 'This Case is Altered Case',
      9: 'Mistake Of Fact',
    } as { [key: number]: string };

    return statusTextMap[status] || 'Unknown';
  }

  // Get CSS class for status badge
// Get CSS class for status badge
getStatusBadgeClass(status: number): string {
  const badgeClassMap = {
    0: 'badge bg-info text-white',
    1: 'badge bg-warning text-dark',
    2: 'badge bg-warning text-dark',
    3: 'badge bg-warning text-dark',
    4: 'badge bg-warning text-dark',
    5: 'badge bg-success text-white',
    6: 'badge bg-success text-white',
    7: 'badge bg-success text-white',
    8: 'badge bg-danger text-white',
    9: 'badge bg-danger text-white',
    10: 'badge bg-danger text-white', // Add this entry for status 12
  } as { [key: number]: string };

  return badgeClassMap[status] || 'badge bg-secondary text-white';
}


  // Paginated FIR list
  paginatedFirList() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.filteredFirList().slice(startIndex, startIndex + this.itemsPerPage);
  }

  dropRow(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.firList, event.previousIndex, event.currentIndex);
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

  // Delete FIR
  deleteFIR(index: number, firId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.firService.deleteFir(firId).subscribe(
          () => {
            this.firList.splice(index, 1);
            Swal.fire('Deleted!', 'The FIR has been deleted.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'Failed to delete FIR', 'error');
          }
        );
      }
    });
  }

  // Navigate to different pages
  viewFIR(firId: number) {
    this.router.navigate(['/widgets-examples/view-fir'], { queryParams: { fir_id: firId } });
  }

  openEditPage(firId: number) {
    this.router.navigate(['/widgets-examples/edit-fir'], { queryParams: { fir_id: firId } });
  }

  navigateToMistakeOfFact(firId: number) {
    this.router.navigate(['/widgets-examples/mistake-of-fact'], { queryParams: { fir_id: firId } });
  }

  navigateToAlteredCase(firId: number) {
    this.router.navigate(['/widgets-examples/altered-case'], { queryParams: { fir_id: firId } });
  }
}
