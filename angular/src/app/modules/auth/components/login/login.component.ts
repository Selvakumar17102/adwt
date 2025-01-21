import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  defaultAuth: any = null; // Remove or set it to null

  loginForm: FormGroup;
  hasError: boolean = false;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  showPassword: boolean = false; // Toggle visibility for password

  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Custom email validator to ensure the email contains a valid domain with TLD
  CustomEmailValidator(control: AbstractControl): ValidationErrors | null {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const emailValue = control.value;
    if (emailValue && !emailPattern.test(emailValue)) {
      return { invalidEmail: true };
    }
    return null;
  }

  // Get the form controls for easier access in the template
  get f() {
    return this.loginForm.controls;
  }

  // Initialize the login form with validators
  initForm() {
    const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
    const rememberedPassword = localStorage.getItem('rememberedPassword') || '';
    const rememberMe = !!rememberedEmail; // Determine if "Remember Me" was previously checked

    this.loginForm = this.fb.group({
      email: [
        rememberedEmail, // Prefill email if remembered
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320),
          this.CustomEmailValidator, // Custom email validator
        ]),
      ],
      password: [
        rememberedPassword, // Prefill password if remembered
        Validators.compose([
          Validators.required,
          Validators.minLength(3), // Minimum password length
          Validators.maxLength(100), // Maximum password length
        ]),
      ],
      rememberMe: [rememberMe], // Set checkbox state
    });
  }


  // Form submission logic
  submit() {
    this.hasError = false;

    //console.log('Login form submitted'); // Log when form submission starts

    // If the form is invalid, prevent submission
    if (this.loginForm.invalid) {
      //console.error('Login form is invalid'); // Log invalid form
      return;
    }

    //console.log('Sending login request with email:', this.f.email.value);

    const loginSubscr = this.authService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (response: any) => {
          //console.log('Login response received:', response); // Log the API response

          // Check if the response contains user data
          if (response && response.id && response.roles) {
            const userId = response.id;
            const userRole = response.roles;

            //console.log('User logged in successfully:', { userId, userRole }); // Log user details

            // Store user data in session storage
            sessionStorage.setItem('userId', userId.toString());
            sessionStorage.setItem('userRole', userRole.toString());

            // Redirect based on role
            if (userRole === '4') {
              //console.log('Redirecting to Dadtwo dashboard');
              this.router.navigate(['/dadtwo-dashboard']);
            } else {
              //console.log('Redirecting to main dashboard');
              this.router.navigate(['/dashboard']);
            }
          } else {
            // If the response does not contain the expected user data, show error
            //console.error('Login failed: Invalid response structure or missing user data');
            this.hasError = true;
          }
        },
        (error) => {
          // Handle errors from the HTTP request
          //console.error('Login failed due to error:', error);
          this.hasError = true;
        }
      );

    this.unsubscribe.push(loginSubscr);
  }





  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
