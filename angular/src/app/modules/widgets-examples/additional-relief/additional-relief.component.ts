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
  victims: any[] = [];
  additionalReliefForm: FormGroup;
  districts: string[] = ['District A', 'District B', 'District C'];

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
    private cdr: ChangeDetectorRef,
    private additionalReliefService: AdditionalReliefService,
  ) {
    this.additionalReliefForm = this.fb.group({
      fir_id: [''],
      victimName: this.fb.array([]),
      victimId: this.fb.array([]),
      sectionValue: this.fb.array([]),
      pensionStatus: [''],
      notApplicableReason: [''],
      otherReason: [''],
      relationship: [[]],
      pensionAmount: [0, [Validators.min(0)]],
      dearnessAllowance: [0, [Validators.min(0)]],
      totalPensionAmount: [''],
      fileNumber: [''],
      proceedingsDate: [''],
      uploadProceedings: [''],

      // Employment Details
      employmentStatus: [''],
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
      houseSitePattaStatus: [''],
      notApplicableHouseSitePattaReason: [''],
      houseSitePattaOtherReason: [''],
      houseSitePattaRelationship: [''],
      houseSitePattaAddress: [''],
      talukName: [''],
      districtName: [''],
      pinCode: [''],
      houseSitePattaIssueDate: [''],

      // Education Concession
      educationConcessionStatus: [''],
      notApplicableReasonEducation: [''],
      otherReasonEducation: [''],
      numberOfChildren: [''],
      children: this.fb.array([]),
      

      // Provisions Given
      provisionsGivenStatus: [''],
      reasonNotApplicable: [''],
      othersReason: [''],
      beneficiaryRelationship: [''],
      provisionsfileNumber: [''],
      dateOfProceedings: [''],
      uploadFile: [''],

      // Compensation Given
      compensationGivenStatus: [''],
      compensationnotApplicableReason: [''],
      compensationotherReason: [''],
      compensationestimatedAmount: [''],
      proceedingsFileNumber: [''],
      compensationdateOfProceedings: [''],
      compensationuploadProceedings: [''],
    });
  }

  

  // Get children FormArray
  get children() {
    return (this.additionalReliefForm.get('children') as FormArray);
  }

  get victimNameArray() {
    return (this.additionalReliefForm.get('victimName') as FormArray);
  }

  get victimSecArray() {
    return (this.additionalReliefForm.get('sectionValue') as FormArray);
  }

  get victimIdArray(): FormArray {
    return this.additionalReliefForm.get('victimId') as FormArray;
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const numberOfChildren = Number(inputElement.value);
  
    while (this.children.length < numberOfChildren) {
      this.addChild();
    }
    while (this.children.length > numberOfChildren) {
      this.children.removeAt(this.children.length - 1);
    }
  }
  
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

  
  removeChild(index: number) {
    this.children.removeAt(index);
  }


  getChildrenJson() {
    const childrenValue = this.children.getRawValue(); // Get raw value without any form status
    return JSON.stringify(childrenValue); // Return as JSON string
  }
  

    calculateTotal(): number {
      const pensionAmount = this.additionalReliefForm.get('pensionAmount')?.value || 0;
      const dearnessAllowance = this.additionalReliefForm.get('dearnessAllowance')?.value || 0;
      return pensionAmount + dearnessAllowance;
    }

    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length) {
        const file = input.files[0];
      }
    }

    triggerChangeDetection() {
      this.cdr.detectChanges();
    }

    updateTotalPensionAmount() {
      const pensionAmount = this.additionalReliefForm.get('pensionAmount')?.value || 0;
      const dearnessAllowance = this.additionalReliefForm.get('dearnessAllowance')?.value || 0;
      const totalPensionAmount = pensionAmount + dearnessAllowance;
      this.additionalReliefForm.get('totalPensionAmount')?.setValue(totalPensionAmount, { emitEvent: false });
    }

    ngOnInit(): void {
      this.route.queryParams.subscribe((params) => {
        this.firId = params['fir_id'];

        this.additionalReliefForm.patchValue({
          fir_id: this.firId
        });

        this.fetchVictims();
        this.cdr.detectChanges();
      });

      this.additionalReliefForm.get('pensionAmount')?.valueChanges.subscribe(() => {
        this.updateTotalPensionAmount();
      });
    
      this.additionalReliefForm.get('dearnessAllowance')?.valueChanges.subscribe(() => {
        this.updateTotalPensionAmount();
      });
    }
  
    fetchVictims(): void {
      this.additionalReliefService.getVictimsByFirId(this.firId).subscribe((data) => {
        // console.log(data);
        this.victims = data;
        this.setFormControls();
        this.cdr.detectChanges();
      });
    }

    setFormControls() {
      const victimIdsArray = this.additionalReliefForm.get('victimId') as FormArray;
      victimIdsArray.clear();

      const victimNameArray = this.additionalReliefForm.get('victimName') as FormArray;
      victimNameArray.clear();

      const victimSecArray = this.additionalReliefForm.get('sectionValue') as FormArray;
      victimSecArray.clear();

      this.victims.forEach((victim, index) => { 
        const victimNameControl = this.fb.control(victim.victim_name);
        victimNameArray.push(victimNameControl);
        
        const victimIdControl = this.fb.control(victim.victim_id);
        victimIdsArray.push(victimIdControl);

        const victimSecControl = this.fb.control(victim.additional_relief);
        victimSecArray.push(victimSecControl);
      });
    }
    
  onSubmit() {
    if (this.additionalReliefForm) {
      const formData = this.additionalReliefForm.value; // Capture form data
  
      formData.children = this.getChildrenJson();

      // console.log(formData.children);
  
      this.additionalReliefService.saveAdditionalRelief(formData).subscribe({
        next: (response) => {
          console.log('Data saved successfully:', response);
        },
        error: (err) => {
          console.error('Error saving data:', err);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
  
  
}

