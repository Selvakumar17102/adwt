import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdditionalReliefService } from 'src/app/services/additional-relief.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-additional-relief-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './additional-relief-list.component.html',
  styleUrls: ['./additional-relief-list.component.scss']
})
export class AdditionalReliefListComponent implements OnInit {
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
  }

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
}
