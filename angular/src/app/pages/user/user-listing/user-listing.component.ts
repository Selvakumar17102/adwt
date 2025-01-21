import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss']
})
export class UserListingComponent implements OnInit {
  @ViewChild('userModal', { static: true }) userModal: any;

  modalRef: NgbModalRef | undefined;
  editIndex: number | null = null;

  // Properties
  users: any[] = [];
  roles: any[] = [];
  filteredUsers: any[] = []; // Added filteredUsers property
  user: any = {
    role: '',
    user_role_name: '',
    district: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    updatedBy: '',
    status: '1'
  };
  searchText: string = ''; // Added searchText property for search input
  page: number = 1; // Added page property for pagination
  emailError: string = ''; // Added emailError property for email validation
  currentUser: any = {};

  user_role_name: string[] = [
    'Secretary', 'ADW&TW Dept.', 'IG (SJ&HR)', 'Director, ADW Dept.',
    'Director, TW Dept.', 'The users of the office of IG (SJ&HR) Tamil Nadu Police',
    'For DSPs of the SJ&HR Wing', 'For DADTWOs of the ADW&TW Dept., in each district'
  ];

  districts = [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
    'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Karur', 'Krishnagiri',
    'Madurai', 'Nagapattinam', 'Kanyakumari', 'Namakkal', 'Perambalur', 'Pudukkottai',
    'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur',
    'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupattur',
    'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram',
    'Virudhunagar', 'Chennai City', 'Avadi City', 'Tambaram City', 'Salem City',
    'Coimbatore City', 'Tiruppur City', 'Trichy City', 'Madurai City', 'Tirunelveli City'
  ];

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && event.urlAfterRedirects.includes('/apps/users'))
    ).subscribe(() => {
      this.loadUsers();
    });
  }

  ngOnInit(): void {
    this.loadUserFromSession();
    const userId = this.user?.id;
    const userRole = this.user?.role;

    if (userId && userRole) {
      this.currentUser.id = userId;
      this.currentUser.role = userRole;
    } else {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadUsers();
    this.loadRoles();
  }

  loadUserFromSession() {
    const userDataString = sessionStorage.getItem('user_data');
    if (userDataString) {
      this.user = JSON.parse(userDataString);
    }
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (results) => {
        this.users = results;
        this.filteredUsers = this.users; // Initialize filteredUsers
        this.cdr.detectChanges();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load users. Please try again later.',
          confirmButtonColor: '#d33'
        });
      }
    );
  }

  loadRoles() {
    this.userService.getAllRoles().subscribe(
      (results: any) => {
        this.roles = results as any[];
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load roles. Please try again later.',
          confirmButtonColor: '#d33'
        });
      }
    );
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      (user.name ? user.name.toLowerCase() : '').includes(this.searchText.toLowerCase()) ||
      (user.email ? user.email.toLowerCase() : '').includes(this.searchText.toLowerCase()) ||
      (user.role ? user.role.toLowerCase() : '').includes(this.searchText.toLowerCase())
    );
  }

  openModal(user?: any) {
    if (user) {
      this.user = { ...user, updatedBy: this.currentUser.id };
      this.editIndex = this.users.findIndex(u => u.id === user.id);
    } else {
      this.user = {
        role: '',
        user_role_name: '',
        district: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        updatedBy: this.currentUser.role,
        status: '1'
      };
      this.editIndex = null;
      this.generatePassword(); // Generate password automatically
    }

    this.modalRef = this.modalService.open(this.userModal, { centered: true });
  }

  generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
    const passwordLength = 8;
    let generatedPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
      generatedPassword += randomChar;
    }

    this.user.password = generatedPassword;
    this.user.confirmPassword = generatedPassword;
  }

  validateEmail() {
    // Regular expression to validate lowercase email with common TLDs
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.(com|net|org|edu|gov|in)$/;
    if (!emailPattern.test(this.user.email)) {
      this.emailError = 'Please enter a valid email address with a common domain (e.g., .com, .net, .org).';
    } else {
      this.emailError = '';
    }
  }
  
  

  onSubmit(myForm: NgForm) {
    if (myForm.valid) {
      if (this.editIndex !== null) {
        this.user.updated_at = new Date();
        this.user.updatedBy = this.currentUser.role;
        this.userService.updateUser(this.user.id, this.user).subscribe(
          () => {
            this.showSuccessAlert('User updated successfully!');
            this.loadUsers();
            this.closeModal();
          },
          (error) => {
            this.handleErrorResponse(error);
          }
        );
      } else {
        if (this.user.password !== this.user.confirmPassword) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Passwords do not match.',
            confirmButtonColor: '#d33'
          });
          return;
        }

        const newUser = {
          ...this.user,
          user_role_name: this.user.user_role_name,
          createdBy: this.currentUser.role
        };

        this.userService.createUser(newUser).subscribe(
          () => {
            this.showSuccessAlert('User added successfully!');
            this.loadUsers();
            this.closeModal();
          },
          (error) => {
            this.handleErrorResponse(error);
          }
        );
      }
    }
  }

  editUser(user: any) {
    this.openModal(user);
  }

  deleteUser(userId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe(
          () => {
            this.showSuccessAlert('User deleted successfully!');
            this.loadUsers();
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete user. Please try again later.',
              confirmButtonColor: '#d33'
            });
          }
        );
      }
    });
  }

  toggleStatus(user: any) {
    const newStatus = user.status === '1' ? '0' : '1';

    this.userService.toggleUserStatus(user.id, { status: newStatus, updatedBy: this.currentUser.id }).subscribe(
      () => {
        this.showSuccessAlert(`User status changed to ${newStatus === '1' ? 'Active' : 'Inactive'}`);
        this.loadUsers();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update user status. Please try again later.',
          confirmButtonColor: '#d33'
        });
      }
    );
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.resetForm();
  }

  resetForm() {
    this.user = {
      role: '',
      user_role_name: '',
      district: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      updatedBy: '',
      status: '1'
    };
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

  handleErrorResponse(error: any) {
    if (error.error && error.error.error === 'Email already registered') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'This email is already registered. Please use a different email.',
        confirmButtonColor: '#d33'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to process the request. Please try again later.',
        confirmButtonColor: '#d33'
      });
    }
  }
}
