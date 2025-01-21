import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import Swal from 'sweetalert2';
import { AlteredCaseService } from 'src/app/services/altered-case.service';
import { FirService } from 'src/app/services/fir.service';

import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-altered-case',
  templateUrl: './altered-case.component.html',
  styleUrls: ['./altered-case.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
  ],
})
export class AlteredCaseComponent implements OnInit {
  alteredCaseForm: FormGroup;
  modalVictimForm: FormGroup;
  victims: FormArray;
  modalVictims: FormArray;
  natureOfOffenceOptions: { offence_name: string }[] = [];
  scstSectionsOptions: { section_name: string }[] = [];
  casteSectionsOptions: { section_name: string }[] = [];
  firId: string | null = null;
  victimCountArray: number[] = Array.from({ length: 10 }, (_, i) => i + 1); // Victim count options (1-10)
  @ViewChild('victimModal') victimModal!: TemplateRef<any>;
  @ViewChild('accusedModal') accusedModal!: TemplateRef<any>;
  modalAccusedForm: FormGroup;
  modalAccuseds: FormArray;
  accusedCountArray = [1, 2, 3, 4, 5];
  policeStations: string[] = [];
  offenceOptions: string[] = [];
  offenceActsOptions: { offence_act_name: string }[] = [];
  victimNames: { name: string; isSelected: number }[] = [];
  victimOffenceOptions: string[] = [];
  victimCasteOptions: string[] = [];
  accuseds: FormArray;
  stationNumbers: number[] = Array.from({ length: 99 }, (_, k) => k + 1);
  firNumberOptions: number[] = Array.from({ length: 99 }, (_, k) => k + 1);
  yearOptions: number[] = [];
  constructor(
    private fb: FormBuilder,
    private alteredCaseService: AlteredCaseService,
    private firService: FirService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) {
    this.victims = this.fb.array([]);
    this.modalVictims = this.fb.array([]);
    this.modalAccuseds = this.fb.array([]);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeModalForm(); // Initialize modal form
    this.extractFirId();
    this.loadDropdownOptions();
    this.generateYearOptions();
    //this.loadnativedistrict();

    if (this.firId) {
      this.loadVictimNames(); // Load victim names based on FIR ID
    }

  }

  // Initialize the form
  initializeForm(): void {
    this.alteredCaseForm = this.fb.group({
      isDeceased: ['', Validators.required],
      deceasedPersonNames: [[]],
      victims: this.victims,
      dateOfOccurrence: ['', Validators.required],
      alterationCopy: [null, Validators.required],
    });

    this.modalAccusedForm = this.fb.group({
      numberOfAccused: [1, Validators.required], // Default to 1 accused
      accuseds: this.fb.array([]), // Initialize FormArray
    });

    this.modalAccuseds = this.modalAccusedForm.get('accuseds') as FormArray;
    this.addAccused(); // Add at least one accused by default// Add one accused by default
  }



  onNumberOfAccusedChange(): void {
    const count = this.modalAccusedForm.get('numberOfAccused')?.value || 0;
    const currentLength = this.modalAccuseds.length;

    // Add accused forms if count is greater than current length
    if (count > currentLength) {
      for (let i = currentLength; i < count; i++) {
        this.addAccused();
      }
    }

    // Remove accused forms if count is less than current length
    else if (count < currentLength) {
      for (let i = currentLength - 1; i >= count; i--) {
        this.modalAccuseds.removeAt(i);
      }
    }
  }

  addAccused(): void {
    const accusedGroup = this.fb.group({



      accusedId: [''],
      age: ['', Validators.required],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      community: ['', Validators.required],
      caste: ['', Validators.required],
      guardianName: ['', Validators.required],
      previousIncident: [false],
      previousFIRNumber: [''],
      previousFIRNumberSuffix: [''],
      scstOffence: [false, Validators.required],
      scstFIRNumber: [''],
      scstFIRNumberSuffix: [''],
      antecedents: ['', Validators.required],
      landOIssues: ['', Validators.required],
      gistOfCurrentCase: ['', Validators.required]


    });

    this.modalAccuseds.push(accusedGroup);
  }





