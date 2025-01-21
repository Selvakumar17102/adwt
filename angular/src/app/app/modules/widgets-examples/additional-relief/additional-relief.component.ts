import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationStart, Event as RouterEvent } from '@angular/router';
import { FormControl, AbstractControl } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { AdditionalReliefService } from 'src/app/services/additional-relief.service';


import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import Swal from 'sweetalert2';
import { MatRadioModule } from '@angular/material/radio';


@Component({
  selector: 'app-additional-relief',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
  ],
  templateUrl: './additional-relief.component.html',
  styleUrls: ['./additional-relief.component.scss']
})
// export class AdditionalReliefComponent {
  
//   victimName: string = '';
//   pensionStatus: string = '';
//   notApplicableReason: string = '';
//   otherReason: string = '';
//   relationship: string[] = [];
  // notApplicableReasons = [
  //   { value: 'Deceased', label: 'Deceased' },
  //   { value: 'Not Eligible', label: 'Not Eligible' },
  //   { value: 'Others', label: 'Others' }
  // ];
  
//   relationships = [
//     { value: 'Self', label: 'Self' },
//     { value: 'Daughter', label: 'Daughter' },
//     { value: 'Son', label: 'Son' },
//     { value: 'Father', label: 'Father' },
//     { value: 'Mother', label: 'Mother' },
//     { value: 'Brother', label: 'Brother' },
//     { value: 'Sister', label: 'Sister' },
//     { value: 'Spouse', label: 'Spouse' },
//     { value: 'KithAndKin', label: 'Kith and Kin' },
//   ];

//   pensionAmount: number = 0;
//   dearnessAllowance: number = 0;
//   fileNumber: string = '';
//   proceedingsDate: string = '';
//   selectedFile: File | null = null;


//   onSubmit() {
//     console.log('Form Submitted', {
//       victimName: this.victimName,
//       pensionStatus: this.pensionStatus,
//       notApplicableReason: this.notApplicableReason,
//       otherReason: this.otherReason,
//       relationship: this.relationship
//     });
//   }


//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length) {
//       const file = input.files[0];
//       // Handle the file upload logic here
//       console.log('File selected:', file.name);
//     }
//   }

//   calculateTotal(): number {
//     return (this.pensionAmount || 0) + (this.dearnessAllowance || 0);
//   }


//   employmentStatus: string = '';
//   notApplicableEmploymentReason: string = '';
//   employmentOtherReason: string = '';
//   relationshipToVictim: string = '';
//   educationalQualification: string = '';
//   departmentName: string = '';
//   officeName: string = '';
//   designation: string = '';
//   officeAddress: string = '';
//   officeDistrict: string = '';
//   appointmentOrderDate: string = '';
//   providingOrderDate: string = '';
//   districts: string[] = ['District A', 'District B', 'District C'];  // Example districts

//   houseSitePattaStatus: string = '';
//   notApplicableHouseSitePattaReason: string = '';
//   houseSitePattaOtherReason: string = '';
//   houseSitePattaRelationship: string = '';
//   houseSitePattaAddress: string = '';
//   talukName: string = '';
//   districtName: string = '';
//   pinCode: string = '';
//   houseSitePattaIssueDate: string = '';


//   // Form variables for education concession
//   educationConcessionStatus: string = '';
//   notApplicableReasonEducation: string = '';
//   otherReasonEducation: string = '';
//   numberOfChildren: number = 0;

//   // Array to store children data
//   children: any[] = [];

//   // Method to dynamically add children to the form
//   addChild() {
//     const currentChildrenCount = this.children.length;

//     // Add or remove children based on the number
//     if (this.numberOfChildren > currentChildrenCount) {
//       // Add children
//       const childrenToAdd = this.numberOfChildren - currentChildrenCount;
//       for (let i = 0; i < childrenToAdd; i++) {
//         this.children.push({
//           gender: '',
//           age: null,
//           studyStatus: '',
//           institution: '',
//           standard: '',
//           course: '',
//           courseYear: null,
//           amountDisbursed: null,
//           proceedingsFileNumber: '',
//           dateOfProceedings: '',
//           uploadProceedings: null
//         });
//       }
//     } else if (this.numberOfChildren < currentChildrenCount) {
//       // Remove children
//       this.children.splice(this.numberOfChildren);
//     }
//   }

//   // Method to remove child (if needed)
//   removeChild(index: number) {
//     this.children.splice(index, 1);
//   }


//   provisionsGivenStatus: string = '';
//   reasonNotApplicable: string = '';
//   othersReason: string = '';
//   beneficiaryRelationship: string = '';
//   provisionsfileNumber: string = '';
//   dateOfProceedings: string = '';
//   uploadFile: any = null;


//   compensationGivenStatus: string = '';  // Tracks Yes/Not Applicable
//   compensationnotApplicableReason: string = '';  // Reason for 'Not Applicable'
//   compensationotherReason: string = '';  // To specify the reason if 'Others' is selected
//   compensationestimatedAmount: number = 0;  // Amount from PWD
//   proceedingsFileNumber: string = '';  // File number
//   compensationdateOfProceedings: string = '';  // Date of proceedings
//   compensationuploadProceedings: any = null;  // File upload for proceedings document


