import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Vmcservice } from 'src/app/services/Vmc.Service';
import { Router, NavigationEnd } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-vmc',
  templateUrl: './vmc.component.html',
  styleUrls: ['./vmc.component.scss'],
})
export class VmcComponent implements OnInit {
  @ViewChild('memberModalAdd', { static: true }) memberModalAdd: any;
  modalRef: NgbModalRef | undefined;
  editIndex: number | null = null;

  // Properties
  members: any[] = [];
  filteredMembers: any[] = [];
  member: any = {
    salutation: '',
    member_type: '',
    name: '',
    level_of_member: '',
    designation: '',
    other_designation: '',
    meetingDate: '',
    validityEndDate: '',
    status: '1',
    district: '',
    subdivision: '',
  };

  districts: any[] = [];
  subdivisions: any[] = [];
  filteredSubdivisions: any[] = [];
  searchText: string = '';
  page: number = 1;
  currentUser: any = {};

  // Dropdown enable/disable states
  isDistrictDisabled: boolean = false;
  isSubdivisionDisabled: boolean = false;

  constructor(
    private modalService: NgbModal,
    private vmcService: Vmcservice,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Reload members when navigating back to this component
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadMembers();
      });
  }

  ngOnInit(): void {
    this.loadUserFromSession();
    this.loadMembers();
    this.resetForm();
    this.loadDistricts();
  }

  // Load logged-in user from session
  loadUserFromSession() {
    const userDataString = sessionStorage.getItem('user_data');
    if (userDataString) {
      this.currentUser = JSON.parse(userDataString);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  // Load all members
  loadMembers() {
    this.vmcService.getAllMembers().subscribe(
      (results: any[]) => {
        this.members = results;
        this.filteredMembers = this.members;
        this.cdr.detectChanges();
      },
      () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load members. Please try again later.',
          confirmButtonColor: '#d33',
        });
      }
    );
  }

  // Filter members based on search text
  filterMembers() {
    this.filteredMembers = this.members.filter((member) =>
      (member.name ? member.name.toLowerCase() : '').includes(
        this.searchText.toLowerCase()
      )
    );
  }

  // Open Add/Edit Modal
  openModal(member?: any): void {
    if (member) {
      this.member = { ...member }; // Pre-fill form for editing
      this.editIndex = this.members.findIndex((m) => m.id === member.id);
      this.onLevelChange(this.member.level_of_member); // Set dropdown states based on level
    } else {
      this.resetForm(); // Reset form for new entry
    }
    this.modalRef = this.modalService.open(this.memberModalAdd, { centered: true });
  }

  onLevelChange(level: string): void {
    // Update dropdown states based on the selected level
    this.isDistrictDisabled = level === 'State Level';
    this.isSubdivisionDisabled = level !== 'Subdivision';

    if (level === 'Subdivision') {
      // Populate subdivisions if district is selected
      if (this.member.district) {
        this.populateSubdivisions(this.member.district);
      } else {
        this.subdivisions = []; // Clear subdivisions if no district is selected
        this.member.subdivision = '';
      }
    }
  }

  populateSubdivisions(selectedDistrict: string): void {
    this.vmcService.getSubdivisionsByDistrict(selectedDistrict).subscribe(
      (results: any[]) => {
        this.subdivisions = results.map((item) => item.sub_division); // Map to get only subdivision names
        this.member.subdivision = ''; // Reset subdivision field
        console.log('Subdivisions loaded for district:', selectedDistrict, this.subdivisions);
      },
      (error) => {
        console.error('Error fetching subdivisions:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load subdivisions. Please try again later.',
        });
      }
    );
  }



  onSubmit(myForm: NgForm) {
    if (myForm.valid) {
      const formattedMeetingDate = this.formatDateForBackend(this.member.meetingDate);
      const formattedValidityDate = this.formatDateForBackend(this.member.validityEndDate);

      if (!formattedMeetingDate || !formattedValidityDate) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please enter valid dates.',
          confirmButtonColor: '#d33',
        });
        return;
      }

      if (this.isInvalidBasedOnLevel()) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please fill out all required fields based on the selected level.',
          confirmButtonColor: '#d33',
        });
        return;
      }

      this.member.meeting_date = formattedMeetingDate;
      this.member.validity_end_date = formattedValidityDate;

      if (this.editIndex !== null) {
        this.updateMember();
      } else {
        this.addMember();
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill out all required fields.',
        confirmButtonColor: '#d33',
      });
    }
  }

  isInvalidBasedOnLevel(): boolean {
    if (this.member.level_of_member === 'District Level' && !this.member.district) {
      return true;
    }
    if (this.member.level_of_member === 'Subdivision' && (!this.member.district || !this.member.subdivision)) {
      return true;
    }
    return false;
  }


  addMember() {
    this.vmcService.addMember(this.member).subscribe(
      () => {
        this.showSuccessAlert('Member added successfully!');
        this.loadMembers();
        this.closeModal();
      },
      () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add the member. Please try again later.',
          confirmButtonColor: '#d33',
        });
      }
    );
  }

  updateMember() {
    console.log("Updating member:", this.member);

    if (!this.member.vmc_id) { // Ensure `vmc_id` is being passed
      console.error("Member ID is missing!");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Member ID is missing. Update cannot be performed.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    const formattedMeetingDate = this.formatDateForBackend(this.member.meetingDate);
    const formattedValidityDate = this.formatDateForBackend(this.member.validityEndDate);

    this.member.meeting_date = formattedMeetingDate;
    this.member.validity_end_date = formattedValidityDate;

    this.vmcService.updateMember(this.member.vmc_id, this.member).subscribe(
      (response: any) => {
        console.log("Update response:", response);
        this.showSuccessAlert('Member updated successfully!');
        this.loadMembers();
        this.closeModal();
      },
      (error: any) => {
        console.error("Error updating member:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update the member. Please try again later.',
          confirmButtonColor: '#d33',
        });
      }
    );
  }





  loadDistricts() {
    this.vmcService.getAllDistricts().subscribe(
      (results: any[]) => {
        this.districts = results;
      },
      () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load districts. Please try again later.',
        });
      }
    );
  }

  onDistrictChange(event: Event): void {
    const selectedDistrict = (event.target as HTMLSelectElement).value;

    if (selectedDistrict) {
      this.member.district = selectedDistrict;
      if (this.member.level_of_member === 'Subdivision') {
        this.populateSubdivisions(selectedDistrict);
      } else {
        this.subdivisions = []; // Clear subdivisions if not in "Subdivision Level"
        this.member.subdivision = '';
      }
    } else {
      this.subdivisions = []; // Clear subdivisions if no district is selected
      this.member.subdivision = '';
    }
  }



  // Delete member
  deleteMember(memberId: string): void {
    console.log("Deleting member with ID:", memberId); // Debugging log
    if (!memberId) {
      console.error("Member ID is missing!");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Member ID is missing. Deletion cannot proceed.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this member!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.vmcService.deleteMember(memberId).subscribe(
          () => {
            this.showSuccessAlert('Member deleted successfully!');
            this.loadMembers();
          },
          (error: any) => {
            console.error("Error deleting member:", error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete the member. Please try again later.',
              confirmButtonColor: '#d33',
            });
          }
        );
      }
    });
  }




// Toggle member status
toggleStatus(member: any): void {
  const newStatus = member.status === '1' ? '0' : '1';
  this.vmcService.toggleMemberStatus(member.id, newStatus).subscribe(
    () => {
      this.showSuccessAlert(
        `Member status changed to ${newStatus === '1' ? 'Active' : 'Inactive'}`
      );
      this.loadMembers();
    },
    () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update member status. Please try again later.',
        confirmButtonColor: '#d33',
      });
    }
  );
}


  formatDateForBackend(date: string | Date): string | null {
    if (!date) {
      return null;
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toISOString().split('T')[0];
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.resetForm();
  }

  resetForm() {
    this.member = {
      salutation: '',
      member_type: '',
      name: '',
      designation: '',
      other_designation: '',
      meetingDate: '',
      validityEndDate: '',
      level_of_member: '',
      status: '1',
      district: '',
      subdivision: '',
    };
    this.isDistrictDisabled = false;
    this.isSubdivisionDisabled = false;
    this.editIndex = null;
  }

  showSuccessAlert(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6',
    });
  }
}