  initializeModalForm(): void {
    this.modalVictimForm = this.fb.group({
      numberOfVictims: [1, Validators.required], // Default victim count to 1
      victims: this.modalVictims,
    });
    this.addModalVictim(); // Add one default victim


  }

  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;

    for (let year = currentYear; year >= startYear; year--) {
      this.yearOptions.push(year); // Populate yearOptions array with years
    }
  }

  onIsDeceasedChangeOutside(): void {
    const isDeceasedControl = this.alteredCaseForm.get('isDeceased');
    const deceasedPersonNamesControl = this.alteredCaseForm.get('deceasedPersonNames');

    if (isDeceasedControl?.value === 'yes') {
      deceasedPersonNamesControl?.setValidators([Validators.required]);
      deceasedPersonNamesControl?.setValue([]); // Reset to an empty array
      deceasedPersonNamesControl?.enable();
    } else {
      deceasedPersonNamesControl?.clearValidators();
      deceasedPersonNamesControl?.setValue([]); // Reset to an empty array
      deceasedPersonNamesControl?.disable();
    }

    deceasedPersonNamesControl?.updateValueAndValidity();
  }



  updateNextButtonState(): void {
    const isDeceased = this.alteredCaseForm.get('isDeceased')?.value;
    const deceasedPersonNamesValid = this.alteredCaseForm.get('deceasedPersonNames')?.valid;

    // Enable "Next" button only if conditions are met
    // this.nextButtonDisabled = !(isDeceased === 'no' || (isDeceased === 'yes' && deceasedPersonNamesValid));
    this.cdr.detectChanges(); // Trigger change detection
  }
  addModalVictim(): void {
    const victimGroup = this.fb.group({
      age: ['', [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      gender: ['', Validators.required],
      mobileNumber: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      address: [''],
      victimPincode: ['', [Validators.pattern(/^[0-9]{6}$/)]],
      community: ['', Validators.required],
      victimCaste: ['', Validators.required],
      guardianName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      isNativeDistrictSame: ['', Validators.required],
      nativeDistrict: [''], // Optional
      victimOffenceCommitted: [[], Validators.required],
      victimSCSTSections: ['', Validators.required], // Renamed
      fir_stage_as_per_act: [''], // Hidden fields
      fir_stage_ex_gratia: [''],
      chargesheet_stage_as_per_act: [''],
      chargesheet_stage_ex_gratia: [''],
      final_stage_as_per_act: [''],
      final_stage_ex_gratia: [''],
      alteredSections: ['']
    });
    this.modalVictims.push(victimGroup); // Add new victim group
  }


  // Extract FIR ID from URL query params
  extractFirId(): void {
    this.route.queryParams.subscribe((params) => {
      this.firId = params['fir_id'] || null;
      if (this.firId) {
        this.loadVictims(this.firId);
      } else {
        Swal.fire('Error', 'FIR ID is missing in the query parameters!', 'error');
      }
    });
  }

  onVictimAgeChange(index: number): void {
    const victimGroup = this.victims.at(index) as FormGroup;
    const ageControl = victimGroup.get('age');
    const nameControl = victimGroup.get('victim_name');

    if (ageControl) {
      const ageValue = ageControl.value;

      // If age is below 18, disable the name field
      if (ageValue < 18) {
        nameControl?.disable({ emitEvent: false });
        nameControl?.reset();
      } else {
        nameControl?.enable({ emitEvent: false });
      }

      this.cdr.detectChanges(); // Trigger change detection
    }
  }

  submitModalVictims(): void {
    if (this.modalVictimForm.valid) {
      const payload = {
        fir_id: this.firId, // Pass the FIR ID
        number_of_victims: this.modalVictimForm.get('numberOfVictims')?.value, // Total count of victims
        victims: this.modalVictimForm.get('victims')?.value, // Array of victim details
      };

      // Call service to update victims
      this.alteredCaseService.updateVictimCountAndDetails(payload).subscribe(
        (response) => {
          Swal.fire('Success', 'Victim count and details updated successfully!', 'success');
          this.modalVictimForm.reset(); // Reset form
          this.modalVictims.clear(); // Clear modal victim array
          this.closeModal(); // Close modal
        },
        (error) => {
          Swal.fire('Error', 'Failed to update victim count and details.', 'error');
        }
      );
    } else {
      Swal.fire('Error', 'Please fill all required fields in the modal form.', 'error');
    }
  }



  // Allow only letters for the name input
  allowOnlyLetters(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Allow only uppercase (A-Z), lowercase (a-z), and space (charCode 32)
    if (
      !(charCode >= 65 && charCode <= 90) && // A-Z
      !(charCode >= 97 && charCode <= 122) && // a-z
      charCode !== 32 // space
    ) {
      event.preventDefault(); // Prevent the character from being entered
    }
  }

  // Allow only numbers for the mobile number input
  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    // Allow only numbers (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Prevent the character from being entered
    }
  }

  loadDropdownOptions(): void {
    // Load Nature of Offence options
    this.alteredCaseService.getNatureOfOffenceOptions().subscribe(
      (data: any[]) => {
        this.natureOfOffenceOptions = data.map((item) => ({
          offence_name: item.offence_name,
        }));
      },
      (error) => console.error('Failed to load Nature of Offence options', error)
    );

    // Load SC/ST Sections options
    this.alteredCaseService.getSCSTSectionsOptions().subscribe(
      (data: any[]) => {
        this.scstSectionsOptions = data.map((item) => ({
          section_name: item.offence_act_name,
        }));
      },
      (error) => console.error('Failed to load SC/ST Sections options', error)
    );
  }

  loadCasteSections() {
    this.firService.getCastes().subscribe(
      (castes: any[]) => {
        this.victimCasteOptions = castes.map((caste: any) => caste.caste_name); // Ensure the correct column name from the caste table
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load caste options.', 'error');
      }
    );
  }


  loadNatureOfOffences() {
    this.firService.getOffences().subscribe(
      (offences: any[]) => {
        this.victimOffenceOptions = offences.map((offence: any) => offence.offence_name);
        console.log('Nature of Offence Options:', this.victimOffenceOptions); // Debug log
        this.cdr.detectChanges(); // Trigger change detection after data is fetched
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load Nature of Offence options.', 'error');
      }
    );
  }


  loadVictimNames(): void {
    if (!this.firId) {
      console.error('FIR ID is missing.');
      return;
    }

    this.alteredCaseService.getVictimNamesByFirId(this.firId).subscribe(
      (data: { name: string; isSelected: number }[]) => {
        this.victimNames = data; // Keep isSelected as a number
        const selectedNames = this.victimNames.filter((victim) => victim.isSelected === 1).map((victim) => victim.name);

        // Pre-fill the form control with selected names
        this.alteredCaseForm.get('deceasedPersonNames')?.setValue(selectedNames);

        console.log('Loaded Victim Names:', this.victimNames); // Debug log
        this.cdr.detectChanges(); // Trigger change detection
      },
      (error) => {
        console.error('Failed to load victim names:', error);
        Swal.fire('Error', 'Failed to load victim names.', 'error');
      }
    );
  }





  get deceasedPersonNamesControl(): FormArray {
    return this.alteredCaseForm.get('deceasedPersonNames') as FormArray;
  }



  loadnativedistrict() {
    this.firService.getPoliceRevenue().subscribe(
      (Native: any) => {
        this.policeStations = Native.map((Native: any) => Native.revenue_district_name);
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load offence options.', 'error');
      }
    );
  }

  loadVictims(firId: string): void {
    this.alteredCaseService.getVictimsByFirId(firId).subscribe(
      (data: any[]) => {
        this.victims.clear();
        data.forEach((victim) => {
          this.victims.push(
            this.fb.group({
              victim_id: [victim.victim_id],
              victim_name: [victim.victim_name],
              age: [victim.age, Validators.required],
              gender: [victim.gender, Validators.required],
              mobileNumber: [victim.mobileNumber],
              community: [victim.community, Validators.required],
              caste: [victim.caste, Validators.required],
              offence_committed: [
                Array.isArray(victim.offence_committed)
                  ? victim.offence_committed
                  : JSON.parse(victim.offence_committed || '[]'),
                Validators.required,
              ],
              scst_sections: [
                Array.isArray(victim.scst_sections)
                  ? victim.scst_sections
                  : JSON.parse(victim.scst_sections || '[]'),
                Validators.required,
              ],
              fir_stage_as_per_act: [victim.fir_stage_as_per_act || ''],
              fir_stage_ex_gratia: [victim.fir_stage_ex_gratia || ''],
              chargesheet_stage_as_per_act: [victim.chargesheet_stage_as_per_act || ''],
              chargesheet_stage_ex_gratia: [victim.chargesheet_stage_ex_gratia || ''],
              final_stage_as_per_act: [victim.final_stage_as_per_act || ''],
              final_stage_ex_gratia: [victim.final_stage_ex_gratia || ''],
              alteredSections: [victim.sectionsIPC || '', Validators.required],
            })
          );
        });
        this.cdr.detectChanges(); // Trigger change detection manually
      },
      (error) => Swal.fire('Error', 'Failed to load victims data!', 'error')
    );
  }



  // Handle SC/ST Section change
  handleSCSTSectionChange(event: any, index: number): void {
    const selectedSections = event.value;
    const victimGroup = this.victims.at(index) as FormGroup;

    if (selectedSections && selectedSections.length > 0) {
      this.alteredCaseService.getOffenceActsBySections(selectedSections).subscribe(
        (response: any[]) => {
          if (response.length > 0) {
            const matchedAct = response[0];
            victimGroup.patchValue({
              fir_stage_as_per_act: matchedAct.fir_stage_as_per_act,
              fir_stage_ex_gratia: matchedAct.fir_stage_ex_gratia,
              chargesheet_stage_as_per_act: matchedAct.chargesheet_stage_as_per_act,
              chargesheet_stage_ex_gratia: matchedAct.chargesheet_stage_ex_gratia,
              final_stage_as_per_act: matchedAct.final_stage_as_per_act,
              final_stage_ex_gratia: matchedAct.final_stage_ex_gratia,
            });
          }
        },
        (error: any) => {
          console.error('Error fetching offence acts:', error);
        }
      );
    } else {
      victimGroup.patchValue({
        fir_stage_as_per_act: '',
        fir_stage_ex_gratia: '',
        chargesheet_stage_as_per_act: '',
        chargesheet_stage_ex_gratia: '',
        final_stage_as_per_act: '',
        final_stage_ex_gratia: '',
      });
    }
  }



  handleVictimSCSTSectionChange(event: any, index: number): void {
    const selectedSection = event.target.value; // Selected value from dropdown
    const victimGroup = this.modalVictims.at(index) as FormGroup;

    if (selectedSection) {
      this.alteredCaseService.getOffenceActsBySections([selectedSection]).subscribe(
        (response: any[]) => {
          if (response.length > 0) {
            const matchedAct = response[0]; // Use the first matched act
            victimGroup.patchValue({
              fir_stage_as_per_act: matchedAct.fir_stage_as_per_act,
              fir_stage_ex_gratia: matchedAct.fir_stage_ex_gratia,
              chargesheet_stage_as_per_act: matchedAct.chargesheet_stage_as_per_act,
              chargesheet_stage_ex_gratia: matchedAct.chargesheet_stage_ex_gratia,
              final_stage_as_per_act: matchedAct.final_stage_as_per_act,
              final_stage_ex_gratia: matchedAct.final_stage_ex_gratia
            });
          }
        },
        (error: any) => {
          console.error('Error fetching offence acts:', error);
        }
      );
    } else {
      // Reset values if no section is selected
      victimGroup.patchValue({
        fir_stage_as_per_act: '',
        fir_stage_ex_gratia: '',
        chargesheet_stage_as_per_act: '',
        chargesheet_stage_ex_gratia: '',
        final_stage_as_per_act: '',
        final_stage_ex_gratia: ''
      });
    }
  }



  // Handle file input change
  onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.alteredCaseForm.patchValue({ alterationCopy: file });
    }
  }

  onSubmit(): void {
    if (this.alteredCaseForm.valid) {
      const payload = {
        fir_id: this.firId,
        victims: this.alteredCaseForm.value.victims,
      };

      this.alteredCaseService.updateVictims(payload).subscribe(
        () => {
          Swal.fire('Success', 'Victim details updated successfully!', 'success').then(() => {
            // Reset the form
            this.resetForm();

            // Navigate to the FIR list page
            this.navigateToFirList();
          });
        },
        (error) => Swal.fire('Error', 'Failed to update victim details!', 'error')
      );
    } else {
      Swal.fire('Error', 'Please fill all required fields.', 'error');
    }
  }

  // Reset the form
  resetForm(): void {
    this.alteredCaseForm.reset();
    this.victims.clear();
    this.addModalVictim(); // Add a blank victim group if required
  }

  // Navigate to the FIR list page
  navigateToFirList(): void {
    this.router.navigate(['widgets-examples/fir-list']);
  }

  loadOffenceActs(): void {
    this.firService.getOffenceActs().subscribe(
      (acts: any[]) => {
        this.offenceActsOptions = acts; // Assign fetched data to `offenceActsOptions`
        console.log('Fetched Offence Acts:', this.offenceActsOptions); // Debug log
      },
      (error: any) => {
        console.error('Failed to load offence acts:', error);
      }
    );
  }







  openModal(modalType: string): void {
    if (modalType === 'victim') {
      this.modalVictims.clear(); // Clear modal victims
      this.modalVictimForm.reset({ numberOfVictims: 1 }); // Reset form and set default victim count
      this.addModalVictim(); // Add the first victim by default
      this.loadnativedistrict();
      this.loadNatureOfOffences();
      this.loadCasteSections();
      this.loadOffenceActs();

      this.modalService.open(this.victimModal, { size: 'xl', backdrop: 'static' }); // Open Victim Modal
    } else if (modalType === 'accused') {
      this.modalAccuseds.clear(); // Clear modal accuseds
      this.modalAccusedForm.reset({ numberOfAccused: 1 }); // Reset form and set default accused count
      this.addAccused(); // Add the first accused by default

      this.modalService.open(this.accusedModal, { size: 'xl', backdrop: 'static' }); // Open Accused Modal
    } else {
      console.error('Invalid modal type provided!');
    }
  }

  closeModal(): void {
    this.modalService.dismissAll(); // Close all open modals
  }


  submitModalAccused(): void {
    if (this.modalAccusedForm.valid) {
      const accusedData = {
        firId: this.firId, // Pass the FIR ID
        numberOfAccused: this.modalAccusedForm.get('numberOfAccused')?.value,
        accuseds: this.modalAccusedForm.get('accuseds')?.value,
      };

      this.alteredCaseService.saveAccusedData(accusedData).subscribe(
        (response) => {
          console.log('Response:', response);
          Swal.fire('Success', 'Accused data saved successfully!', 'success');
          this.closeModal();
        },
        (error) => {
          console.error('Failed to save accused data:', error);
          Swal.fire('Error', 'Failed to save accused data.', 'error');
        }
      );
    } else {
      console.error('Form is invalid!');
      Swal.fire('Error', 'Please fill all required fields.', 'error');
    }
  }


  // Dynamically Adjust Victims Based on Count
  onNumberOfVictimsChange(): void {
    const victimCount = this.modalVictimForm.get('numberOfVictims')?.value || 0;
    const currentLength = this.modalVictims.length;

    if (victimCount > currentLength) {
      for (let i = currentLength; i < victimCount; i++) {
        this.addModalVictim();
      }
    } else if (victimCount < currentLength) {
      for (let i = currentLength - 1; i >= victimCount; i--) {
        this.modalVictims.removeAt(i);
      }
    }
    this.cdr.detectChanges(); // Trigger change detection to update the view
  }

  isVictimNameInvalid(index: number): boolean {
    const nameControl = this.victims.at(index).get('victim_name');
    return nameControl?.invalid && nameControl?.touched ? true : false;
  }

  isVictimMobileInvalid(index: number): boolean {
    const mobileControl = this.victims.at(index)?.get('mobileNumber');
    return !!(mobileControl?.invalid && mobileControl?.touched);
  }

  isGuardianNameInvalid(index: number): boolean {
    const guardianNameControl = this.victims.at(index).get('guardianName');
    return guardianNameControl?.invalid && guardianNameControl?.touched ? true : false;
  }

  isVictimPincodeInvalid(index: number): boolean {
    const pincodeControl = this.victims.at(index)?.get('victimPincode');
    return !!(pincodeControl?.invalid && pincodeControl?.touched);
  }

  onNativeDistrictSameChange(index: number) {
    const victim = this.victims.at(index);
    const isNativeDistrictSame = victim.get('isNativeDistrictSame')?.value;

    if (isNativeDistrictSame === 'yes') {
      // If "Yes", reset and disable the Native District field
      victim.get('nativeDistrict')?.reset();
      victim.get('nativeDistrict')?.clearValidators();
    } else if (isNativeDistrictSame === 'no') {
      // If "No", make Native District field required
      victim.get('nativeDistrict')?.setValidators(Validators.required);
    }

    victim.get('nativeDistrict')?.updateValueAndValidity(); // Update the validation state
  }
  onAccusedAgeChange(index: number): void {
    const accusedGroup = this.modalAccuseds.at(index) as FormGroup; // Use modalAccuseds instead of accuseds
    if (!accusedGroup) {
      console.error(`Accused at index ${index} is undefined`);
      return; // Exit the method if undefined
    }

    const ageControl = accusedGroup.get('age');
    const nameControl = accusedGroup.get('name');

    if (ageControl && nameControl) {
      const ageValue = ageControl.value;

      // If age is below 18, disable the name field
      if (ageValue < 18) {
        nameControl.disable({ emitEvent: false });
        nameControl.reset();
      } else {
        nameControl.enable({ emitEvent: false });
      }
    }
  }




  isPincodeInvalid(index: number): boolean {
    if (!this.accuseds || this.accuseds.length <= index) {
      return false; // Index is out of bounds, return false
    }

    const pincodeControl = this.accuseds.at(index).get('pincode');
    return (pincodeControl?.touched ?? false) && !(pincodeControl?.valid ?? true);
  }



  onPreviousIncidentsChange(index: number): void {
    const accusedGroup = this.modalAccuseds.at(index) as FormGroup; // Use modalAccuseds instead of accuseds
    if (!accusedGroup) {
      console.error(`Accused at index ${index} is undefined`);
      return; // Exit the method if undefined
    }

    const previousIncident = accusedGroup.get('previousIncident')?.value;

    if (previousIncident === 'true') { // Ensure you're checking the string value
      // If "Yes", make the previous FIR fields required
      accusedGroup.get('previousFIRNumber')?.setValidators(Validators.required);
      accusedGroup.get('previousFIRNumberSuffix')?.setValidators(Validators.required);
    } else {
      // If "No", reset and clear validators for the previous FIR fields
      accusedGroup.get('previousFIRNumber')?.reset();
      accusedGroup.get('previousFIRNumber')?.clearValidators();
      accusedGroup.get('previousFIRNumberSuffix')?.reset();
      accusedGroup.get('previousFIRNumberSuffix')?.clearValidators();
    }

    accusedGroup.get('previousFIRNumber')?.updateValueAndValidity();
    accusedGroup.get('previousFIRNumberSuffix')?.updateValueAndValidity();
  }


  onScstOffencesChange(index: number): void {
    const accusedGroup = this.modalAccuseds.at(index) as FormGroup; // Use modalAccuseds instead of accuseds
    if (!accusedGroup) {
      console.error(`Accused at index ${index} is undefined`);
      return; // Exit the method if undefined
    }

    const scstOffence = accusedGroup.get('scstOffence')?.value;

    if (scstOffence === 'true') { // Ensure you're checking the string value
      // If "Yes", make the SC/ST FIR fields required
      accusedGroup.get('scstFIRNumber')?.setValidators(Validators.required);
      accusedGroup.get('scstFIRNumberSuffix')?.setValidators(Validators.required);
    } else {
      // If "No", reset and clear validators for the SC/ST FIR fields
      accusedGroup.get('scstFIRNumber')?.reset();
      accusedGroup.get('scstFIRNumber')?.clearValidators();
      accusedGroup.get('scstFIRNumberSuffix')?.reset();
      accusedGroup.get('scstFIRNumberSuffix')?.clearValidators();
    }

    accusedGroup.get('scstFIRNumber')?.updateValueAndValidity();
    accusedGroup.get('scstFIRNumberSuffix')?.updateValueAndValidity();
  }

}
