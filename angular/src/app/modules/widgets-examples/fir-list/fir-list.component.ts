
import Swal from 'sweetalert2';
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import { FirService } from 'src/app/services/fir.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-fir-list',
  templateUrl: './fir-list.component.html',
})
export class FirListComponent implements OnInit {

  steps = ['Location Details', 'Offence Information', 'Victim Information', 'Accused Info', 'MRF Info','ChargeSheet Stage','Trail Stage'];
  searchText: string = '';
  firList: any[] = [];
  page: number = 1;
  itemsPerPage: number = 10;
  isLoading: boolean = true;
  filteredList: any[] = [];

  currentStep = 0;
  get progressPercentage(): number {
    return ((this.currentStep + 1) / this.steps.length) * 100;
  }

  @ViewChild('firDetailsModal') firDetailsModal!: TemplateRef<any>;

  // Filters
  selectedDistrict: string = '';
  selectedNatureOfOffence: string = '';
  selectedStatusOfCase: string = '';
  selectedStatusOfRelief: string = '';

  // Filter options
  districts: string[] = [];
  naturesOfOffence: string[] = [];

  // statusesOfCase: string[] = ['UI Stage', 'PT Stage', 'Trial Stage'];
  // statusesOfRelief: string[] = ['FIR Stage', 'ChargeSheet Stage', 'Trial Stage'];

  // Visible Columns Management

