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
  selector: 'app-Monetary-relief',
  standalone: true,
  imports: [
    CommonModule,  
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    DragDropModule,
  ],
  providers: [FirListTestService], // Provide the service here
  templateUrl: './Monetary-relief.component.html',
  styleUrls: ['./Monetary-relief.component.scss'],
})
export class MonetaryReliefComponent  implements OnInit {
  searchText: string = '';
  firList: any[] = [];
  page: number = 1;
  itemsPerPage: number = 10;
  isReliefLoading: boolean = true;

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

  // Visible Columns Management
    displayedColumns: { label: string; field: string; sortable: boolean; visible: boolean }[] = [
      { label: 'Sl. No.', field: 'sl_no', sortable: false, visible: true },
      { label: 'FIR No.', field: 'fir_id', sortable: true, visible: true },
      { label: 'Police City/District', field: 'police_city', sortable: true, visible: true },
      { label: 'Police Station Name', field: 'police_station', sortable: true, visible: true },
      { label: 'Created By', field: 'created_by', sortable: true, visible: true },
      { label: 'Created At', field: 'created_at', sortable: true, visible: true },
      { label: 'Status', field: 'status', sortable: false, visible: true },
      { label: 'Nature of Offence', field: 'nature_of_offence', sortable: true, visible: true },
      { label: 'Case Status', field: 'case_status', sortable: true, visible: true },
      { label: 'Relief Status', field: 'relief_status', sortable: true, visible: true },
      { label: 'Victim Name', field: 'victim_name', sortable: true, visible: true },
      { label: 'Reason for Status (Previous Month)', field: 'reason_previous_month', sortable: false, visible: true },
      { label: 'Reason for Status (Current Month)', field: 'reason_current_month', sortable: false, visible: true },
    ];

    caseStatusOptions: string[] = ['FIR Stage', 'Chargesheet Stage', 'Trial Stage'];
    reliefStatusOptions: string[] = ['FIR Stage Relief Pending', 'Chargesheet Relief Pending', 'Trial Stage Relief Pending'];
    selectedCaseStatus: string = '';
    selectedReliefStatus: string = '';

    selectedColumns: any[] = [...this.displayedColumns];
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
    onCaseStatusChange(fir: any): void {
      if (fir.case_status === 'FIR Stage') {
        fir.revenue_district = 'N/A';
        fir.police_station_name = 'N/A';
        fir.case_number = 'N/A';
      }
    }
    

    updateSelectedColumns() {
      this.selectedColumns = this.displayedColumns.filter((col) => col.visible);
    }
    onColumnSelectionChange(): void {
      this.updateSelectedColumns(); 
    }
    

    // Toggle column visibility
    toggleColumnVisibility(column: any) {
      column.visible = !column.visible; // Toggle visibility
      this.updateSelectedColumns(); // Update selected columns
    }

    // Drag and drop for rearranging columns
    dropColumn(event: CdkDragDrop<any[]>) {
      // Perform the column reordering when an item is dropped
      moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
      this.updateSelectedColumns();  // Make sure to update the selected columns
    }

    // Load FIR list from the backend (dummy data for now)
    loadFirList() {
      this.firList = [
        {
          fir_id: 1,
          police_city: 'Chennai',
          police_station: 'Station A',
          nature_of_offence: 'Theft',
          case_status: 'FIR Stage',
          relief_status: 'FIR Stage Relief Pending',
          victim_name: 'John Doe',
          reason_previous_month: 'Pending',
          reason_current_month: 'In Progress',
        },
        {
          fir_id: 2,
          police_city: 'Coimbatore',
          police_station: 'Station B',
          nature_of_offence: 'Assault',
          case_status: 'Chargesheet Stage',
          relief_status: 'Chargesheet Relief Pending',
          victim_name: 'Jane Doe',
          reason_previous_month: 'Completed',
          reason_current_month: 'Resolved',
        },
      ];
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
