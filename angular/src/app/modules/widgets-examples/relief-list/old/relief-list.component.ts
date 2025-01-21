import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReliefService } from 'src/app/services/relief.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-relief-list',
  templateUrl: './relief-list.component.html',
  styleUrls: ['./relief-list.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ReliefListComponent implements OnInit {
  firList: any[] = []; // Complete FIR list
  displayedFirList: any[] = []; // FIRs to show on current page
  page = 1; // Current page
  itemsPerPage = 10; // Items per page
  totalPages = 1; // Total number of pages
  isLoading = true; // Loading indicator

  constructor(
    private reliefService: ReliefService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchFIRList();
  }

  // Fetch FIR data from the service
  fetchFIRList(): void {
    this.isLoading = true;
    this.reliefService.getFIRReliefList().subscribe(
      (data) => {
        this.firList = (data || []).filter((fir) => [5, 6, 7].includes(fir.status)); // Filter data
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
    } as { [key: number]: string };

    return badgeClassMap[status] || 'badge bg-secondary text-white';
  }

  getStatusText(status: number): string {
    const statusTextMap = {
      0: 'Just Starting',
      1: 'Pending | FIR Stage | Step 1 Completed',
      2: 'Pending | FIR Stage | Step 2 Completed',
      3: 'Pending | FIR Stage | Step 3 Completed',
      4: 'Pending | FIR Stage | Step 4 Completed',
      5: 'FIR Stage pending',
      6: 'Chargesheet Stage pending',
      7: 'Trial Stage pending',
    } as { [key: number]: string };

    return statusTextMap[status] || 'Unknown';
  }

  navigateToRelief(firId: string): void {
    this.router.navigate(['widgets-examples/relief'], {
      queryParams: { fir_id: firId },

    });
  }
}
