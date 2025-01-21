import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PoliceStationsService } from 'src/app/services/police-stations.service';


@Component({
  selector: 'app-police-stations',
  templateUrl: './police-stations.component.html',
  styleUrl: './police-stations.component.scss'
})
export class PoliceStationsComponent implements OnInit{
  @ViewChild('formModal') formModal: any;
  modalRef: NgbModalRef | undefined;
  searchText: string = '';
  districtModel: any = { city_or_district: '', station_name: '', circle: '', status: 1 };
  districts: string[] = [];
  policeStations: any[] = [];
  page: number = 1;
  editIndex: number | null = null;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private policeStationsService: PoliceStationsService // Corrected Service Reference
  ) {}

  ngOnInit(): void {
    this.loadPoliceStations();
    this.loadDistricts();
  }

  loadPoliceStations(): void {
    this.policeStationsService.getAllPoliceStations().subscribe(
      (data: any) => {
        
        this.policeStations = data;
        this.refreshTable();
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load police stations. Please try again later.', 'error');
      }
    );
  }

  loadDistricts(): void {
    this.policeStationsService.getAllStations().subscribe(
      (data: any) => {
        this.districts = data.map((district: any) => district.district_name);
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load districts. Please try again later.', 'error');
      }
    );
  }

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
    this.districtModel = { city_or_district: '', station_name: '', circle: '', status: 1 };
    this.editIndex = null;
  }

  submitForm(myForm: any): void {
    if (myForm.valid) {
      if (this.editIndex !== null) {
        const id = this.policeStations[this.editIndex].id;
        this.policeStationsService.updatePoliceStation(id, this.districtModel).subscribe(
          () => {
            Swal.fire('Updated!', 'Police station updated successfully!', 'success');
            this.loadPoliceStations();
            this.closeModal();
          },
          (error: any) => {
            if (error.status === 400 && error.error.error === 'This district station already exists with the same range and zone.') {
              Swal.fire('Error', 'This district station already exists with the same range and zone. Please enter different details.', 'error');
            } else {
              Swal.fire('Error', 'Failed to update the police station. Please try again later.', 'error');
            }
          }
        );
      } else {
        // Add new police station
        this.policeStationsService.addPoliceStation(this.districtModel).subscribe(
          () => {
            Swal.fire('Added!', 'Police station added successfully!', 'success');
            this.loadPoliceStations();
            this.closeModal();
          },
          (error: any) => {
            if (error.status === 400 && error.error.error === 'This district station already exists with the same range and zone.') {
              Swal.fire('Error', 'This district station already exists with the same range and zone. Please enter different details.', 'error');
            } else {
              Swal.fire('Error', 'Failed to add police station. Please try again later.', 'error');
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
      text: "Do you really want to delete this police Station? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeStation(index);
      }
    });
  }

  removeStation(index: number): void {
    const id = this.policeStations[index].id;
    console.log(id);
    this.policeStationsService.deletePoliceStation(id).subscribe(
      () => {
        this.policeStations.splice(index, 1);
        Swal.fire('Deleted!', 'Police station deleted successfully!', 'success');
        this.refreshTable();
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to delete police station. Please try again later.', 'error');
      }
    );
  }

  toggleStatus(station: any): void {
    const newStatus = station.status === 1 ? 0 : 1;
    Swal.fire({
      title: `Are you sure you want to set this police station to ${newStatus === 1 ? 'Active' : 'Inactive'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedStation = {
          ...station,
          status: newStatus,
        };
        this.policeStationsService.updatePoliceStation(station.id, updatedStation).subscribe(
          () => {
            station.status = newStatus;
            Swal.fire('Updated!', `Police station status changed to ${newStatus === 1 ? 'Active' : 'Inactive'}!`, 'success');
            this.refreshTable();
          },
          (error: any) => {
            Swal.fire('Error', 'Failed to update status. Please try again later.', 'error');
          }
        );
      }
    });
  }

  editStation(station: any, index: number): void {
    this.districtModel = { ...station };
    this.editIndex = index;
    this.openModal();
  }

  filteredDistricts(): any[] {
    return this.policeStations.filter(station =>
      station.city_or_district.toLowerCase().includes(this.searchText.toLowerCase()) ||
      station.station_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      station.circle.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  refreshTable(): void {
    this.policeStations = [...this.policeStations];
    this.cdr.detectChanges();
  }
}
