import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FirListTestService } from 'src/app/services/fir-list-test.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fir-list',
  templateUrl: './fir-list.component.html',
})
export class FirListComponent implements OnInit {
  searchText: string = '';
  firList: any[] = [];
  filteredFirList: any[] = [];
  page: number = 1;
  itemsPerPage: number = 10;
  isLoading: boolean = true;
  selectedDistrict: string = '';
  selectedNatureOfOffence: string = '';
  selectedStatusOfCase: string = '';
  selectedStatusOfRelief: string = '';

  constructor(
    private firService: FirListTestService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFirList();
  }

  loadFirList() {
    this.isLoading = true;
    this.firService.getFirList().subscribe(
      (data: any[]) => {
        this.firList = data;
        this.filteredFirList = this.firList;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load FIR data', 'error');
      }
    );
  }

  filterFIRs(): void {
    this.filteredFirList = this.firList.filter(fir =>
      (!this.selectedDistrict || fir.policeCity === this.selectedDistrict) &&
      (!this.selectedNatureOfOffence || fir.natureOfOffence === this.selectedNatureOfOffence) &&
      (!this.selectedStatusOfCase || fir.statusOfCase === this.selectedStatusOfCase) &&
      (!this.selectedStatusOfRelief || fir.statusOfRelief === this.selectedStatusOfRelief)
    );
  }

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
            this.filteredFirList.splice(index, 1);
            Swal.fire('Deleted!', 'The FIR has been deleted.', 'success');
          },
          (error) => {
            Swal.fire('Error', 'Failed to delete FIR', 'error');
          }
        );
      }
    });
  }

  // Action methods
  editFIR(firId: number): void {
    console.log(`Opening edit page for FIR ID: ${firId}`);
    // Implement navigation or editing logic
    this.router.navigate(['/edit-fir', firId]);
  }

  viewFIR(firId: number): void {
    console.log(`Viewing FIR ID: ${firId}`);
    // Implement navigation to view FIR details
    this.router.navigate(['/view-fir', firId]);
  }

  mistakeOfFact(firId: number): void {
    console.log(`Mistake of Fact for FIR ID: ${firId}`);
    this.router.navigate(['/widgets-examples/mistake-of-fact', firId]);
  }

  alteredCase(firId: number): void {
    console.log(`Altered Case for FIR ID: ${firId}`);
    // Implement navigation or altered case logic
    this.router.navigate(['/altered-case', firId]);
  }

  paginatedFirList() {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.filteredFirList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  totalPagesArray(): number[] {
    return Array(Math.ceil(this.filteredFirList.length / this.itemsPerPage))
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
    return this.page * this.itemsPerPage < this.filteredFirList.length;
  }

  // Method to get the status text based on the 'status' value
  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Just Starting';
      case 1:
        return 'Pending | FIR Stage | Step 1 Completed';
      case 2:
        return 'Pending | FIR Stage | Step 2 Completed';
      case 3:
        return 'Pending | FIR Stage | Step 3 Completed';
      case 4:
        return 'Pending | FIR Stage | Step 4 Completed';
      case 5:
        return 'Completed | FIR Stage';
      case 6:
        return 'Charge Sheet Completed';
      case 7:
        return 'Trial Stage Completed';
      default:
        return 'Unknown';
    }
  }

  // Method to get the badge class based on the 'status' value
  getStatusBadgeClass(status: number): string {
    switch (status) {
      case 0:
        return 'badge bg-info text-white';
      case 1:
      case 2:
      case 3:
      case 4:
        return 'badge bg-warning text-dark';
      case 5:
      case 6:
      case 7:
        return 'badge bg-success text-white';
      default:
        return 'badge bg-secondary text-white';
    }
  }
}