  displayedColumns: { label: string; field: string; sortable: boolean; visible: boolean }[] = [
    { label: 'Sl.No', field: 'sl_no', sortable: false, visible: true },
    { label: 'FIR No.', field: 'fir_id', sortable: true, visible: true },
    { label: 'Police City', field: 'police_city', sortable: true, visible: true },
    { label: 'Police Station Name', field: 'police_station', sortable: true, visible: true },

    { label: 'Police Zone', field: 'police_zone', sortable: true, visible: false },
    { label: 'Police Range', field: 'police_range', sortable: true, visible: false },
    { label: 'Revenue District', field: 'revenue_district', sortable: true, visible: false },

    { label: 'Name of IO', field: 'name_of_io', sortable: true, visible: false },
    { label: 'Designation of IO', field: 'designation_of_io', sortable: true, visible: false },
    { label: 'Phone Number of IO', field: 'phone_no_of_io', sortable: true, visible: false },

    { label: 'FIR Number', field: 'fir_no', sortable: true, visible: false },
    { label: 'Date of Occurrence', field: 'date_of_occ', sortable: true, visible: false },
    { label: 'Time of Occurrence', field: 'time_of_occ', sortable: true, visible: false },
    { label: 'Place of Occurrence', field: 'place_of_occ', sortable: true, visible: false },
    { label: 'Date of Case Reg', field: 'date_of_case_reg', sortable: true, visible: false },
    { label: 'Time of Case Reg', field: 'time_of_case_reg', sortable: true, visible: false },

    { label: 'Name of Complainant', field: 'name_comp', sortable: true, visible: false },
    { label: 'Mobile Number of Complainant', field: 'mobile_comp', sortable: true, visible: false },
    { label: 'Victim Same as Complainant', field: 'victim_same_as_comp', sortable: true, visible: false },
    { label: 'Number of Victims', field: 'num_of_victims', sortable: true, visible: false },
    { label: 'Is Deceased', field: 'is_deceased', sortable: true, visible: false },
    { label: 'Deceased Person Name', field: 'deceased_person', sortable: true, visible: false },

    { label: 'Number of Accused', field: 'num_of_accussed', sortable: true, visible: false },

    { label: 'Total Amount for 1st Stage', field: 'total_amt_1st', sortable: true, visible: false },
    { label: 'Proceedings File No', field: 'proceeding_file_no', sortable: true, visible: false },
    { label: 'Proceedings Date', field: 'proceeding_file_date', sortable: true, visible: false },

    { label: 'Charge Sheet Court', field: 'charge_sheet_court', sortable: true, visible: false },
    { label: 'Court Division', field: 'court_division', sortable: true, visible: false },
    { label: 'Court Range', field: 'court_range', sortable: true, visible: false },
    { label: 'Case Type', field: 'case_type', sortable: true, visible: false },
    { label: 'Charge Sheet (CNR) / Special SC Number', field: 'cs_special_sc_no', sortable: true, visible: false },
    { label: '(RCS) file number', field: 'rcs_file_no', sortable: true, visible: false },
    { label: '(RCS) filing date', field: 'rcs_file_date', sortable: true, visible: false },

    { label: 'Total Amount for 2st Stage', field: 'total_amt_2nd', sortable: true, visible: false },
    { label: 'CS Proceedings File No', field: 'cs_proceeding_file_no', sortable: true, visible: false },
    { label: 'CS Proceedings Date', field: 'cs_proceeding_file_date', sortable: true, visible: false },

    { label: 'Name of the Designated / Special court', field: 'special_court', sortable: true, visible: false },
    { label: 'District court present', field: 'court_present', sortable: true, visible: false },
    { label: 'Trial Stage (CNR) / Special SC number', field: 'ts_special_sc_no', sortable: true, visible: false },
    { label: 'Public Prosecutor`s Name', field: 'public_prosecutor_name', sortable: true, visible: false },
    { label: 'Public Prosecutor`s Phone No', field: 'public_prosecutor_phno', sortable: true, visible: false },

    { label: 'Total amount for 3rd Stage', field: 'total_amt_3rd', sortable: true, visible: false },
    { label: 'TS Proceedings File No', field: 'ts_proceeding_file_no', sortable: true, visible: false },
    { label: 'TS Proceedings Date', field: 'ts_proceeding_file_date', sortable: true, visible: false },


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
    private router: Router,
    private FirService_1:FirService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.loadFirList();
    this.loadFilterOptions();
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


  loadFilterOptions() {
    // Fetch districts
    this.FirService_1.getDistricts().subscribe(
      (data: string[]) => {
        this.districts = data; // Populate districts filter
      },
      (error) => {
        Swal.fire('Error', 'Failed to load districts', 'error');
      }
    );

    // Fetch offences
    this.FirService_1.getOffences().subscribe(
      (data: any[]) => {
        this.naturesOfOffence = data.map((offence: any) => offence.offence_name); // Map to offence_name
      },
      (error) => {
        Swal.fire('Error', 'Failed to load offences', 'error');
      }
    );
  }


  loadFirList() {
    this.isLoading = true;
    this.firService.getFirList().subscribe(
      (data: any[]) => {
        //console.log('FIR Data from Backend:', data); // Debugging
        this.firList = data;
        this.filteredList = [...this.firList];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load FIR data', 'error');
      }
    );
  }
  openModal(): void {
    this.currentStep = 0; // Reset to the first step
    this.modalService.open(this.firDetailsModal, { size: 'xl', backdrop: 'static' });
  }



  navigateToStep(stepIndex: number): void {
    this.currentStep = stepIndex;
  }

  nextStep(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }


  applyFilters() {
    //console.log('Applying filters...');

    // Log selected filter values
    //console.log('Selected District:', this.selectedDistrict);
    //console.log('Selected Status of Case:', this.selectedStatusOfCase);
    //console.log('Selected Status of Relief:', this.selectedStatusOfRelief);

    // Reset pagination
    this.page = 1;

    // Apply filters
    this.filteredList = this.firList.filter((fir) => {
      const matchesDistrict = this.selectedDistrict
        ? fir.revenue_district === this.selectedDistrict
        : true;

      const matchesStatusOfCase = this.selectedStatusOfCase
        ? fir.status === +this.selectedStatusOfCase
        : true;

      const matchesStatusOfRelief = this.selectedStatusOfRelief
        ? fir.status === +this.selectedStatusOfRelief
        : true;

      // Log each FIR and its match status
      //console.log('FIR:', fir);
      //console.log('Matches District:', matchesDistrict);
      //console.log('Matches Status of Case:', matchesStatusOfCase);
      //console.log('Matches Status of Relief:', matchesStatusOfRelief);

      return matchesDistrict && matchesStatusOfCase && matchesStatusOfRelief;
    });

    // Log filtered results
    //console.log('Filtered List:', this.filteredList);

    this.cdr.detectChanges();
  }



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

// Get status text for the status
getStatusWithNature(status: number, natureOfJudgement?: string): string {
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
    11: 'FIR Stage Refile Completed',
    12: 'Chargesheet Stage Relief Completed',
    13: 'Trial Relief Completed',
  } as { [key: number]: string };

  // Specific logic for status 6 and 7
  if (status === 6 && (natureOfJudgement === 'Acquitted' || natureOfJudgement === 'Convicted')) {
    return `${statusTextMap[status]} | ${natureOfJudgement}`;
  }

  if (status === 7 && natureOfJudgement === 'Convicted') {
    return `${statusTextMap[status]} | ${natureOfJudgement}`;
  }

  // Default case
  return statusTextMap[status] || 'Unknown';
}



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
    11: 'badge bg-primary text-white', // FIR Stage Refile Completed
    12: 'badge bg-primary text-white', // Chargesheet Stage Relief Completed
    13: 'badge bg-primary text-white', // Trial Relief Completed
  } as { [key: number]: string };

  return badgeClassMap[status] || 'badge bg-secondary text-white';
}



  // Paginated FIR list
  paginatedFirList() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.filteredList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  dropRow(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.filteredList, event.previousIndex, event.currentIndex);
  }

  // Pagination controls
  totalPagesArray(): number[] {
    return Array(Math.ceil(this.filteredList.length / this.itemsPerPage))
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
    return this.page * this.itemsPerPage < this.filteredList.length;
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