// }

export class AdditionalReliefComponent {
  firId: string = '';
  victims: any[] = []; // Array to store victim details
  additionalReliefForm: FormGroup;
  districts: string[] = ['District A', 'District B', 'District C']; // Example districts

  notApplicableReasons = [
    { value: 'Deceased', label: 'Deceased' },
    { value: 'Not Eligible', label: 'Not Eligible' },
    { value: 'Others', label: 'Others' }
  ];

    relationships = [
    { value: 'Self', label: 'Self' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Son', label: 'Son' },
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'KithAndKin', label: 'Kith and Kin' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private additionalReliefService: AdditionalReliefService,
  ) {
    this.additionalReliefForm = this.fb.group({
      // Basic Details
      victimName: ['', [Validators.required]],
      pensionStatus: ['', Validators.required],
      notApplicableReason: [''],
      otherReason: [''],
      relationship: [[]],
      pensionAmount: [0, [Validators.required, Validators.min(0)]],
      dearnessAllowance: [0, [Validators.required, Validators.min(0)]],
      fileNumber: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9-]+')]],
      proceedingsDate: ['', Validators.required],
      uploadProceedings: ['', Validators.required],

      // Employment Details
      employmentStatus: ['', Validators.required],
      notApplicableEmploymentReason: [''],
      employmentOtherReason: [''],
      relationshipToVictim: [''],
      educationalQualification: [''],
      departmentName: [''],
      officeName: [''],
      designation: [''],
      officeAddress: [''],
      officeDistrict: [''],
      appointmentOrderDate: [''],
      providingOrderDate: [''],

      // House Site Patta Details
      houseSitePattaStatus: ['', Validators.required],
      notApplicableHouseSitePattaReason: [''],
      houseSitePattaOtherReason: [''],
      houseSitePattaRelationship: [''],
      houseSitePattaAddress: [''],
      talukName: [''],
      districtName: [''],
      pinCode: [''],
      houseSitePattaIssueDate: [''],

      // Education Concession
      educationConcessionStatus: ['', Validators.required],
      notApplicableReasonEducation: [''],
      otherReasonEducation: [''],
      numberOfChildren: ['', Validators.required],
      children: this.fb.array([]),  // Will hold an array of children controls
      

      // Provisions Given
      provisionsGivenStatus: ['', Validators.required],
      reasonNotApplicable: [''],
      othersReason: [''],
      beneficiaryRelationship: [''],
      provisionsfileNumber: ['', Validators.required],
      dateOfProceedings: ['', Validators.required],
      uploadFile: ['', Validators.required],

      // Compensation Given
      compensationGivenStatus: ['', Validators.required],
      compensationnotApplicableReason: [''],
      compensationotherReason: [''],
      compensationestimatedAmount: ['', [Validators.required, Validators.min(0)]],
      proceedingsFileNumber: ['', Validators.required],
      compensationdateOfProceedings: ['', Validators.required],
      compensationuploadProceedings: ['', Validators.required],
    });
  }

  

  // Get children FormArray
  get children() {
    return (this.additionalReliefForm.get('children') as FormArray);
  }

  // Add a child to the children array
  addChild() {
    const childFormGroup = this.fb.group({
      gender: ['', Validators.required],
      age: ['', Validators.required],
      studyStatus: ['', Validators.required],
      institution: [''],
      standard: [''],
      course: [''],
      courseYear: [''],
      amountDisbursed: ['', Validators.required],
      proceedingsFileNumber: ['', Validators.required],
      dateOfProceedings: ['', Validators.required],
      uploadProceedings: ['', Validators.required],
    });
    this.children.push(childFormGroup);
  }

  // Remove a child from the children array
  removeChild(index: number) {
    this.children.removeAt(index);
  }

  // Calculate Total Pension Amount
  calculateTotal(): number {
    const pensionAmount = this.additionalReliefForm.get('pensionAmount')?.value || 0;
    const dearnessAllowance = this.additionalReliefForm.get('dearnessAllowance')?.value || 0;
    return pensionAmount + dearnessAllowance;
  }

  // Handle file selection
    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length) {
        const file = input.files[0];
        // Handle the file upload logic here
        console.log('File selected:', file.name);
      }
    }


    ngOnInit(): void {
      // Get firId from query parameters
      this.route.queryParams.subscribe((params) => {
        this.firId = params['fir_id'];
        this.fetchVictims();
        
      });

      // Initialize the form with a control for victimName
      this.additionalReliefForm = this.fb.group({
        victimName: [''],  // Initialize with an empty string or a default value
      });
    }
  
    fetchVictims(): void {
      this.additionalReliefService.getVictimsByFirId(this.firId).subscribe((data) => {
        console.log(data);
        this.victims = data;
  
        // Assuming you want to set the victimName form control for the first victim
        if (this.victims && this.victims.length > 0) {
          const firstVictim = this.victims[0];
          this.additionalReliefForm.get('victimName')?.setValue(firstVictim.victim_name);
        }
      });
    }
  // Submit the form
  onSubmit() {
    if (this.additionalReliefForm.valid) {
      console.log('Form Submitted', this.additionalReliefForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}

