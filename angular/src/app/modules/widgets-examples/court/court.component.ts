import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CourtService } from 'src/app/services/court.service';

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrl: './court.component.scss'
})
export class CourtComponent implements OnInit{
  @ViewChild('formModal') formModal: any;
  modalRef: NgbModalRef | undefined;
  searchText: string = '';
  courtModel: any = { court_division_name: '', court_range_name: '', status: 1 };
  // districts: string[] = []; 
  court: any[] = [];
  page: number = 1;
  editIndex: number | null = null;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private courtService: CourtService
  ) {}

  ngOnInit(): void {
    this.loadCourt();
    // this.loadDistricts();
  }

  loadCourt(): void {
    this.courtService.getAllCourt().subscribe(
      (data: any) => {
        this.court = data;
        this.refreshTable();
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load court. Please try again later.', 'error');
      }
    );
  }

  // loadDistricts(): void {
  //   this.courtService.getAllDistricts().subscribe(
  //     (data: any) => {
  //       this.districts = data.map((district: any) => district.district_name);
  //     },
  //     (error: any) => {
  //       Swal.fire('Error', 'Failed to load districts. Please try again later.', 'error');
  //     }
  //   );
  // }

  openModal(): void {
    this.modalRef = this.modalService.open(this.formModal, { centered: true });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.resetForm();
  }

  resetForm(): void {
    this.courtModel = { court_division_name: '', court_range_name: '', status: 1 };
    this.editIndex = null;
  }

  submitForm(myForm: any): void {
    if (myForm.valid) {
      if (this.editIndex !== null) {
        const id = this.court[this.editIndex].id;
        this.courtService.updateCourt(id, this.courtModel).subscribe(
          () => {
            Swal.fire('Updated!', 'Court updated successfully!', 'success');
            this.loadCourt();
            this.closeModal();
          },
          (error: any) => {
            if (error.status === 400 && error.error.error === 'This Court already exists with the same range and zone.') {
              Swal.fire('Error', 'This Court already exists with the same range and zone. Please enter different details.', 'error');
            } else {
              Swal.fire('Error', 'Failed to update the Court. Please try again later.', 'error');
            }
          }
        );
      } else {
        // Add new Court
        this.courtService.addCourt(this.courtModel).subscribe(
          () => {
            Swal.fire('Added!', 'Court added successfully!', 'success');
            this.loadCourt();
            this.closeModal();
          },
          (error: any) => {
            if (error.status === 400 && error.error.error === 'This Court already exists with the same range and zone.') {
              Swal.fire('Error', 'This Court already exists with the same range and zone. Please enter different details.', 'error');
            } else {
              Swal.fire('Error', 'Failed to add Court. Please try again later.', 'error');
            }
          }
        );
      }
      this.resetForm();
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(myForm.controls).forEach((field) => {
        const control = myForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
    }
  }

  confirmDelete(index: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this court? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeCourt(index);
      }
    });
  }

  removeCourt(index: number): void {
    const id = this.court[index].id;
    this.courtService.deleteCourt(id).subscribe(
      () => {
        this.court.splice(index, 1);
        Swal.fire('Deleted!', 'Court deleted successfully!', 'success');
        this.refreshTable();
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to delete Court. Please try again later.', 'error');
      }
    );
  }

  toggleStatus(court: any): void {
    const newStatus = court.status === 1 ? 0 : 1;
    Swal.fire({
      title: `Are you sure you want to set this police court to ${newStatus === 1 ? 'Active' : 'Inactive'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCourt = {
          ...court,
          status: newStatus,
        };
        this.courtService.updateCourt(court.id, updatedCourt).subscribe(
          () => {
            court.status = newStatus;
            Swal.fire('Updated!', `Police court status changed to ${newStatus === 1 ? 'Active' : 'Inactive'}!`, 'success');
            this.refreshTable();
          },
          (error: any) => {
            Swal.fire('Error', 'Failed to update status. Please try again later.', 'error');
          }
        );
      }
    });
  }

  editCourt(court: any, index: number): void {
    this.courtModel = { ...court };
    this.editIndex = index;
    this.openModal();
  }

  filteredDistricts(): any[] {
    return this.court.filter(courtvalue =>
      courtvalue.court_division_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      courtvalue.court_range_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  refreshTable(): void {
    this.court = [...this.court];
    this.cdr.detectChanges();
  }
}
