import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MistakeOfFactService } from 'src/app/services/mistake-of-fact.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mistake-of-fact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mistake-of-fact.component.html',
  styleUrls: ['./mistake-of-fact.component.scss'],
})
export class MistakeOfFactComponent implements OnInit {
  formGroup: FormGroup;
  loading = false;
  firId: string | null = null; // Store FIR ID from the query parameters

  // Dropdown options for the form
  designations = ['DSP', 'ASP', 'ACP', 'ADSP'];
  chargeSheetTypes = ['Chargesheet', 'Referred chargesheet'];
  districts = ['District A', 'District B', 'District C'];
  courts = ['Court A', 'Court B', 'Court C'];
  chargesheetOptions = ['Yes', 'No'];

  // Flags for conditional rendering of fields
  showCourtDistricts = false;
  showCourtDistrict = false;
  showCaseNumber = false;
  showReferredFields = false;

  constructor(
    private fb: FormBuilder,
    private mistakeOfFactService: MistakeOfFactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.extractFirId();
  }

  // Extract FIR ID from query parameters
  extractFirId() {
    this.route.queryParams.subscribe((params) => {
      this.firId = params['fir_id'] || null;
      if (!this.firId) {
        Swal.fire('Error', 'FIR ID is missing in the URL!', 'error');
        this.router.navigate(['/widgets-examples/fir-list']);
      }
    });
  }

  // Initialize the form with validation rules
  initForm() {
    this.formGroup = this.fb.group({
      officerName: ['', Validators.required],
      officerDesignation: ['', Validators.required],
      officerPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      chargesheetcheckbox: ['', Validators.required],
      chargesheetDate: ['', Validators.required],
      chargesheetType: ['', Validators.required],
      courtDistrict: [''],
      courtName: [''],
      caseNumber: [''],
      rcsFilingNumber: [''],
    });

    // Listen for changes in 'chargesheetType' and toggle related fields
    this.formGroup.get('chargesheetType')?.valueChanges.subscribe((type) => {
      this.toggleFields(type);
    });
  }

  // Toggle the visibility and validators of fields based on chargesheet type
  toggleFields(type: string) {
    this.showReferredFields = type === 'Referred chargesheet';
    this.showCourtDistrict = type === 'Referred chargesheet';
    this.showCourtDistricts = type === 'Chargesheet' || type === 'Referred chargesheet';
    this.showCaseNumber = type === 'Chargesheet';

    this.formGroup
      .get('courtDistrict')
      ?.setValidators(this.showCourtDistrict ? Validators.required : null);
    this.formGroup
      .get('courtName')
      ?.setValidators(this.showCourtDistrict ? Validators.required : null);
    this.formGroup
      .get('caseNumber')
      ?.setValidators(this.showCaseNumber ? Validators.required : null);
    this.formGroup
      .get('rcsFilingNumber')
      ?.setValidators(this.showReferredFields ? Validators.required : null);

    this.formGroup.get('courtDistrict')?.updateValueAndValidity();
    this.formGroup.get('courtName')?.updateValueAndValidity();
    this.formGroup.get('caseNumber')?.updateValueAndValidity();
    this.formGroup.get('rcsFilingNumber')?.updateValueAndValidity();
  }

  // Handle form submission
  onSubmit(event: Event) {
    event.preventDefault();
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = {
      ...this.formGroup.value,
      firId: this.firId,
    };

    this.mistakeOfFactService.addOfficers(formData).subscribe(
      (response) => {
        console.log('Data submitted successfully:', response);
        Swal.fire('Success', 'Officer details added successfully.', 'success');
        this.formGroup.reset();
        this.router.navigate(['/widgets-examples/fir-list']);
        this.loading = false;
      },
      (error) => {
        console.error('Error submitting data:', error);
        Swal.fire('Error', 'Failed to submit officer details.', 'error');
        this.loading = false;
      }
    );
  }
}
