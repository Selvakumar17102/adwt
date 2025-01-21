import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { FirService } from 'src/app/services/fir.service';
import { ReliefService } from 'src/app/services/relief.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-relief',
  templateUrl: './relief.component.html',
  styleUrls: ['./relief.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ReliefComponent implements OnInit {
  tabs: string[] = ['First Installment', 'Second Installment', 'Third Installment'];
  currentTab: number = 0;
  reliefForm!: FormGroup;
  firId: string | undefined;
  firDetails: any;

  enabledTabs: boolean[] = [false, false, false]; // Dynamic enabling of tabs

  constructor(
    private fb: FormBuilder,
    private firService: FirService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ReliefService: ReliefService,
  ) {}
  loading = true;

  ngOnInit(): void {
    this.initializeForm();
    this.firId = this.getFirIdFromRouter();

    if (this.firId) {
      this.fetchFirStatus(this.firId); // Fetch status

      forkJoin([
        this.fetchFirDetails(this.firId), // Fetch FIR details
        this.fetchVictimDetails(this.firId),
        this.fetchSecondInstallmentDetails(this.firId), // Fetch victim details
      ]).subscribe({
        next: () => {
          this.loading = false; // Mark loading as complete
          this.cdr.detectChanges(); // Ensure UI updates
        },
        error: (err) => {
          console.error('Error fetching initial data:', err);
          this.loading = false;
        },
      });
    } else {
      console.error('No FIR ID found.');
      this.router.navigate(['/']); // Redirect if FIR ID is missing
    }
  }




  // Get FIR ID from Router State or Query Params
  private getFirIdFromRouter(): string | undefined {
    const navigation = this.router.getCurrentNavigation();
    return navigation?.extras?.state?.['firId'] || this.activatedRoute.snapshot.queryParams['fir_id'];
  }

  // Fetch FIR Details based on FIR ID
  private fetchFirDetails(firId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.firService.getFirDetails(firId).subscribe({
        next: (details: any) => {
          this.firDetails = details;
          this.patchFirDetailsToForm(this.firDetails);
          resolve();
        },
        error: (err: any) => {
          console.error('Error fetching FIR details:', err);
          reject(err);
        },
      });
    });
  }


  private fetchFirStatus(firId: string): void {
    this.firService.getFirStatus(firId).subscribe({
      next: (response: any) => {
        const status = response.status;

        if (status >= 5) this.enabledTabs[0] = true; // Enable First Installment
        if (status >= 6) this.enabledTabs[1] = true; // Enable Second Installment
        if (status >= 7) this.enabledTabs[2] = true; // Enable Third Installment
      },
      error: (err: any) => {
        console.error('Error fetching FIR status:', err);
      },
    });
  }
  // Patch FIR details to the form
  private patchFirDetailsToForm(details: any): void {
    this.reliefForm.patchValue({
      firNumber: details.fir_number || 'N/A',
      policeStationDetails: details.police_station || 'N/A',
      dateOfReporting: details.date_of_registration || '',
      dateOfOccurrence: details.date_of_occurrence || '',
      natureOfOffence: details.nature_of_offence || 'N/A',
      placeOfOccurrence: details.place_of_occurrence || 'N/A',
      numberOfVictims: details.number_of_victim || '0',
      numberOfAccused: details.number_of_accused || '0',
    });
  }

  initializeForm(): void {
    this.reliefForm = this.fb.group({
      firNumber: ['', Validators.required],
      policeStationDetails: ['', Validators.required],
      //dateOfReporting: ['', Validators.required],
      //dateOfOccurrence: ['', Validators.required],
      placeOfOccurrence: ['', Validators.required],
      numberOfVictims: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      numberOfAccused: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      victims: this.fb.array([this.createVictimFormGroup()]),
      secondInstallmentVictims: this.fb.array([]), // Add at least one group initially
      firstInstallmentUploadDocument: ['', Validators.required],
      firstInstallmentDateOfDisbursement: ['', Validators.required],
      firstInstallmentProceedingsFileDate: [null, Validators.required],
      firstInstallmentProceedingsFileNumber: ['', Validators.required],
      firstInstallmentPfmsPortalUploaded:['', Validators.required],
      proceedingsReceiptDate:['', Validators.required],
      secondInstallmentProceedingsFileNumber:['', Validators.required],
      secondInstallmentProceedingsFileDate:['', Validators.required],
      secondInstallmentUploadDocument:['', Validators.required],
      secondInstallmentPfmsPortalUploaded:['', Validators.required],
      secondInstallmentDateOfDisbursement:['', Validators.required],

    });
  }

  private fetchVictimDetails(firId: string): void {
    this.ReliefService.getVictimsReliefDetails_1(firId).subscribe({
      next: (response: any) => {
        console.log('Fetched Victim Details:', response);

        if (response?.victimsReliefDetails) {
          this.populateVictimFields(response.victimsReliefDetails);
        } else {
          console.error('Invalid response structure:', response);
        }
      },
      error: (err: any) => {
        console.error('Error fetching victim details:', err);
      },
    });
  }



  private fetchSecondInstallmentDetails(firId: string): void {
    this.ReliefService.getSecondInstallmentDetails(firId).subscribe({
      next: (response: any) => {
        console.log('Fetched Second Installment Victim Details:', response);

        // Adjusted to handle the correct key
        if (response?.victims && Array.isArray(response.victims)) {
          this.populateSecondInstallmentVictimFields(response.victims);
        } else {
          console.error('Invalid response structure:', response);
        }
      },
      error: (err: any) => {
        console.error('Error fetching second installment details:', err);
      },
    });
  }



  get secondInstallmentVictimsArray(): FormArray {
    return this.reliefForm.get('secondInstallmentVictims') as FormArray;
  }


  private populateVictimFields(victims: any[]): void {
    const victimsArray = this.victimsArray;
    victimsArray.clear(); // Clear existing controls

    victims.forEach((victim) => {
      victimsArray.push(this.createVictimFormGroup(victim)); // Add each victim to FormArray
    });

    this.cdr.detectChanges(); // Trigger UI updates
  }


  // private initializeSecondInstallmentVictims(victims: any[]): void {
  //   this.secondInstallmentVictimsArray.clear(); // Clear any existing data
  //   victims.forEach((victim) => {
  //     this.secondInstallmentVictimsArray.push(this.createVictimFormGroup(victim));
  //   });
  // }



  private populateSecondInstallmentVictimFields(victims: any[]): void {
    const victimControls = this.secondInstallmentVictimsArray;

    // Clear existing controls and repopulate with new data
    victimControls.clear();

    victims.forEach((victim) => {
      const group = this.createVictimFormGroup({
        victimId: victim.victim_id, // Map victim_id
        chargesheetId: victim.chargesheet_id, // Map chargesheet_id
        secondInstallmentVictimName: victim.secondInstallmentVictimName || '',
        secondInstallmentReliefScst: parseFloat(victim.secondInstallmentReliefScst) || 0,
        secondInstallmentReliefExGratia: parseFloat(victim.secondInstallmentReliefExGratia) || 0,
        secondInstallmentTotalRelief: parseFloat(victim.secondInstallmentTotalRelief) || 0,
      });
      victimControls.push(group);
    });

    this.cdr.detectChanges(); // Trigger UI update
  }








  private createVictimFormGroup(victim: any = {}): FormGroup {
    const scstValue = parseFloat(victim.firstInstallmentReliefScst || '0'); // Parse SC/ST value as a number
    const exGratiaValue = parseFloat(victim.firstInstallmentReliefExGratia || '0'); // Parse ex-gratia value as a number
    const totalRelief = this.calculateTotal(scstValue, exGratiaValue); // Calculate total relief

    const secondReliefScst = parseFloat(victim.secondInstallmentReliefScst || '0');
    const secondReliefExGratia = parseFloat(victim.secondInstallmentReliefExGratia || '0');
    const secondTotalRelief = this.calculateTotal(secondReliefScst, secondReliefExGratia);

    const group = this.fb.group({
      victimId: [victim.victimId || null],
      reliefId: [victim.reliefId || null],

      chargesheetId: [victim.chargesheetId || null],
      // First Installment Fields
      firstInstallmentBankAccountNumber: [victim.firstInstallmentBankAccountNumber || '', Validators.required],
      firstInstallmentIfscCode: [victim.firstInstallmentIfscCode || '', Validators.required],
      firstInstallmentBankName: [victim.firstInstallmentBankName || '', Validators.required],
      firstInstallmentVictimName: [{ value: victim.victimName || '', disabled: true }, Validators.required],
      firstInstallmentReliefScst: [scstValue, Validators.required],
      firstInstallmentReliefExGratia: [exGratiaValue, Validators.required],
      firstInstallmentTotalRelief: [{ value: totalRelief, disabled: true }, Validators.required],

      // Second Installment Fields
      secondInstallmentVictimName: [{ value: victim.secondInstallmentVictimName || '', disabled: true }, Validators.required],
      secondInstallmentReliefScst: [secondReliefScst, Validators.required],
      secondInstallmentReliefExGratia: [secondReliefExGratia, Validators.required],
      secondInstallmentTotalRelief: [{ value: secondTotalRelief, disabled: true }, Validators.required],
    });

    this.addDynamicListeners(group); // Add dynamic listeners for value changes
    return group;
  }









  private calculateTotal(amount1: number, amount2: number): number {
    return (amount1 || 0) + (amount2 || 0);
  }






  // Get the victims FormArray
  get victimsArray(): FormArray {
    return this.reliefForm.get('victims') as FormArray;
  }

  // Select a tab
  selectTab(index: number): void {
    if (this.enabledTabs[index]) {
      this.currentTab = index;
    } else {
      alert('This tab is not enabled yet!');
    }
  }



  private addDynamicListeners(group: FormGroup): void {
    // Listener for First Installment Total
    group.get('firstInstallmentReliefScst')?.valueChanges.subscribe(() => {
      const scstValue = parseFloat(group.get('firstInstallmentReliefScst')?.value || '0');
      const exGratiaValue = parseFloat(group.get('firstInstallmentReliefExGratia')?.value || '0');
      const total = this.calculateTotal(scstValue, exGratiaValue);

      console.log('Updated First Installment Relief Amount (SC/ST):', { scstValue, exGratiaValue, total });
      group.get('firstInstallmentTotalRelief')?.setValue(total.toFixed(2), { emitEvent: false });
    });

    group.get('firstInstallmentReliefExGratia')?.valueChanges.subscribe(() => {
      const scstValue = parseFloat(group.get('firstInstallmentReliefScst')?.value || '0');
      const exGratiaValue = parseFloat(group.get('firstInstallmentReliefExGratia')?.value || '0');
      const total = this.calculateTotal(scstValue, exGratiaValue);

      console.log('Updated First Installment Relief Amount (Ex-Gratia):', { scstValue, exGratiaValue, total });
      group.get('firstInstallmentTotalRelief')?.setValue(total.toFixed(2), { emitEvent: false });
    });

    // Listener for Second Installment Total
    group.get('secondInstallmentReliefScst')?.valueChanges.subscribe(() => {
      const secondScstValue = parseFloat(group.get('secondInstallmentReliefScst')?.value || '0');
      const secondExGratiaValue = parseFloat(group.get('secondInstallmentReliefExGratia')?.value || '0');
      const secondTotal = this.calculateTotal(secondScstValue, secondExGratiaValue);

      console.log('Updated Second Installment Relief Amount (SC/ST):', { secondScstValue, secondExGratiaValue, secondTotal });
      group.get('secondInstallmentTotalRelief')?.setValue(secondTotal.toFixed(2), { emitEvent: false });
    });

    group.get('secondInstallmentReliefExGratia')?.valueChanges.subscribe(() => {
      const secondScstValue = parseFloat(group.get('secondInstallmentReliefScst')?.value || '0');
      const secondExGratiaValue = parseFloat(group.get('secondInstallmentReliefExGratia')?.value || '0');
      const secondTotal = this.calculateTotal(secondScstValue, secondExGratiaValue);

      console.log('Updated Second Installment Relief Amount (Ex-Gratia):', { secondScstValue, secondExGratiaValue, secondTotal });
      group.get('secondInstallmentTotalRelief')?.setValue(secondTotal.toFixed(2), { emitEvent: false });
    });
  }



  private getInvalidFields(target: string): string[] {
    const invalidFields: string[] = [];

    // Map technical field names to user-friendly names
    const fieldLabels: { [key: string]: string } = {
      firstInstallmentProceedingsFileNumber: 'File Number',
      firstInstallmentProceedingsFileDate: 'File Date',
      firstInstallmentUploadDocument: 'Upload Document',
      firstInstallmentPfmsPortalUploaded: 'PFMS Portal Uploaded',
      firstInstallmentDateOfDisbursement: 'Date of Disbursement',
      secondInstallmentProceedingsFileNumber: 'Second Installment File Number',
      secondInstallmentProceedingsFileDate: 'Second Installment File Date',
      secondInstallmentUploadDocument: 'Second Installment Upload Document',
      secondInstallmentPfmsPortalUploaded: 'Second Installment PFMS Portal Uploaded',
      secondInstallmentDateOfDisbursement: 'Second Installment Date of Disbursement',
      firstInstallmentVictimName: 'Victim Name',
      firstInstallmentReliefScst: 'Relief Amount (SC/ST)',
      firstInstallmentReliefExGratia: 'Relief Amount (Ex-Gratia)',
      secondInstallmentVictimName: 'Second Installment Victim Name',
      secondInstallmentReliefScst: 'Second Installment Relief Amount (SC/ST)',
      secondInstallmentReliefExGratia: 'Second Installment Relief Amount (Ex-Gratia)',
    };

    if (target === 'firstInstallment') {
      // Validate top-level fields for the First Installment
      const firstInstallmentFields = [
        'firstInstallmentProceedingsFileNumber',
        'firstInstallmentProceedingsFileDate',
        'firstInstallmentUploadDocument',
        'firstInstallmentPfmsPortalUploaded',
        'firstInstallmentDateOfDisbursement',
      ];

      firstInstallmentFields.forEach((field) => {
        if (this.reliefForm.get(field)?.invalid) {
          invalidFields.push(fieldLabels[field] || field); // Use user-friendly name
        }
      });

      // Validate the Victims Array for the First Installment
      const victims = this.reliefForm.get('victims') as FormArray;
      victims.controls.forEach((group, index) => {
        const groupControls = (group as FormGroup).controls;
        ['firstInstallmentVictimName', 'firstInstallmentReliefScst', 'firstInstallmentReliefExGratia'].forEach((key) => {
          if (groupControls[key]?.invalid) {
            invalidFields.push(`Victim ${index + 1} - ${fieldLabels[key] || key}`);
          }
        });
      });
    } else if (target === 'secondInstallment') {
      // Validate top-level fields for the Second Installment
      const secondInstallmentFields = [
        'secondInstallmentProceedingsFileNumber',
        'secondInstallmentProceedingsFileDate',
        'secondInstallmentUploadDocument',
        'secondInstallmentPfmsPortalUploaded',
        'secondInstallmentDateOfDisbursement',
      ];

      secondInstallmentFields.forEach((field) => {
        if (this.reliefForm.get(field)?.invalid) {
          invalidFields.push(fieldLabels[field] || field); // Use user-friendly name
        }
      });

      // Validate the Victims Array for the Second Installment
      const victims = this.reliefForm.get('secondInstallmentVictims') as FormArray;
      victims.controls.forEach((group, index) => {
        const groupControls = (group as FormGroup).controls;
        ['secondInstallmentVictimName', 'secondInstallmentReliefScst', 'secondInstallmentReliefExGratia'].forEach((key) => {
          if (groupControls[key]?.invalid) {
            invalidFields.push(`Victim ${index + 1} - ${fieldLabels[key] || key}`);
          }
        });
      });
    }

    return invalidFields;
  }


  onFirstInstallmentSubmit(): void {
    const invalidFields = this.getInvalidFields('firstInstallment');
    if (invalidFields.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete Form',
        text: `Please fill in all required fields:\n${invalidFields.join(', ')}`,
      });
      return;
    }

    // Enable victimName temporarily
    this.victimsArray.controls.forEach((control) => {
      control.get('firstInstallmentVictimName')?.enable();
    });

    this.victimsArray.controls.forEach((control) => {
      control.get('firstInstallmentTotalRelief')?.enable();
    });

    // Prepare the data to send to the backend
    const firstInstallmentData = {
      firId: this.firId,
      victims: this.victimsArray.value.map((victim: any) => ({
        victimId: victim.victimId || null,
        reliefId: victim.reliefId || null,
        victimName: victim.firstInstallmentVictimName,
        reliefAmountScst: victim.firstInstallmentReliefScst,
        reliefAmountExGratia: victim.firstInstallmentReliefExGratia,
        reliefAmountFirstStage: victim.firstInstallmentTotalRelief,
        bankAccountNumber: victim.firstInstallmentBankAccountNumber,
        ifscCode: victim.firstInstallmentIfscCode,
        bankName: victim.firstInstallmentBankName,
      })),
      proceedings: {
        fileNo: this.reliefForm.get('firstInstallmentProceedingsFileNumber')?.value,
        fileDate: this.reliefForm.get('firstInstallmentProceedingsFileDate')?.value,
        uploadDocument: this.reliefForm.get('firstInstallmentUploadDocument')?.value,
        pfmsPortalUploaded: this.reliefForm.get('firstInstallmentPfmsPortalUploaded')?.value,
        dateOfDisbursement: this.reliefForm.get('firstInstallmentDateOfDisbursement')?.value,
      },
    };

    console.log('First Installment Data going:', firstInstallmentData);

    // Save data using the service
    this.ReliefService.saveFirstInstallmentDetails(firstInstallmentData).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'First Installment Details Saved Successfully!',
        });
        console.log(response);
      },
      error: (err: any) => {
        console.error('Error saving First Installment Details:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while saving the data. Please try again.',
        });
      },
    });

    // Disable victimName again
    this.victimsArray.controls.forEach((control) => {
      control.get('firstInstallmentVictimName')?.disable();
    });
  }

  onSecondInstallmentSubmit(): void {
    const invalidFields = this.getInvalidFields('secondInstallment');
    if (invalidFields.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete Form',
        text: `Please fill in all required fields:\n${invalidFields.join(', ')}`,
      });
      return;
    }

    // Enable victimName temporarily for submission
    this.secondInstallmentVictimsArray.controls.forEach((control) => {
      control.get('secondInstallmentVictimName')?.enable();
    });

    this.secondInstallmentVictimsArray.controls.forEach((control) => {
      control.get('secondInstallmentTotalRelief')?.enable();
    });

    // Prepare the data for the backend
    const secondInstallmentData = {
      firId: this.firId,
      victims: this.secondInstallmentVictimsArray.value.map((victim: any) => ({
        victimId: victim.victimId || null,
        chargesheetId: victim.chargesheetId || null,
        victimName: victim.secondInstallmentVictimName,
        secondInstallmentReliefScst: victim.secondInstallmentReliefScst,
        secondInstallmentReliefExGratia: victim.secondInstallmentReliefExGratia,
        secondInstallmentTotalRelief: victim.secondInstallmentTotalRelief,
      })),
      proceedings: {
        fileNumber: this.reliefForm.get('secondInstallmentProceedingsFileNumber')?.value,
        fileDate: this.reliefForm.get('secondInstallmentProceedingsFileDate')?.value,
        uploadDocument: this.reliefForm.get('secondInstallmentUploadDocument')?.value,
        pfmsPortalUploaded: this.reliefForm.get('secondInstallmentPfmsPortalUploaded')?.value,
        dateOfDisbursement: this.reliefForm.get('secondInstallmentDateOfDisbursement')?.value,
      },
    };

    console.log('Second Installment Data:', secondInstallmentData);

    // Call service to save the second installment details
    this.ReliefService.saveSecondInstallmentDetails(secondInstallmentData).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Second Installment Details Saved Successfully!',
        });
        console.log(response);
      },
      error: (err: any) => {
        console.error('Error saving Second Installment Details:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while saving the data. Please try again.',
        });
      },
    });

    // Disable victimName again
    this.secondInstallmentVictimsArray.controls.forEach((control) => {
      control.get('secondInstallmentVictimName')?.disable();
    });
  }


}
