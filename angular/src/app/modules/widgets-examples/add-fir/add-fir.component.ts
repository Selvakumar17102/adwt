import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, TemplateRef, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationStart, Event as RouterEvent } from '@angular/router';
import { FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';
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
import { FirService } from 'src/app/services/fir.service';

import Swal from 'sweetalert2';
import { MatRadioModule } from '@angular/material/radio';
import Tagify from '@yaireo/tagify';
declare var $: any;


import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-add-fir',
  templateUrl: './add-fir.component.html',
  styleUrls: ['./add-fir.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    NgxFileDropModule
  ],
})
export class AddFirComponent implements OnInit, OnDestroy {

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  remainingCharacters: number[] = [];
  showOtherGender: boolean[] = [];
  mainStep: number = 1;
  step: number = 1;
  firForm: FormGroup;
  firId: string | null = null;
  userId: string = '';
  loading: boolean = false;
  yearOptions: number[] = [];
  today: string = '';
  nextButtonDisabled: boolean = true;
  victimNames: string[] = [];
  nextButtonClicked: boolean = false; // Track if 'Next' was clicked
  tabNavigation: boolean = false; // Track if main tab is clicked
  numberOfVictims: number = 0;
  scstDetails: any = null;
  showJudgementCopy: boolean = false;
  showLegalOpinionObtained: boolean = false;
  showCaseFitForAppeal: boolean = false;
  showGovernmentApproval: boolean = false;
  showFiledBy: boolean = false;
  showDesignatedCourt: boolean = false;
  courtDivisions: string[] = [];
  courtRanges: string[] = [];
  proceedingsFile: File | null = null;
  showDuplicateSection_1: boolean = false;
  showLegalOpinionObtained_two: boolean = false;
  showFiledBy_two: boolean = false;
  showDesignatedCourt_two: boolean = false;
  showCaseFitForAppeal_two: boolean = false;
  showOtherVictimGender: boolean[] = [];
  hideCompensationSection: boolean = false;
  accusedCommunitiesOptions: string[] = []; // Stores all accused community options
  natureOfOffenceOptions: string[] = [];
  scstSectionsOptions: string[] = [];

  showDuplicateSection = false; // To show/hide the duplicate form section
  showLegalOpinionObtained_one = false;
  showFiledBy_one = false;
  showDesignatedCourt_one = false;
  showCaseFitForAppeal_one = false;
  imagePreviews: any[] = [];
  isFileOver: boolean = false;
  communitiesOptions: string[] = [];
  isSticky: boolean = false;
  additionalReliefOptions = [
    { value: 'Pension', label: 'Pension' },
    { value: 'Employment / Job', label: 'Employment / Job' },
    { value: 'Education concession', label: 'Education concession' },
    { value: 'Provisions', label: 'Provisions' },
    { value: 'House site Patta', label: 'House site Patta' }
  ];

  // Tabs for step navigation
  tabs = [
    { label: 'Basic Information' },
    { label: 'Offence Information' },
    { label: 'Victim Information' },
    { label: 'Accused Information' },
    { label: 'FIR Stage(MRF) Details' },
  ];


  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const element = document.getElementById('sticky-tabs');
    if (element) {
      this.isSticky = window.scrollY > element.offsetTop;
    }
  }

  @ViewChild('tagifyInput', { static: false }) tagifyInput!: ElementRef;
  sectionsIPC: string[] = []; // Array to store multiple tags


  // Dropdown options
  policeCities: string[] = [];
  policeZones: string[] = [];
  policeRanges: string[] = [];
  revenueDistricts: string[] = [];
  offenceOptions: string[] = [];
  offenceActsOptions: { offence_act_name: string; [key: string]: any }[] = [];
  courtDistricts: string[] = [];

  alphabetList: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  stationNumbers: number[] = Array.from({ length: 99 }, (_, k) => k + 1);
  firNumberOptions: number[] = Array.from({ length: 99 }, (_, k) => k + 1);
  selectedAdditionalReliefs: string[] = [];
  policeStations: string[] = [];
  victimCountArray: number[] = [];
i: number;
  constructor(
    private fb: FormBuilder,
    private firService: FirService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal
  ) {}



  triggerChangeDetection() {
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    this.generateVictimCount();
    this.clearSession();
    //console.log('Session cleared on component initialization');
    this.initializeForm();
    this.firId = this.getFirIdFromSession(); // Get FIR ID from session storage
    this.loadOptions();
    this.loadOffenceActs();
    this.loadAccusedCommunities();
    // this.loadScstSections();
    this.generateYearOptions();
    this.loadnativedistrict();
    //this.loadCourtDistricts();
    this.loadCourtDivisions();
    this.loadCommunities();
    this.loadDistricts();
    this.updateValidationForCaseType();



    const preFilledDistrict = this.firForm.get('policeCity')?.value; // Get pre-filled district
    if (preFilledDistrict) {
      this.loadPoliceStations(preFilledDistrict); // Load stations for the pre-filled district
    }

    // Watch for district changes and reload stations dynamically
    this.firForm.get('policeCity')?.valueChanges.subscribe((district) => {
      this.loadPoliceStations(district);
    });

    // this.loadVictimsDetails();

    this.firForm.get('caseType')?.valueChanges.subscribe(() => {
      this.handleCaseTypeChange();
    });
    if (this.firId) {
      //console.log(`Using existing FIR ID: ${this.firId}`);
    } else {
      //console.log('Creating a new FIR entry');
    }

    // Listen for route changes
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this.clearSession();
      }
    });

    this.userId = sessionStorage.getItem('userId') || '';
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];
    if (this.userId) {
      this.loadUserData();
    }
    this.ngAfterViewInit();
    this.trackStep1FormValidity();
    this.firForm.statusChanges.subscribe(() => {
      if (!this.tabNavigation) {
        // Only validate when not navigating tabs
        this.nextButtonDisabled = !this.isStepValid();
        this.cdr.detectChanges();
      }
    });


  }

  navigateToMainStep(stepNumber: number): void {
    this.mainStep = stepNumber; // Update mainStep
    this.step = 1; // Reset sub-step to 1 when switching main steps
    this.cdr.detectChanges(); // Trigger UI update
}


  generateVictimCount(): void {
    this.victimCountArray = Array.from({ length: 50 }, (_, i) => i + 1);
}

loadCommunities(): void {
  this.firService.getAllCommunities().subscribe(
    (communities: string[]) => {
      this.communitiesOptions = communities; // Populate community options
    },
    (error) => {
      console.error('Error loading communities:', error);
      Swal.fire('Error', 'Failed to load communities.', 'error');
    }
  );
}

onCommunityChange(event: any, index: number): void {
  const selectedCommunity = event.target.value;

  if (selectedCommunity) {
    this.firService.getCastesByCommunity(selectedCommunity).subscribe(
      (castes: string[]) => {
        const victimGroup = this.victims.at(index) as FormGroup;
        victimGroup.patchValue({ caste: '' }); // Reset caste selection
        victimGroup.get('availableCastes')?.setValue(castes); // Dynamically update caste options
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching castes:', error);
        Swal.fire('Error', 'Failed to load castes for the selected community.', 'error');
      }
    );
  }
}

loadDistricts(): void {
  this.firService.getDistricts().subscribe(
    (districts: string[]) => {
      this.courtDistricts = districts; // Populate district options
    },
    (error) => {
      console.error('Error loading districts:', error);
      Swal.fire('Error', 'Failed to load district details.', 'error');
    }
  );
}
loadAccusedCommunities(): void {
  this.firService.getAllAccusedCommunities().subscribe(
    (communities: string[]) => {
      this.accusedCommunitiesOptions = communities; // Populate accused community options
    },
    (error) => {
      console.error('Error loading accused communities:', error);
      Swal.fire('Error', 'Failed to load accused communities.', 'error');
    }
  );
}




onAccusedCommunityChange(event: any, index: number): void {
  const selectedCommunity = event.target.value;

  if (selectedCommunity) {
    this.firService.getAccusedCastesByCommunity(selectedCommunity).subscribe(
      (castes: string[]) => {
        const accusedGroup = this.accuseds.at(index) as FormGroup;
        accusedGroup.patchValue({ caste: '' }); // Reset caste selection
        accusedGroup.get('availableCastes')?.setValue(castes); // Dynamically update caste options
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching accused castes:', error);
        Swal.fire('Error', 'Failed to load castes for the selected accused community.', 'error');
      }
    );
  }
}

loadCourtDivisions(): void {
  this.firService.getCourtDivisions().subscribe(
    (divisions: string[]) => {
      this.courtDivisions = divisions; // Populate court division options
    },
    (error) => {
      console.error('Error loading court divisions:', error);
      Swal.fire('Error', 'Failed to load court divisions.', 'error');
    }
  );
}

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: any): void {
    this.clearSession();
  }

  getFirIdFromSession(): string | null {
    return sessionStorage.getItem('firId');
  }

  onCourtDivisionChange(event: any): void {
    const selectedDivision = event.target.value;

    if (selectedDivision) {
      this.firService.getCourtRangesByDivision(selectedDivision).subscribe(
        (ranges: string[]) => {
          this.courtRanges = ranges; // Populate court range options based on division
          this.firForm.patchValue({ courtRange: '' }); // Reset court range selection
        },
        (error) => {
          console.error('Error fetching court ranges:', error);
          Swal.fire('Error', 'Failed to load court ranges for the selected division.', 'error');
        }
      );
    }
  }

// Dynamically adjust validators based on caseType
updateValidationForCaseType() {
  const caseType = this.firForm.get('caseType')?.value;

  if (caseType === 'chargeSheet') {
    this.firForm.get('proceedingsFileNo_1')?.setValidators([Validators.required]);
    this.firForm.get('proceedingsDate_1')?.setValidators([Validators.required]);
    this.firForm.get('uploadProceedings_1')?.setValidators([Validators.required]);
    this.firForm.get('attachments_1')?.setValidators([Validators.required]);

    // Disable RCS specific fields if it's a chargeSheet
    this.firForm.get('rcsFileNumber')?.clearValidators();
    this.firForm.get('rcsFilingDate')?.clearValidators();
    this.firForm.get('mfCopy')?.clearValidators();
  } else if (caseType === 'referredChargeSheet') {
    // Clear required validators for chargeSheet fields
    this.firForm.get('proceedingsFileNo_1')?.clearValidators();
    this.firForm.get('proceedingsDate_1')?.clearValidators();
    this.firForm.get('uploadProceedings_1')?.clearValidators();
    this.firForm.get('attachments_1')?.clearValidators();

    // Add required validators for RCS fields
    this.firForm.get('rcsFileNumber')?.setValidators([Validators.required]);
    this.firForm.get('rcsFilingDate')?.setValidators([Validators.required]);
    this.firForm.get('mfCopy')?.setValidators([Validators.required]);
  }

  // Update the form controls after changing validators
  this.firForm.get('proceedingsFileNo_1')?.updateValueAndValidity();
  this.firForm.get('proceedingsDate_1')?.updateValueAndValidity();
  this.firForm.get('uploadProceedings_1')?.updateValueAndValidity();
  this.firForm.get('attachments_1')?.updateValueAndValidity();
  this.firForm.get('rcsFileNumber')?.updateValueAndValidity();
  this.firForm.get('rcsFilingDate')?.updateValueAndValidity();
  this.firForm.get('mfCopy')?.updateValueAndValidity();
}

onCaseTypeChange() {
  this.updateValidationForCaseType(); // Update validations whenever caseType is changed
}


  clearSession(): void {
    //console.log('Clearing session data for FIR and officer IDs');
    sessionStorage.removeItem('firId');
    sessionStorage.removeItem('officerIds');
  }

  ngOnDestroy(): void {
    this.clearSession();
  }


  checkFormValidity() {
    // Enable the "Next" button only if the form is valid and it's Step 1
    this.nextButtonDisabled = !(this.firForm.valid && this.step === 1);
    this.cdr.detectChanges(); // Trigger change detection
  }







  // Save Step 1 and track officer IDs after the first save
  saveStepOneAsDraft() {
    const firData = {
      ...this.firForm.value,


    };

    //console.log('Saving Step 1 data as draft:', firData);

    this.firService.handleStepOne(this.firId, firData).subscribe(
      (response: any) => {
        //console.log('Response from backend after saving Step 1:', response);

        // Save FIR ID to session storage
        this.firId = response.fir_id;
        if (this.firId) {
          sessionStorage.setItem('firId', this.firId);
          //console.log('Saved FIR ID to session:', this.firId);
        }

        Swal.fire('Success', 'FIR saved as draft for step 1.', 'success');
      },
      (error) => {
        //console.error('Error saving FIR for step 1:', error);
        Swal.fire('Error', 'Failed to save FIR as draft for step 1.', 'error');
      }
    );
  }









// Method to save step 2 as draft
saveStepTwoAsDraft() {
  const firData = {
    firNumber: this.firForm.value.firNumber,
    firNumberSuffix: this.firForm.value.firNumberSuffix,
    dateOfOccurrence: this.firForm.value.dateOfOccurrence,
    timeOfOccurrence: this.firForm.value.timeOfOccurrence,
    placeOfOccurrence: this.firForm.value.placeOfOccurrence,
    dateOfRegistration: this.firForm.value.dateOfRegistration,
    timeOfRegistration: this.firForm.value.timeOfRegistration,

  };

  this.firService.handleStepTwo(this.firId, firData).subscribe(
    (response: any) => {
      this.firId = response.fir_id; // Update FIR ID from backend response
      if (this.firId) {
        sessionStorage.setItem('firId', this.firId); // Save FIR ID in session
      }
      Swal.fire('Success', 'FIR saved as draft for step 2.', 'success');
    },
    (error) => {
      //console.error('Error saving FIR for step 2:', error);
      Swal.fire('Error', 'Failed to save FIR as draft for step 2.', 'error');
    }
  );
}

ngAfterViewInit(): void {
  setTimeout(() => {
    if (this.tagifyInput && this.tagifyInput.nativeElement) {
      $(this.tagifyInput.nativeElement).tagsinput({
        maxTags: 10,
        trimValue: true,
      });

      // Listen to the 'itemAdded' and 'itemRemoved' events for sectionsIPC
      $(this.tagifyInput.nativeElement).on('itemAdded', (event: any) => {
        this.sectionsIPC.push(event.item);
        this.updateSectionsIPCControl();
      });

      $(this.tagifyInput.nativeElement).on('itemRemoved', (event: any) => {
        this.sectionsIPC = this.sectionsIPC.filter(tag => tag !== event.item);
        this.updateSectionsIPCControl();
      });
    }
  }, 0);
}

// Update the form control for sectionsIPC
updateSectionsIPCControl(): void {
  this.firForm.get('sectionsIPC')?.setValue(this.sectionsIPC.join(', '));
}



onFileSelect_3(event: Event, controlName: string): void {
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (files && files.length > 0) {
    this.firForm.get(controlName)?.setValue(files[0]);
  } else {
    this.firForm.get(controlName)?.setValue(null);
  }
}




  // Handle file selection
  onFileSelect(event: any, index: number): void {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const attachmentGroup = this.attachments.at(index) as FormGroup;

      // Simulate a file path (you might have an actual path from the file upload response in real scenarios)
      const simulatedFilePath = `/uploads/${file.name}`;

      // Patch the values to the form group
      attachmentGroup.patchValue({
        fileName: file.name, // File name
        filePath: simulatedFilePath, // Simulated file path
      });

      // Trigger change detection to update the UI
      this.cdr.detectChanges();
    }
  }



  onVictimAgeChange(index: number): void {
    const victimGroup = this.victims.at(index) as FormGroup;
    const ageControl = victimGroup.get('age');
    const nameControl = victimGroup.get('name');

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




  loadPoliceStations(district: string): void {
    if (district) {
      this.firService.getPoliceStations(district).subscribe(
        (stations: string[]) => {
          // Format station names
          this.policeStations = stations.map(station =>
            station.replace(/\s+/g, '-')); // Replace spaces with "-"
          this.firForm.get('stationName')?.setValue(''); // Reset selected station if district changes
          this.cdr.detectChanges(); // Trigger UI update
        },
        (error) => {
          console.error('Error fetching police stations:', error);
        }
      );
    }
  }



  onAccusedAgeChange(index: number): void {
    const accusedGroup = this.accuseds.at(index) as FormGroup;
    const ageControl = accusedGroup.get('age');
    const nameControl = accusedGroup.get('name');

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



  initializeForm() {
    this.firForm = this.fb.group({
      // Step 1 Fields - Police Location Details
      policeCity: ['', Validators.required],
      policeZone: ['', Validators.required],
      policeRange: ['', Validators.required],
      revenueDistrict: ['', Validators.required],
      //alphabetSelection: ['', Validators.required],
      //stationNumber: ['', Validators.required],
      stationName: ['', Validators.required],
      officerName: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]], // Name validation
      officerDesignation: ['', Validators.required], // Dropdown selection
      officerPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // 10-digit phone validation

      attachments_1: this.fb.array([this.createAttachmentGroup()]),
      attachments_2: this.fb.array([this.createAttachmentGroup_2()]),
      // Step 2 Fields - FIR Details
      firNumber: ['', Validators.required],
      firNumberSuffix: ['', Validators.required],
      dateOfOccurrence: ['', [Validators.required, this.maxDateValidator()]],
      timeOfOccurrence: ['', Validators.required],
      placeOfOccurrence: ['', Validators.required],
      dateOfRegistration: ['', Validators.required],
      timeOfRegistration: ['', Validators.required],


      scstSections: [[], Validators.required],



      // Step 3 Fields - Complainant and Victim Details
      complainantDetails: this.fb.group({
        nameOfComplainant: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]],
        mobileNumberOfComplainant: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        isVictimSameAsComplainant: [false],
        numberOfVictims: [1, Validators.required],
      }),
      victims: this.fb.array([this.createVictimGroup()]),
      // victims_1: this.fb.array([this.createVictimGroup()]),
      // victims_2: this.fb.array([this.createVictimGroup()]),
      isDeceased: ['', Validators.required],
      deceasedPersonNames: [[]],

      // Step 4 Fields - Accused Details
      numberOfAccused: [1, Validators.required],
      accuseds: this.fb.array([]),
      uploadFIRCopy: ['', Validators.required],

      // Step 5 Fields - Victim Relief and Compensation Details
      victimsRelief: this.fb.array([this.createVictimReliefGroup()]),

      reliefAmountScst: ['', Validators.required],
      reliefAmountExGratia: ['', Validators.required],
      reliefAmountFirstStage: ['', Validators.required],
      //reliefAmountSecondStage: ['', Validators.required],
      totalCompensation: ['', Validators.required],
      additionalRelief: [[]],

      totalCompensation_1: [''], // Example control
      proceedingsFileNo_1: [''], // Example control
      proceedingsDate_1: [''], // Example control
      uploadProceedings_1: [''], // Example control

      totalCompensation_2: [''], // Example control
      proceedingsFileNo_2: [''], // Example control
      proceedingsDate_2: [''], // Example control
      uploadProceedings_2: [''], // Example control

      // Charge Sheet Details
      chargeSheetFiled: ['', Validators.required],
      courtDistrict: ['', Validators.required],
      courtName: ['', Validators.required],
      caseType: ['', Validators.required], // Charge Sheet or Referred Charge Sheet
      caseNumber: [{ value: '', disabled: true }], // Dynamic field for Charge Sheet
      rcsFileNumber: [{ value: '', disabled: true }], // Dynamic field for RCS
      rcsFilingDate: [{ value: '', disabled: true }], // Dynamic field for RCS
      mfCopy: [{ value: '', disabled: true }], // File upload field for RCS



      // Step 6 Fields - Case Trial and Court Details
      Court_name: ['', Validators.required],
      trialCourtDistrict: ['', Validators.required],
      trialCaseNumber: ['', Validators.required],
      publicProsecutor: ['', Validators.required],
      prosecutorPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

      firstHearingDate: ['', Validators.required],
      judgementAwarded: ['', Validators.required],
      judgementAwarded1: ['', Validators.required],
      judgementAwarded2: ['', Validators.required],
      judgementAwarded3: ['', Validators.required],


      judgementDetails: this.fb.group({
        judgementNature: ['', Validators.required],
        uploadJudgement: [''],
        legalOpinionObtained: [''],
        caseFitForAppeal: [''],
        governmentApprovalForAppeal: [''],
        filedBy: [''],
        designatedCourt: [''],

      }),

      // New fields for the duplicated form

    courtDistrict_one: ['', Validators.required],
    caseNumber_one: ['', Validators.required],
    publicProsecutor_one: ['', Validators.required],
    prosecutorPhone_one: ['', Validators.required],
    firstHearingDate_one: ['', Validators.required],
    Court_one: ['', Validators.required],


    courtDistrict_two: ['', Validators.required],
    caseNumber_two: ['', Validators.required],
    publicProsecutor_two: ['', Validators.required],
    prosecutorPhone_two: ['', Validators.required],
    firstHearingDate_two: ['', Validators.required],



     // Top-level control
      judgementAwarded_one: ['', Validators.required],
      judgementDetails_one: this.fb.group({
      judgementNature_one: ['', Validators.required],
      uploadJudgement_one: [''],
      legalOpinionObtained_one: [''],
      caseFitForAppeal_one: [''],
      filedBy_one: [''],

      designatedCourt_one: [''],
      prosecutorPhone_one: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      firstHearingDate_one: ['', Validators.required],
      governmentApprovalForAppeal_one:['', Validators.required],
    }),
    Court_three:[''],
    judgementAwarded_two: ['', Validators.required],
    judgementDetails_two: this.fb.group({
      judgementNature_two: [''],
      uploadJudgement_two: [''],
      legalOpinionObtained_two: [''],
      caseFitForAppeal_two: [''],
      governmentApprovalForAppeal_two: [''],
      filedBy_two: [''],





    }),


    hearingDetails: this.fb.array([this.createHearingDetailGroup()]),
    hearingDetails_one: this.fb.array([this.createHearingDetailGroup_one()]),
    hearingDetails_two: this.fb.array([this.createHearingDetailGroup_two()]),


      // Victim Relief - 3rd Stage
      reliefAmountThirdStage: ['', Validators.required],
      totalCompensationThirdStage: ['', Validators.required],

      // Proceedings and Attachments
      proceedingsFileNo: ['', Validators.required],
      proceedingsFile: ['', Validators.required],
      proceedingsDate: ['', Validators.required],
      uploadProceedings: ['', Validators.required],
      attachments: this.fb.array([]) // Dynamic attachments array

    },
    { validators: this.dateTimeValidator() }
  );




    // Other setup functions
    this.trackStep1FormValidity();
    this.onNumberOfVictimsChange();
    this.onNumberOfAccusedChange();
    this.populateVictimsRelief([]); // Pass an empty array if there are no details
    this.handleCaseTypeChange();


  }




  get hearingDetails(): FormArray {
    return this.firForm.get('hearingDetails') as FormArray;
  }


  get hearingDetails_one(): FormArray {
    return this.firForm.get('hearingDetails_one') as FormArray;
  }


addHearingDetail(): void {
  this.hearingDetails.push(this.createHearingDetailGroup());
}

removeHearingDetail(index: number): void {
  this.hearingDetails.removeAt(index);
}

addHearingDetail_one(): void {
  this.hearingDetails_one.push(this.createHearingDetailGroup_one());
}

removeHearingDetail_one(index: number): void {
  if (this.hearingDetails_one.length > 1) {
    this.hearingDetails_one.removeAt(index);
  }
}




get attachments_1(): FormArray {
  return this.firForm.get('attachments_1') as FormArray;
}

get attachments_2(): FormArray {
  return this.firForm.get('attachments_2') as FormArray;
}


onFileSelect_1(event: any, index: number): void {
  const file = event.target.files[0];
  if (file) {
    const attachmentGroup = this.attachments_1.at(index) as FormGroup;
    attachmentGroup.patchValue({
      file,
      fileName: file.name,
    });
  }
}

onFileSelect_2(event: any, index: number): void {
  const file = event.target.files[0];
  if (file) {
    const attachmentGroup = this.attachments_2.at(index) as FormGroup;
    attachmentGroup.patchValue({
      file_2: file,
      fileName_2: file.name,
    });
  }
}


updateRemainingCharacters(index: number) {
  const value = this.accuseds.at(index).get('gistOfCurrentCase')?.value || '';
  this.remainingCharacters[index] = 3000 - value.length; // Calculate remaining characters
}

removeAttachment_2(index: number): void {
  if (this.attachments_2.length > 1) {
    this.attachments_2.removeAt(index);
  }
}
createAttachmentGroup_2(): FormGroup {
  return this.fb.group({
    file_2: [null, Validators.required], // File control
    fileName_2: [''], // File name
  });
}




addAttachment_1(): void {
  this.attachments_1.push(this.createAttachmentGroup());
}

removeAttachment_1(index: number): void {
  if (this.attachments_1.length > 1) {
    this.attachments_1.removeAt(index);
  }
}


  onJudgementNatureChange_one(): void {
    const judgementNature = this.firForm.get('judgementDetails_one.judgementNature_one')?.value;

    if (judgementNature === 'Convicted_one') {
      // Show only Upload Judgement Copy
      this.showJudgementCopy = true;
      this.showLegalOpinionObtained_one = false;
      this.showFiledBy_one = false;
      this.showDesignatedCourt_one = false;
      this.hideCompensationSection = false;

      // Set validators for Upload Judgement Copy
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.setValidators(Validators.required);
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.updateValueAndValidity();
    } else if (judgementNature === 'Acquitted_one') {
      // Show Upload Judgement Copy and additional fields
      this.showJudgementCopy = true;
      this.showLegalOpinionObtained_one = true;
      this.showFiledBy_one = true;
      this.showDesignatedCourt_one = true;
      this.hideCompensationSection = true;

      // Set validators for Upload Judgement Copy
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.setValidators(Validators.required);
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.updateValueAndValidity();
    } else {
      // Reset visibility for all fields
      this.showJudgementCopy = false;
      this.showLegalOpinionObtained_one = false;
      this.showFiledBy_one = false;
      this.showDesignatedCourt_one = false;
      this.hideCompensationSection = false;
      // Clear validators for Upload Judgement Copy
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.clearValidators();
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.updateValueAndValidity();
    }
  }

  onLegalOpinionChange_one(): void {
    const legalOpinion = this.firForm.get('judgementDetails_one.legalOpinionObtained_one')?.value;

    // Show additional fields based on legal opinion value
    this.showCaseFitForAppeal_one = legalOpinion === 'yes';
  }


  onDesignatedCourtChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;

    this.showDuplicateSection = selectedValue === 'highCourt' || selectedValue === 'supremeCourt';

    // console.log('Selected Value:', selectedValue);
    // console.log('Show Duplicate Section:', this.showDuplicateSection);
  }

  onDesignatedCourtChange_one(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;

    this.showDuplicateSection_1 = selectedValue === 'highCourt_one' || selectedValue === 'supremeCourt_one';

    // console.log('Selected Value:', selectedValue);
    // console.log('Show Duplicate Section:', this.showDuplicateSection);
  }


  onJudgementNatureChange(): void {
    const judgementNature = this.firForm.get('judgementDetails.judgementNature')?.value;

    if (judgementNature === 'Convicted') {
      // Show Upload Judgement Copy only
      this.showJudgementCopy = true;
      this.showLegalOpinionObtained = false;
      this.showFiledBy = false;
      this.showDesignatedCourt = false;

      this.hideCompensationSection = false;

      // Set validators for Upload Judgement Copy
      this.firForm.get('judgementDetails.uploadJudgement')?.setValidators(Validators.required);
      this.firForm.get('judgementDetails.uploadJudgement')?.updateValueAndValidity();
    } else if (judgementNature === 'Acquitted') {
      // Show Upload Judgement Copy and other fields
      this.showJudgementCopy = true;
      this.showLegalOpinionObtained = true;
      this.showFiledBy = true;
      this.showDesignatedCourt = true;
      this.hideCompensationSection = true;
      // Set validators for Upload Judgement Copy
      this.firForm.get('judgementDetails.uploadJudgement')?.setValidators(Validators.required);
      this.firForm.get('judgementDetails.uploadJudgement')?.updateValueAndValidity();
    }
  }

  onLegalOpinionChange(): void {
    const legalOpinion = this.firForm.get('judgementDetails.legalOpinionObtained')?.value;

    // Show "Case Fit for Appeal" and "Government Approval" fields if legal opinion is "yes"
    this.showCaseFitForAppeal = legalOpinion === 'yes';
  }









  onJudgementSelectionChange(event: any): void {
    const value = event.target.value;

    if (value === 'yes') {
      this.firForm.get('judgementDetails.judgementNature')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails.uploadJudgement')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails.judgementNature')?.clearValidators();
      this.firForm.get('judgementDetails.uploadJudgement')?.clearValidators();
      this.hideCompensationSection = true;
    }

    this.firForm.get('judgementDetails.judgementNature')?.updateValueAndValidity();
    this.firForm.get('judgementDetails.uploadJudgement')?.updateValueAndValidity();
    this.hideCompensationSection = true;
  }








onAdditionalReliefChange(event: Event, value: string): void {
  const checked = (event.target as HTMLInputElement).checked;

  // Iterate over victimsRelief FormArray to find and update the correct group
  this.victimsRelief.controls.forEach((group, index) => {
    const additionalReliefControl = group.get('additionalRelief') as FormControl;

    let currentValues = additionalReliefControl.value || [];

    if (checked && !currentValues.includes(value)) {
      currentValues.push(value);
    } else if (!checked) {
      currentValues = currentValues.filter((item: string) => item !== value);
    }

    additionalReliefControl.setValue(currentValues); // Update form control
    additionalReliefControl.markAsDirty(); // Mark as dirty for form submission
  });

  this.cdr.detectChanges(); // Trigger UI updates
}







  // onJudgementSelectionChange_two(event: any): void {
  //   const value = event.target.value;
  //   if (value === 'yes') {
  //     this.firForm.get('judgementDetails_two.judgementNature_two')?.setValidators([Validators.required]);
  //     this.firForm.get('judgementDetails_two.uploadJudgement_two')?.setValidators([Validators.required]);
  //   } else {
  //     this.firForm.get('judgementDetails_two.judgementNature_two')?.clearValidators();
  //     this.firForm.get('judgementDetails_two.uploadJudgement_two')?.clearValidators();
  //   }
  //   this.firForm.get('judgementDetails_two.judgementNature_two')?.updateValueAndValidity();
  //   this.firForm.get('judgementDetails_two.uploadJudgement_two')?.updateValueAndValidity();
  // }

  // onJudgementNatureChange_two(): void {
  //   const judgementNature = this.firForm.get('judgementDetails_two.judgementNature_two')?.value;
  //   if (judgementNature === 'Convicted_two') {
  //     this.showLegalOpinionObtained_two = false;
  //     this.showFiledBy_two = false;
  //     this.showDesignatedCourt_two = false;
  //     this.hideCompensationSection = false;
  //   } else if (judgementNature === 'Acquitted_two') {
  //     this.showLegalOpinionObtained_two = true;
  //     this.showFiledBy_two = true;
  //     this.showDesignatedCourt_two = true;
  //     this.hideCompensationSection = true;
  //   }
  // }

  onLegalOpinionChange_two(): void {
    const legalOpinion = this.firForm.get('judgementDetails_two.legalOpinionObtained_two')?.value;
    this.showCaseFitForAppeal_two = legalOpinion === 'yes';
  }


  get hearingDetails_two(): FormArray {
    return this.firForm.get('hearingDetails_two') as FormArray;
  }


  addHearingDetail_two(): void {
    this.hearingDetails_two.push(this.createHearingDetailGroup_two());
  }

  removeHearingDetail_two(index: number): void {
    if (this.hearingDetails_two.length > 1) {
      this.hearingDetails_two.removeAt(index);
    }
  }

  createHearingDetailGroup_two(): FormGroup {
    return this.fb.group({
      nextHearingDate_two: ['', Validators.required],
      reasonNextHearing_two: ['', Validators.required],
    });
  }

  populateVictimsRelief(victimsReliefDetails: any[]): void {
    const victimsReliefArray = this.victimsRelief;
    victimsReliefArray.clear(); // Clear existing form controls

    victimsReliefDetails.forEach((victim: any) => {
      const reliefGroup = this.createVictimReliefGroup();

      // Set initial values for each victim
      reliefGroup.patchValue({
        victimId: victim.victim_id || '',
        communityCertificate: victim.communityCertificate || '',
        reliefAmountScst: victim.fir_stage_as_per_act || '0',
        reliefAmountExGratia: victim.fir_stage_ex_gratia || '0',
        reliefAmountFirstStage: (
          parseFloat(victim.fir_stage_as_per_act || '0') +
          parseFloat(victim.fir_stage_ex_gratia || '0')
        ).toFixed(2),
        reliefAmountScst_1: victim.chargesheet_stage_as_per_act || '0',
        reliefAmountExGratia_1: victim.chargesheet_stage_ex_gratia || '0',
        reliefAmountSecondStage: (
          parseFloat(victim.chargesheet_stage_as_per_act || '0') +
          parseFloat(victim.chargesheet_stage_ex_gratia || '0')
        ).toFixed(2),
        reliefAmountScst_2: victim.final_stage_as_per_act || '0',
        reliefAmountExGratia_2: victim.final_stage_ex_gratia || '0',
        reliefAmountThirdStage: (
          parseFloat(victim.final_stage_as_per_act || '0') +
          parseFloat(victim.final_stage_ex_gratia || '0')
        ).toFixed(2),
        totalCompensation: '0', // Start with 0 and calculate dynamically for each step
      });

      // Subscribe to value changes for each stage
      reliefGroup.get('reliefAmountScst')?.valueChanges.subscribe(() => {
        this.updateFirstStageRelief(reliefGroup);
        this.updateTotalCompensation(); // Update first stage totals
      });

      reliefGroup.get('reliefAmountExGratia')?.valueChanges.subscribe(() => {
        this.updateFirstStageRelief(reliefGroup);
        this.updateTotalCompensation(); // Update first stage totals
      });

      reliefGroup.get('reliefAmountScst_1')?.valueChanges.subscribe(() => {
        this.updateSecondStageRelief(reliefGroup);
        this.updateTotalCompensation_1(); // Update second stage totals
      });

      reliefGroup.get('reliefAmountExGratia_1')?.valueChanges.subscribe(() => {
        this.updateSecondStageRelief(reliefGroup);
        this.updateTotalCompensation_1(); // Update second stage totals
      });

      reliefGroup.get('reliefAmountScst_2')?.valueChanges.subscribe(() => {
        this.updateThirdStageRelief(reliefGroup);
        this.updateTotalCompensation_2(); // Update third stage totals
      });

      reliefGroup.get('reliefAmountExGratia_2')?.valueChanges.subscribe(() => {
        this.updateThirdStageRelief(reliefGroup);
        this.updateTotalCompensation_2(); // Update third stage totals
      });

      victimsReliefArray.push(reliefGroup); // Add the relief group to the FormArray
    });

    // Perform initial calculation
    this.updateTotalCompensation();
    this.updateTotalCompensation_1();
    this.updateTotalCompensation_2();

    this.cdr.detectChanges(); // Trigger UI updates
  }

  updateFirstStageRelief(reliefGroup: FormGroup): void {
    const scst = parseFloat(reliefGroup.get('reliefAmountScst')?.value || '0');
    const exGratia = parseFloat(reliefGroup.get('reliefAmountExGratia')?.value || '0');
    const total = scst + exGratia;
    reliefGroup.patchValue({ reliefAmountFirstStage: total.toFixed(2) }, { emitEvent: false });
  }

  updateSecondStageRelief(reliefGroup: FormGroup): void {
    const scst = parseFloat(reliefGroup.get('reliefAmountScst_1')?.value || '0');
    const exGratia = parseFloat(reliefGroup.get('reliefAmountExGratia_1')?.value || '0');
    const total = scst + exGratia;
    reliefGroup.patchValue({ reliefAmountSecondStage: total.toFixed(2) }, { emitEvent: false });
  }

  updateThirdStageRelief(reliefGroup: FormGroup): void {
    const scst = parseFloat(reliefGroup.get('reliefAmountScst_2')?.value || '0');
    const exGratia = parseFloat(reliefGroup.get('reliefAmountExGratia_2')?.value || '0');
    const total = scst + exGratia;
    reliefGroup.patchValue({ reliefAmountThirdStage: total.toFixed(2) }, { emitEvent: false });
  }

  updateTotalCompensation(): void {
    let total = 0;
    this.victimsRelief.controls.forEach((group) => {
      const firstStage = parseFloat(group.get('reliefAmountFirstStage')?.value || '0');
      total += firstStage;
    });
    this.firForm.patchValue({ totalCompensation: total.toFixed(2) });
  }

  updateTotalCompensation_1(): void {
    let total = 0;
    this.victimsRelief.controls.forEach((group) => {
      const secondStage = parseFloat(group.get('reliefAmountSecondStage')?.value || '0');
      total += secondStage;
    });
    this.firForm.patchValue({ totalCompensation_1: total.toFixed(2) });
  }

  updateTotalCompensation_2(): void {
    let total = 0;
    this.victimsRelief.controls.forEach((group) => {
      const thirdStage = parseFloat(group.get('reliefAmountThirdStage')?.value || '0');
      total += thirdStage;
    });
    this.firForm.patchValue({ totalCompensation_2: total.toFixed(2) });
  }




  handleSCSTSectionChange(event: any, index: number): void {
    const selectedValues = event.value; // Selected SC/ST sections
    const victimGroup = this.victims.at(index) as FormGroup; // Access the victim's FormGroup

    if (selectedValues.length > 0) {
      this.firService.getOffenceActs().subscribe(
        (response: any[]) => {
          // Filter the offence acts based on selected values
          const matchedActs = response.filter((act) =>
            selectedValues.includes(act.offence_act_name)
          );

          if (matchedActs.length > 0) {
            // Update the victim's FormGroup with the fetched values
            victimGroup.patchValue({
              fir_stage_as_per_act: matchedActs[0].fir_stage_as_per_act || '',
              fir_stage_ex_gratia: matchedActs[0].fir_stage_ex_gratia || '',
              chargesheet_stage_as_per_act: matchedActs[0].chargesheet_stage_as_per_act || '',
              chargesheet_stage_ex_gratia: matchedActs[0].chargesheet_stage_ex_gratia || '',
              final_stage_as_per_act: matchedActs[0].final_stage_as_per_act || '',
              final_stage_ex_gratia: matchedActs[0].final_stage_ex_gratia || '',
            });

            // Calculate and update the 1st stage relief amount
            const reliefAmountFirstStage =
              parseFloat(matchedActs[0].fir_stage_as_per_act || '0') +
              parseFloat(matchedActs[0].fir_stage_ex_gratia || '0');
            victimGroup.patchValue({
              reliefAmountFirstStage: reliefAmountFirstStage.toFixed(2),
            });
          } else {
            // Reset the fields if no matched acts are found
            victimGroup.patchValue({
              fir_stage_as_per_act: '',
              fir_stage_ex_gratia: '',
              chargesheet_stage_as_per_act: '',
              chargesheet_stage_ex_gratia: '',
              final_stage_as_per_act: '',
              final_stage_ex_gratia: '',
              reliefAmountFirstStage: '', // Reset the 1st stage relief amount
            });
          }
        },
        (error) => {
          console.error('Error fetching offence acts:', error);
        }
      );
    } else {
      // Reset the fields if no sections are selected
      victimGroup.patchValue({
        fir_stage_as_per_act: '',
        fir_stage_ex_gratia: '',
        chargesheet_stage_as_per_act: '',
        chargesheet_stage_ex_gratia: '',
        final_stage_as_per_act: '',
        final_stage_ex_gratia: '',
        reliefAmountFirstStage: '', // Reset the 1st stage relief amount
      });
    }
  }




  loadVictimsReliefDetails(): void {
    if (!this.firId) {
      console.error('FIR ID is missing.');
      return;
    }

    this.firService.getVictimsReliefDetails(this.firId).subscribe(
      (response: any) => {
        //console.log('Victim Relief Details:', response.victimsReliefDetails); // Log response data
        if (response && response.victimsReliefDetails) {
          this.populateVictimsRelief(response.victimsReliefDetails);
        } else {
          console.warn('No victim relief details found.');
        }
      },
      (error) => {
        console.error('Failed to fetch victim relief details:', error);
      }
    );
  }

  onVictimGenderChange(event: Event, index: number) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'Other') {
      this.showOtherVictimGender[index] = true;
      this.victims.at(index).get('customGender')?.setValidators([Validators.required]);
    } else {
      this.showOtherVictimGender[index] = false;
      this.victims.at(index).get('customGender')?.clearValidators();
      this.victims.at(index).get('customGender')?.setValue('');
    }
    this.victims.at(index).get('customGender')?.updateValueAndValidity();
  }




  addVictimReliefFields(victimName: string): void {
    const victimsReliefArray = this.firForm.get('victimsRelief') as FormArray;
    const victimReliefGroup = this.fb.group({

      name: [victimName, Validators.required], // Auto-filled victim name
      reliefAmountScst: ['', Validators.required],
      reliefAmountExGratia: ['', Validators.required],
      reliefAmountFirstStage: ['', Validators.required],
      totalCompensation: ['', Validators.required],
      additionalRelief: [[]],
    });

    victimsReliefArray.push(victimReliefGroup); // Add to form array
  }



  // Create FormGroup for Investigating Officer
  createOfficerGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.pattern('^[A-Za-z\s]*$')],
      designation: ['', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
    });
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

// Check if the name field is invalid
isNameInvalid(): boolean {
  const nameControl = this.firForm.get('complainantDetails.nameOfComplainant');
  return !!(nameControl && nameControl.invalid && nameControl.touched);
}

isPhoneInvalid(index: number, type: string): boolean {
  if (type === 'complainant') {
    const phoneControl = this.firForm.get('complainantDetails.mobileNumberOfComplainant');
    return !!(
      phoneControl &&
      (phoneControl.invalid || phoneControl.value?.length !== 10) &&
      phoneControl.touched
    );
  }
  return false;
}




updateVictimNames(): void {
  this.victimNames = this.victims.controls
    .map((victim) => victim.get('name')?.value)
    .filter((name) => name); // Extract non-empty names

  if (this.victimNames.length > 0) {
    // Call the API to fetch relief details for each victim
    this.firService.getVictimsReliefDetails(this.firId!).subscribe(
      (response: any) => {
        if (response.victimsReliefDetails) {
          this.populateVictimsRelief(response.victimsReliefDetails);
        } else {
          console.warn('No victim relief details found.');
        }
      },
      (error) => {
        console.error('Failed to fetch victims relief details:', error);
      }
    );


  }
}



onIsDeceasedChangeOutside(): void {
  const isDeceasedControl = this.firForm.get('isDeceased');
  const deceasedPersonNamesControl = this.firForm.get('deceasedPersonNames');

  if (isDeceasedControl?.value === 'yes') {
    // If "Yes", make the deceased person names field required
    deceasedPersonNamesControl?.setValidators([Validators.required]);
    deceasedPersonNamesControl?.enable();
  } else {
    // If "No", reset and disable the deceased person names field
    deceasedPersonNamesControl?.clearValidators();
    deceasedPersonNamesControl?.reset();
    deceasedPersonNamesControl?.disable();
  }

  deceasedPersonNamesControl?.updateValueAndValidity();
  this.updateNextButtonState(); // Update "Next" button state
}

// Update "Next" button state based on deceased person names
updateNextButtonState(): void {
  const isDeceased = this.firForm.get('isDeceased')?.value;
  const deceasedPersonNamesValid = this.firForm.get('deceasedPersonNames')?.valid;

  // Enable "Next" button only if conditions are met
  this.nextButtonDisabled = !(isDeceased === 'no' || (isDeceased === 'yes' && deceasedPersonNamesValid));
  this.cdr.detectChanges(); // Trigger change detection
}


  // Validator to restrict future dates
maxDateValidator() {
  return (control: any) => {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      return { maxDate: true };
    }
    return null;
  };
}

createVictimGroup(): FormGroup {
  return this.fb.group({
    victimId: [''], // Track existing victim IDs
    age: ['', Validators.required],
    name: [{ value: '', disabled: false }, [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]],
    gender: ['', Validators.required],
    mobileNumber: [
      '',
      [Validators.required, Validators.pattern('^[0-9]{10}$')] // 10-digit validation
    ],
    customGender: [''], // Add customGender field
    address: [''],
    victimPincode: [
      '',
      [Validators.required, Validators.pattern('^[0-9]{6}$')] // 6-digit validation
    ],
    community: ['', Validators.required],
    caste: ['', Validators.required],
    availableCastes: [[]],
    guardianName: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]],
    isNativeDistrictSame: ['', Validators.required],
    nativeDistrict: [''],
    offenceCommitted: ['', Validators.required],
    scstSections: [[]],
    sectionsIPC: ['', Validators.required],
    fir_stage_as_per_act: [''],
    fir_stage_ex_gratia: [''],
    chargesheet_stage_as_per_act: [''],
    chargesheet_stage_ex_gratia: [''],
    final_stage_as_per_act: [''],
    final_stage_ex_gratia: [''],
  });
}



isPincodeInvalid(index: number): boolean {
  const pincodeControl = this.accuseds.at(index).get('pincode');
  return (pincodeControl?.touched ?? false) && !(pincodeControl?.valid ?? true);
}



createVictimReliefGroup(initialValues: any = {}): FormGroup {
  return this.fb.group({

    victimId: [initialValues.victim_id  || null], // Add victim_id here

    communityCertificate: ['', Validators.required],

    reliefAmountScst: [
      { value: initialValues.reliefAmountScst || '0' },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountExGratia: [
      { value: initialValues.reliefAmountExGratia || '0' },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountFirstStage: [
      { value: initialValues.reliefAmountFirstStage || '0', disabled: true },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountScst_1: [
      { value: initialValues.reliefAmountScst_1 || '0' },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountExGratia_1: [
      { value: initialValues.reliefAmountExGratia_1 || '0' },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountSecondStage: [
      { value: initialValues.reliefAmountSecondStage || '0', disabled: true },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountScst_2: [
      { value: initialValues.reliefAmountScst_2 || '0' },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountExGratia_2: [
      { value: initialValues.reliefAmountExGratia_2 || '0' },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    reliefAmountThirdStage: [
      { value: initialValues.reliefAmountThirdStage || '0', disabled: true },
      [Validators.required, Validators.pattern('^[0-9]*$')],
    ],
    totalCompensation: [initialValues.totalCompensation || '', Validators.required],
    additionalRelief: [initialValues.additionalRelief || []],
  });
}







createHearingDetailGroup(): FormGroup {
  return this.fb.group({
    nextHearingDate: ['', Validators.required],
    reasonNextHearing: ['', Validators.required]
  });
}

createHearingDetailGroup_one(): FormGroup {
  return this.fb.group({
    nextHearingDate_one: ['', Validators.required],
    reasonNextHearing_one: ['', Validators.required],
  });
}


handleCaseTypeChange() {
  const caseType = this.firForm.get('caseType')?.value;

  if (caseType === 'chargeSheet') {
    this.firForm.get('caseNumber')?.enable();
    this.firForm.get('rcsFileNumber')?.disable();
    this.firForm.get('rcsFilingDate')?.disable();
    this.firForm.get('mfCopy')?.disable();
  } else if (caseType === 'referredChargeSheet') {
    this.firForm.get('caseNumber')?.disable();
    this.firForm.get('rcsFileNumber')?.enable();
    this.firForm.get('rcsFilingDate')?.enable();
    this.firForm.get('mfCopy')?.enable();
  }
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




  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;

    for (let year = currentYear; year >= startYear; year--) {
      this.yearOptions.push(year); // Populate yearOptions array with years
    }
  }

  // Dropdown and option loading methods
  loadOptions() {
    this.firService.getOffences().subscribe(
      (offences: any) => {
        this.offenceOptions = offences.map((offence: any) => offence.offence_name);
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load offence options.', 'error');
      }
    );
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




  loadOffenceActs() {
    this.firService.getOffenceActs().subscribe(
      (acts: any[]) => {
        this.offenceActsOptions = acts.map((act) => ({
          offence_act_name: act.offence_act_name,
          // Include additional fields if necessary
          ...act,
        }));
        //console.log('Offence Acts Options:', this.offenceActsOptions);
      },
      (error: any) => {
        console.error('Failed to load offence acts:', error);
      }
    );
  }






  // loadScstSections() {
  //   this.firService.getCastes().subscribe(
  //     (sections: any) => {
  //       this.scstSectionsOptions = sections.map((section: any) => section.caste_name);
  //     },
  //     (error: any) => {
  //       Swal.fire('Error', 'Failed to load SC/ST sections options.', 'error');
  //     }
  //   );
  // }

  loadUserData() {
    this.firService.getUserDetails(this.userId).subscribe(
      (user: any) => {
        if (user && user.district) {
          const district = user.district;
          this.firForm.patchValue({ policeCity: district });
          this.loadPoliceDivisionDetails(district);
        }
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load user details.', 'error');
      }
    );
  }

  loadPoliceDivisionDetails(district: string) {
    this.firService.getPoliceDivision(district).subscribe(
      (data: any) => {
        this.policeCities = [district];
        this.policeZones = data.map((item: any) => item.police_zone_name);
        this.policeRanges = data.map((item: any) => item.police_range_name);
        this.revenueDistricts = data.map((item: any) => item.district_division_name);
        this.firForm.patchValue({
          policeZone: this.policeZones[0] || '',
          policeRange: this.policeRanges[0] || '',
          revenueDistrict: this.revenueDistricts[0] || '',
        });
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load division details.', 'error');
      }
    );
  }






  // Victim Information Methods
  get victims(): FormArray {
    return this.firForm.get('victims') as FormArray;
  }

  onNumberOfVictimsChange() {
    const currentVictimCount = this.victims.length; // Current number of victim entries
    const numberOfVictims = this.firForm.get('complainantDetails.numberOfVictims')?.value || 1;

    if (numberOfVictims > currentVictimCount) {
      // Add new victim fields
      for (let i = currentVictimCount; i < numberOfVictims; i++) {
        this.victims.push(this.createVictimGroup());
      }
    } else if (numberOfVictims < currentVictimCount) {
      // Remove excess victim fields
      for (let i = currentVictimCount - 1; i >= numberOfVictims; i--) {
        this.victims.removeAt(i);
      }
    }

    this.cdr.detectChanges(); // Ensure UI is updated
  }


  // Accused Information Methods
  get accuseds(): FormArray {
    return this.firForm.get('accuseds') as FormArray;
  }

  addAccused() {
    this.accuseds.push(this.createAccusedGroup());
    this.showOtherGender.push(false);
    this.remainingCharacters.push(3000); // Initialize "Other" visibility for the new accused
  }


  onGenderChange(event: Event, index: number) {
    const selectElement = event.target as HTMLSelectElement; // Cast to HTMLSelectElement
    const selectedValue = selectElement.value;

    if (selectedValue === 'Other') {
      this.showOtherGender[index] = true;
      this.accuseds.at(index).get('customGender')?.setValidators([Validators.required]); // Enable validation
    } else {
      this.showOtherGender[index] = false;
      this.accuseds.at(index).get('customGender')?.clearValidators(); // Clear validation
      this.accuseds.at(index).get('customGender')?.setValue(''); // Clear value
    }
    this.accuseds.at(index).get('customGender')?.updateValueAndValidity(); // Update validity
  }



  onNumberOfAccusedChange(): void {
    const numberOfAccused = this.firForm.get('numberOfAccused')?.value || 1;
    const accusedsArray = this.firForm.get('accuseds') as FormArray;

    // Clear existing accused fields
    accusedsArray.clear();

    // Add new accused fields based on the selected number
    for (let i = 0; i < numberOfAccused; i++) {
      accusedsArray.push(this.createAccusedGroup());
    }

    this.cdr.detectChanges(); // Trigger change detection to update the UI
  }


  createAccusedGroup(): FormGroup {
    return this.fb.group({

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
      customGender: [''],
      previousFIRNumber: [''],
      previousFIRNumberSuffix: [''],
      scstOffence: [false, Validators.required],
      scstFIRNumber: [''],
      scstFIRNumberSuffix: [''],
      antecedents: ['', Validators.required],
      landOIssues: ['', Validators.required],
      gistOfCurrentCase: ['', [Validators.required, Validators.maxLength(3000)]],
      availableCastes: [[]]

    });
  }


  // Handle City Change
  onCityChange(event: any) {
    const selectedCity = event.target.value;
    if (selectedCity) {
      this.loadPoliceDivisionDetails(selectedCity);
    }
  }

    // Create a FormGroup for a single attachment
    createAttachmentGroup(): FormGroup {
      return this.fb.group({
        fileName: [''], // Holds the file name
        file: [null, Validators.required], // Holds the file itself
        file_1: [null, Validators.required], // File control
        fileName_1: [''],
        file_2: [null, Validators.required], // File control
        fileName_2: [''],
      });
    }


    // Handle single file selection
  onSingleFileSelect(event: any, index: number): void {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      // Update the attachment FormGroup with the file and its name
      this.attachments.at(index).patchValue({
        fileName: file.name,
        file: file,
      });

      // Trigger change detection to update the UI
      this.cdr.detectChanges();
    }
  }


  addAttachment_2(): void {
    this.attachments_2.push(this.createAttachmentGroup());
  }
  // Add a new attachment entry
  addAttachment(): void {
    this.attachments.push(this.createAttachmentGroup());
  }

  // Remove an attachment entry
  removeAttachment(index: number): void {
    if (this.attachments.length > 1) {
      this.attachments.removeAt(index);
    }
  }

  // Getter for attachments FormArray
  get attachments(): FormArray {
    return this.firForm.get('attachments') as FormArray;
  }



  saveStepThreeAsDraft() {
    const firData = {
      firId: this.firId,
      complainantDetails: this.firForm.get('complainantDetails')?.value,
      victims: this.victims.value.map((victim: any) => ({
        victimId: victim.victimId || null,
        name: victim.name || '',
        age: victim.age || '',
        gender: victim.gender || '',
        customGender: victim.gender === 'Other' ? victim.customGender || null : null,
        mobileNumber: victim.mobileNumber || null,
        address: victim.address || null,
        victimPincode: victim.victimPincode || null,
        community: victim.community || '',
        caste: victim.caste || '',
        guardianName: victim.guardianName || '',
        isNativeDistrictSame: victim.isNativeDistrictSame || '',
        nativeDistrict: victim.nativeDistrict || null,
        offenceCommitted: victim.offenceCommitted || [],
        scstSections: victim.scstSections || [],
        sectionsIPC: victim.sectionsIPC || '',
        fir_stage_as_per_act: victim.fir_stage_as_per_act || null,
        fir_stage_ex_gratia: victim.fir_stage_ex_gratia || null,
        chargesheet_stage_as_per_act: victim.chargesheet_stage_as_per_act || null,
        chargesheet_stage_ex_gratia: victim.chargesheet_stage_ex_gratia || null,
        final_stage_as_per_act: victim.final_stage_as_per_act || null,
        final_stage_ex_gratia: victim.final_stage_ex_gratia || null,
      })),
      isDeceased: this.firForm.get('isDeceased')?.value,
      deceasedPersonNames: this.firForm.get('deceasedPersonNames')?.value || [],
    };

    this.firService.saveStepThreeAsDraft(firData).subscribe(
      (response: any) => {
        this.firId = response.fir_id;
        if (this.firId) {
          sessionStorage.setItem('firId', this.firId);
        }
        const updatedVictims = response.victims || [];
        updatedVictims.forEach((updatedVictim: any, index: number) => {
          if (this.victims.at(index)) {
            this.victims.at(index).patchValue({ victimId: updatedVictim.victimId });
          }
        });
        Swal.fire('Success', 'FIR saved as draft for step 3.', 'success');
      },
      (error) => {
        console.error('Error saving FIR for step 3:', error);
        Swal.fire('Error', 'Failed to save FIR as draft for step 3.', 'error');
      }
    );
  }






// Save Step 4 as Draft
saveStepFourAsDraft(): void {
  const firData = {
    firId: this.firId,
    numberOfAccused: this.firForm.get('numberOfAccused')?.value || '',
    accuseds: this.accuseds.value.map((accused: any) => ({
      ...accused,
      accusedId: accused.accusedId || null, // Include accusedId if it exists
    })),
    uploadFIRCopy: this.selectedFile, // Pass the actual File object here
  };

  console.log('FIR Data:', firData);

  this.firService.saveStepFourAsDraft(firData).subscribe(
    (response: any) => {
      this.firId = response.fir_id; // Set FIR ID from backend response
      if (this.firId) {
        sessionStorage.setItem('firId', this.firId); // Save FIR ID in session
      }
      // Map accused IDs back to the form
      const updatedAccuseds = response.accuseds || [];
      updatedAccuseds.forEach((updatedAccused: any, index: number) => {
        if (this.accuseds.at(index)) {
          this.accuseds.at(index).patchValue({ accusedId: updatedAccused.accusedId });
        }
      });
      Swal.fire('Success', 'FIR saved as draft for step 4.', 'success');
    },
    (error) => {
      console.error('Error saving FIR for step 4:', error);
      Swal.fire('Error', 'Failed to save FIR as draft for step 4.', 'error');
    }
  );
}


onProceedingsFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.proceedingsFile = input.files[0]; // Save the selected file
  }
}

saveStepFiveAsDraft(isSubmit: boolean = false): void {
  if (!this.firId) {
    Swal.fire('Error', 'FIR ID is missing. Unable to proceed.', 'error');
    return;
  }

  // Prepare the FIR data
  const firData = {
    firId: this.firId,
    victimsRelief: this.victimsRelief.value.map((relief: any, index: number) => ({
      victimId: relief.victimId || null,
      reliefId: relief.reliefId || null, // Use backend-generated ID if not present
      victimName: this.victimNames[index] || '', // Ensure victim name is mapped correctly
      communityCertificate: relief.communityCertificate || 'no',
      reliefAmountScst: relief.reliefAmountScst || '0.00',
      reliefAmountExGratia: relief.reliefAmountExGratia || '0.00',
      reliefAmountFirstStage: (
        parseFloat(relief.reliefAmountScst || '0') +
        parseFloat(relief.reliefAmountExGratia || '0')
      ).toFixed(2),
      totalCompensation: relief.totalCompensation || '0.00',
      additionalRelief: relief.additionalRelief || [], // Include the additionalRelief field
    })),
    totalCompensation: this.firForm.get('totalCompensation')?.value || '0.00',
    proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value || '',
    proceedingsDate: this.firForm.get('proceedingsDate')?.value || null,
    proceedingsFile: this.firForm.get('proceedingsFile')?.value || '',
    attachments: this.attachments.value.map((attachment: any) => ({
      fileName: attachment.fileName || null, // Name of the uploaded file
      filePath: attachment.filePath || null, // Path where the file is stored
    })),
    status: isSubmit ? 5 : null, // Include status if this is a submission
  };

  // Call the service to save the data
  this.firService.saveStepFiveAsDraft(firData).subscribe(
    (response) => {
      if (isSubmit) {
        // Show success message and navigate to the next step
        Swal.fire({
          title: 'Success',
          text: 'Step 5 data submitted successfully.',
          icon: 'success',
        }).then(() => {
          this.navigateToChargesheetPage();
        });
      } else {
        // Show success message for draft save
        Swal.fire('Success', 'Step 5 data saved as draft.', 'success');
      }
    },
    (error) => {
      // Log error and show error message
      console.error('Error saving Step 5 data:', error);
      Swal.fire('Error', 'Failed to save Step 5 data.', 'error');
    }
  );
}








submitStepSeven(): void {
  if (!this.firId) {
      Swal.fire('Error', 'FIR ID is missing. Unable to proceed.', 'error');
      return;
  }

  // Call saveAsDraft_7 to save the draft data before updating the status
  this.saveAsDraft_7();

  // Update the FIR status to 7 after saving the draft
  this.firService.updateFirStatus(this.firId, 7).subscribe({
      next: () => {
          Swal.fire({
              title: 'Success',
              text: 'FIR status updated to 7.',
              icon: 'success',
              confirmButtonText: 'OK',
          }).then(() => {
              this.navigateToChargesheetPage(); // Redirect to the chargesheet page after successful update
          });
      },
      error: (error) => {
          console.error('Error updating FIR status:', error);
          Swal.fire('Error', 'Failed to update FIR status.', 'error');
      }
  });
}






// Helper function to navigate to the next step
navigateToNextStep(): void {
  if (this.mainStep === 2 && this.step === 1) {
    this.loadVictimsReliefDetails();
    this.mainStep = 3; // Move to Trial Stage if currently in Chargesheet Stage
    this.step = 1;      // Reset to Step 1 of the new stage
  }


  if (this.mainStep === 3 && this.step === 1) {
    this.loadVictimsReliefDetails();

  }

  else if (this.mainStep === 1 && this.step < 5) {
    this.step++;        // Go to the next step within the same main stage
  } else if (this.mainStep === 1 && this.step === 5) {
    this.mainStep = 2;  // Move to Chargesheet Stage after FIR Stage
    this.step = 1;      // Reset to Step 1 of Chargesheet Stage
  }
  this.cdr.detectChanges(); // Ensure UI updates after step change
}



// Get victimsRelief FormArray
get victimsRelief(): FormArray {
  return this.firForm.get('victimsRelief') as FormArray;
}

navigateToNextPage(): void {
  if (this.mainStep === 2 && this.step === 1) {
    this.mainStep = 3; // Move to Trial Stage if currently in Chargesheet Stage
    this.step = 1;      // Reset to Step 1 of the new stage
  } else if (this.mainStep === 1 && this.step < 5) {
    this.step++;        // Go to the next step within the same main stage
  } else if (this.mainStep === 1 && this.step === 5) {
    this.mainStep = 2;  // Move to Chargesheet Stage after FIR Stage
    this.step = 1;      // Reset to Step 1 of Chargesheet Stage
    this.loadVictimsReliefDetails();
  }
}



// Update the saveAsDraft() method to include Step 4
saveAsDraft(): void {


  if (this.step === 1) {
    this.saveStepOneAsDraft();
  } else if (this.step === 2) {
    this.saveStepTwoAsDraft();
  } else if (this.step === 3) {
    this.saveStepThreeAsDraft();
  } else if (this.step === 4) {
    this.saveStepFourAsDraft();
  } else if (this.step === 5) {
    this.saveStepFiveAsDraft(); // Calls Step 5 draft save without submission
  }
}

saveAsDraft_6(isSubmit: boolean = false): void {
  if (!this.firId) {
    Swal.fire('Error', 'FIR ID is missing. Unable to save as draft.', 'error');
    return;
  }
  this.victimsRelief.controls.forEach((control) => {
    control.get('reliefAmountSecondStage')?.enable(); // Temporarily enable
  });
  // Prepare data to be sent to the backend
  const chargesheetData = {
    firId: this.firId,
    chargesheetDetails: {
      chargeSheetFiled: this.firForm.get('chargeSheetFiled')?.value || '',
      courtDistrict: this.firForm.get('courtDistrict')?.value || '',
      courtName: this.firForm.get('courtName')?.value || '',
      caseType: this.firForm.get('caseType')?.value || '',
      caseNumber: this.firForm.get('caseType')?.value === 'chargeSheet'
        ? this.firForm.get('caseNumber')?.value || ''
        : null,
      rcsFileNumber: this.firForm.get('caseType')?.value === 'referredChargeSheet'
        ? this.firForm.get('rcsFileNumber')?.value || ''
        : null,
      rcsFilingDate: this.firForm.get('caseType')?.value === 'referredChargeSheet'
        ? this.firForm.get('rcsFilingDate')?.value || null
        : null,
      mfCopyPath: this.firForm.get('mfCopy')?.value || '',
      totalCompensation: parseFloat(this.firForm.get('totalCompensation_1')?.value || '0.00').toFixed(2),
      proceedingsFileNo: this.firForm.get('proceedingsFileNo_1')?.value || '',
      proceedingsDate: this.firForm.get('proceedingsDate_1')?.value || null,
      uploadProceedingsPath: this.firForm.get('uploadProceedings_1')?.value || '',
    },
    victimsRelief: this.victimsRelief.value.map((relief: any, index: number) => ({
      victimId: relief.victimId || null,
      victimName: this.victimNames[index] || '',
      reliefAmountScst: parseFloat(relief.reliefAmountScst_1 || '0.00').toFixed(2),
      reliefAmountExGratia: parseFloat(relief.reliefAmountExGratia_1 || '0.00').toFixed(2),
      reliefAmountSecondStage: parseFloat(relief.reliefAmountSecondStage || '0.00').toFixed(2),
    })),
    attachments: this.attachments_1.value.map((attachment: any) => ({
      fileName: attachment.fileName_1 || null,
      filePath: attachment.file_1 || null,
    })),
    status: 6, // Update status to 6 for the FIR
  };

  // Call the service to send data to the backend
  this.firService.saveStepSixAsDraft(chargesheetData).subscribe(
    (response: any) => {
      Swal.fire({
        title: 'Success',
        text: 'Step 6 data saved and FIR status updated to 6 successfully.',
        icon: 'success',
      });
    },
    (error) => {
      console.error('Error saving Step 6 data:', error);
      Swal.fire('Error', 'Failed to save Step 6 data.', 'error');
    }
  );
}



// saveAsDraft_7(): void {
//   if (!this.firId) {
//       Swal.fire('Error', 'FIR ID is missing. Unable to save draft.', 'error');
//       return;
//   }



//     const trialDetails = {
//         courtName: this.firForm.get('Court_name')?.value,
//         courtDistrict: this.firForm.get('courtDistrict')?.value,
//         trialCaseNumber: this.firForm.get('trialCaseNumber')?.value,
//         publicProsecutor: this.firForm.get('publicProsecutor')?.value,
//         prosecutorPhone: this.firForm.get('prosecutorPhone')?.value,
//         firstHearingDate: this.firForm.get('firstHearingDate')?.value,
//         judgementAwarded: this.firForm.get('judgementAwarded')?.value,
//         judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,

//     };

//     if (!trialDetails.judgementNature && trialDetails.judgementAwarded === 'yes') {
//         Swal.fire('Error', 'Please select the nature of judgement.', 'error');
//         return;
//     }

//   const compensationDetails = {
//       totalCompensation: this.firForm.get('totalCompensation_2')?.value,
//       proceedingsFileNo: this.firForm.get('proceedingsFileNo_2')?.value,
//       proceedingsDate: this.firForm.get('proceedingsDate_2')?.value,
//       uploadProceedings: this.firForm.get('uploadProceedings_2')?.value
//   };

//   const attachments = (this.firForm.get('attachments_2')?.value || []).map((attachment: any) => ({
//       fileName: attachment.file_2
//   }));

//   const victimsDetails = this.victimsRelief.value.map((relief: any, index: number) => ({
//       victimId: relief.victimId || null,
//       victimName: this.victimNames[index] || '',
//       reliefAmountAct: parseFloat(relief.reliefAmountScst || '0.00'),
//       reliefAmountGovernment: parseFloat(relief.reliefAmountExGratia || '0.00'),
//       reliefAmountFinalStage: parseFloat(relief.reliefAmountThirdStage || '0.00')
//   }));

//   const formData = {
//       firId: this.firId,
//       trialDetails,
//       compensationDetails,
//       attachments,
//       victimsDetails
//   };

//   this.firService.saveStepSevenAsDraft(formData).subscribe({
//       next: (response) => {
//           Swal.fire('Success', 'Draft data saved successfully.', 'success');
//       },
//       error: (error) => {
//           console.error('Error saving draft data:', error);
//           Swal.fire('Error', 'Failed to save draft data.', 'error');
//       }
//   });
// }

saveAsDraft_7(): void {
  if (!this.firId) {
    Swal.fire('Error', 'FIR ID is missing. Unable to save draft.', 'error');
    return;
  }

  // Trial details from the form
  const trialDetails = {
    courtName: this.firForm.get('Court_name')?.value,
    courtDistrict: this.firForm.get('courtDistrict')?.value,
    trialCaseNumber: this.firForm.get('trialCaseNumber')?.value,
    publicProsecutor: this.firForm.get('publicProsecutor')?.value,
    prosecutorPhone: this.firForm.get('prosecutorPhone')?.value,
    firstHearingDate: this.firForm.get('firstHearingDate')?.value,
    judgementAwarded: this.firForm.get('judgementAwarded')?.value,
    judgementAwarded1: this.firForm.get('judgementAwarded1')?.value,
    judgementAwarded2: this.firForm.get('judgementAwarded2')?.value,
    judgementAwarded3: this.firForm.get('judgementAwarded3')?.value,
    judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,
    legalOpinionObtained: this.firForm.get('judgementDetails.legalOpinionObtained')?.value,
    caseFitForAppeal: this.firForm.get('judgementDetails.caseFitForAppeal')?.value,
    governmentApprovalForAppeal: this.firForm.get('judgementDetails.governmentApprovalForAppeal')?.value,
    filedBy: this.firForm.get('judgementDetails.filedBy')?.value,
    designatedCourt: this.firForm.get('judgementDetails.designatedCourt')?.value,
    Court_one: this.firForm.get('Court_one')?.value,
    courtDistrict_one: this.firForm.get('courtDistrict_one')?.value,
    caseNumber_one: this.firForm.get('caseNumber_one')?.value,
    publicProsecutor_one: this.firForm.get('publicProsecutor_one')?.value,
    prosecutorPhone_one: this.firForm.get('prosecutorPhone_one')?.value,
    firstHearingDate_one: this.firForm.get('firstHearingDate_one')?.value,
    judgementAwarded_one: this.firForm.get('judgementAwarded_one')?.value,
    judgementNature_one: this.firForm.get('judgementDetails_one.judgementNature_one')?.value,
    caseFitForAppeal_one: this.firForm.get('judgementDetails_one.caseFitForAppeal_one')?.value,
    governmentApprovalForAppeal_one: this.firForm.get('judgementDetails_one.governmentApprovalForAppeal_one')?.value,
    legalOpinionObtained_one: this.firForm.get('judgementDetails_one.legalOpinionObtained_one')?.value,
    filedBy_one: this.firForm.get('judgementDetails_one.filedBy_one')?.value,
    designatedCourt_one: this.firForm.get('judgementDetails_one.designatedCourt_one')?.value,
    Court_three: this.firForm.get('Court_three')?.value,
    courtDistrict_two: this.firForm.get('courtDistrict_two')?.value,
    caseNumber_two: this.firForm.get('caseNumber_two')?.value,
    publicProsecutor_two: this.firForm.get('publicProsecutor_two')?.value,
    prosecutorPhone_two: this.firForm.get('prosecutorPhone_two')?.value,
    firstHearingDate_two: this.firForm.get('firstHearingDate_two')?.value,
    judgementAwarded_two: this.firForm.get('judgementAwarded_two')?.value,
    judgementNature_two: this.firForm.get('judgementDetails_two.judgementNature_two')?.value,
    legalOpinionObtained_two: this.firForm.get('judgementDetails_two.legalOpinionObtained_two')?.value,
    caseFitForAppeal_two: this.firForm.get('judgementDetails_two.caseFitForAppeal_two')?.value,
    governmentApprovalForAppeal_two: this.firForm.get('judgementDetails_two.governmentApprovalForAppeal_two')?.value,
    filedBy_two: this.firForm.get('judgementDetails_two.filedBy_two')?.value,
  };

  // Compensation details
  const compensationDetails = {
    totalCompensation: this.firForm.get('totalCompensation_2')?.value,
    proceedingsFileNo: this.firForm.get('proceedingsFileNo_2')?.value,
    proceedingsDate: this.firForm.get('proceedingsDate_2')?.value,
    uploadProceedings: this.firForm.get('uploadProceedings_2')?.value,
  };

  // Attachments - Map to the proper structure
  const attachments = (this.firForm.get('attachments_2')?.value || []).map((attachment: any) => ({
    fileName: attachment.file_2
  }));

  (this.victimsRelief.controls as FormGroup[]).forEach((control) => {
    control.get('reliefAmountThirdStage')?.enable();
  });

  // Victims' details - Map from form values
  const victimsDetails = this.victimsRelief.value.map((relief: any, index: number) => ({
    victimId: relief.victimId || null,
    victimName: this.victimNames[index] || '',
    reliefAmountAct: parseFloat(relief.reliefAmountScst_2 || '0.00'),
    reliefAmountGovernment: parseFloat(relief.reliefAmountExGratia_2 || '0.00'),
    reliefAmountFinalStage: parseFloat(relief.reliefAmountThirdStage || '0.00')
  }));

  (this.victimsRelief.controls as FormGroup[]).forEach((control) => {
    control.get('reliefAmountThirdStage')?.disable();
  });

  // Additional form fields that need to be submitted
  
  const formData = {
    firId: this.firId,
    trialDetails,
    compensationDetails,
    attachments,
    victimsDetails,
    hearingDetails: JSON.stringify(this.firForm.get('hearingDetails')?.value),
    hearingDetails_one: JSON.stringify(this.firForm.get('hearingDetails_one')?.value),
    hearingDetails_two: JSON.stringify(this.firForm.get('hearingDetails_two')?.value),
    totalCompensation: this.firForm.get('totalCompensation')?.value,
    proceedingsDate: this.firForm.get('proceedingsDate')?.value,
    proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value,
  };

  // Save the form data as a draft by calling the service
  this.firService.saveStepSevenAsDraft(formData).subscribe({
    next: (response) => {
      Swal.fire('Success', 'Draft data saved successfully.', 'success');
    },
    error: (error) => {
      console.error('Error saving draft data:', error);
      Swal.fire('Error', 'Failed to save draft data.', 'error');
    }
  });
}




getFiles(inputId: string): FileList | null {
  const fileInput = document.getElementById(inputId) as HTMLInputElement;
  // console.log(fileInput.files);
  return fileInput?.files && fileInput.files.length > 0 ? fileInput.files : null;
}
formDataToObject(formData: FormData): Record<string, any> {
  const obj: Record<string, any> = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}
// saveStepSevenAsDraft(isSubmit: boolean = false): void {
//   const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
//   if (fileInput.files && fileInput.files[0]) {
//     console.log(fileInput.files[0]);
//   }

//   const formData = new FormData();

//   // Check if a file is selected
//   // if (fileInput.files && fileInput.files[0]) {
//   //   // Append the file to FormData
//   //   formData.append("file", fileInput.files[0]);
//   // }

//   // Append other data (convert boolean and number to strings)
//   formData.append("name", String(true));  // Convert boolean to string
//   formData.append("name1", String(72));    // Convert number to string

//   // To get all the values associated with "name"
//   const allNames = formData.getAll("name");
//   formData.forEach((value, key) => {
//     console.log(key + ": " + value);
//   });

//   // Append non-file form fields to FormData
//   const formFields = {
//     firId: this.firId,
//     Court_name: this.firForm.get('Court_name')?.value,
//     courtDistrict: this.firForm.get('courtDistrict')?.value,
//     caseNumber: this.firForm.get('caseNumber')?.value,
//     publicProsecutor: this.firForm.get('publicProsecutor')?.value,
//     prosecutorPhone: this.firForm.get('prosecutorPhone')?.value,
//     firstHearingDate: this.firForm.get('firstHearingDate')?.value,
//     judgementAwarded: this.firForm.get('judgementAwarded')?.value,
//     judgementAwarded1: this.firForm.get('judgementAwarded1')?.value,
//     judgementAwarded2: this.firForm.get('judgementAwarded2')?.value,
//     judgementAwarded3: this.firForm.get('judgementAwarded3')?.value,
//     judgementNature: this.firForm.get('judgementDetails.judgementNature')?.value,
//     legalOpinionObtained: this.firForm.get('judgementDetails.legalOpinionObtained')?.value,
//     caseFitForAppeal: this.firForm.get('judgementDetails.caseFitForAppeal')?.value,
//     governmentApprovalForAppeal: this.firForm.get('judgementDetails.governmentApprovalForAppeal')?.value,
//     filedBy: this.firForm.get('judgementDetails.filedBy')?.value,
//     designatedCourt: this.firForm.get('judgementDetails.designatedCourt')?.value,
//     Court_one: this.firForm.get('Court_one')?.value,
//     courtDistrict_one: this.firForm.get('courtDistrict_one')?.value,
//     caseNumber_one: this.firForm.get('caseNumber_one')?.value,
//     publicProsecutor_one: this.firForm.get('publicProsecutor_one')?.value,
//     prosecutorPhone_one: this.firForm.get('prosecutorPhone_one')?.value,
//     firstHearingDate_one: this.firForm.get('firstHearingDate_one')?.value,
//     judgementAwarded_one: this.firForm.get('judgementAwarded_one')?.value,
//     judgementNature_one: this.firForm.get('judgementDetails_one.judgementNature_one')?.value,
//     caseFitForAppeal_one: this.firForm.get('judgementDetails_one.caseFitForAppeal_one')?.value,
//     governmentApprovalForAppeal_one: this.firForm.get('judgementDetails_one.governmentApprovalForAppeal_one')?.value,
//     legalOpinionObtained_one: this.firForm.get('judgementDetails_one.legalOpinionObtained_one')?.value,
//     filedBy_one: this.firForm.get('judgementDetails_one.filedBy_one')?.value,
//     designatedCourt_one: this.firForm.get('judgementDetails_one.designatedCourt_one')?.value,
//     Court_three: this.firForm.get('Court_three')?.value,
//     courtDistrict_two: this.firForm.get('courtDistrict_two')?.value,
//     caseNumber_two: this.firForm.get('caseNumber_two')?.value,
//     publicProsecutor_two: this.firForm.get('publicProsecutor_two')?.value,
//     prosecutorPhone_two: this.firForm.get('prosecutorPhone_two')?.value,
//     firstHearingDate_two: this.firForm.get('firstHearingDate_two')?.value,
//     judgementAwarded_two: this.firForm.get('judgementAwarded_two')?.value,
//     judgementNature_two: this.firForm.get('judgementDetails_two.judgementNature_two')?.value,
//     legalOpinionObtained_two: this.firForm.get('judgementDetails_two.legalOpinionObtained_two')?.value,
//     caseFitForAppeal_two: this.firForm.get('judgementDetails_two.caseFitForAppeal_two')?.value,
//     governmentApprovalForAppeal_two: this.firForm.get('judgementDetails_two.governmentApprovalForAppeal_two')?.value,
//     filedBy_two: this.firForm.get('judgementDetails_two.filedBy_two')?.value,
//     hearingDetails: JSON.stringify(this.firForm.get('hearingDetails')?.value),
//     hearingDetails_one: JSON.stringify(this.firForm.get('hearingDetails_one')?.value),
//     hearingDetails_two: JSON.stringify(this.firForm.get('hearingDetails_two')?.value),
//     totalCompensation: this.firForm.get('totalCompensation')?.value,
//     proceedingsDate: this.firForm.get('proceedingsDate')?.value,
//     proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value,
//     status: isSubmit ? 7 : undefined,
//   };

//   this.imagePreviews.forEach(image => {
//     formData.append('images', image.file, image.file.name);
//   });


//   // Append form fields to FormData
//   Object.keys(formFields).forEach((key) => {
//     const value = formFields[key as keyof typeof formFields];
//     formData.append(key, String(value));  // Convert value to string to avoid type issues
//   });




//   // List of fields that have file inputs
//   const filesFields = ['uploadJudgement', 'uploadJudgement_one', 'uploadJudgement_two','uploadProceedings'];

//   // Add files to FormData
//   filesFields.forEach((field) => {
//     const files = this.getFiles(field);  // Get the FileList for the file input field
//     console.log(field);
//     console.log(files);
//     if (files) {
//       for (let i = 0; i < files.length; i++) {
//         formData.append(field, files[i]);  // Append each file to FormData
//       }
//     }
//   });
//   const formDataObject = this.formDataToObject(formData);

//   console.log(formDataObject);
//   console.log("formFields");
//   // console.log(formData1);

//   // Now send the formData to the backend
//   this.firService.saveStepSevenAsDraft(formData).subscribe({
//     next: (response) => {
//       if (isSubmit) {
//         Swal.fire({
//           title: 'Success',
//           text: 'FIR Stage Form Completed! Redirecting to Chargesheet...',
//           icon: 'success',
//           confirmButtonText: 'OK',
//         }).then(() => {
//           this.navigateToChargesheetPage();
//         });
//       } else {
//         Swal.fire('Success', 'Step 5 data saved as draft successfully', 'success');
//       }
//     },
//     error: (error) => {
//       console.error('Error saving Step 5 data:', error);
//       Swal.fire('Error', 'Failed to save Step 5 data', 'error');
//     }
//   });

// }



  isVictimNameInvalid(index: number): boolean {
    const nameControl = this.victims.at(index).get('name');
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

  isDeceasedPersonNameInvalid(index: number): boolean {
    const deceasedNameControl = this.victims.at(index).get('deceasedPersonName');
    return deceasedNameControl?.invalid && deceasedNameControl?.touched ? true : false;
  }

  isVictimPincodeInvalid(index: number): boolean {
    const pincodeControl = this.victims.at(index)?.get('victimPincode');
    return !!(pincodeControl?.invalid && pincodeControl?.touched);
  }
  handleStepOne(type: string) {
    const firData = {
      ...this.firForm.value,


    };

    //console.log('Sending Step 1 Data:', firData); // Log data sent to backend

    this.firService.handleStepOne(this.firId, firData).subscribe(
      (response: any) => {
        //console.log('Response from backend:', response); // Log backend response

        if (!this.firId) {
          this.firId = response.fir_id; // Set FIR ID after initial creation
          if (this.firId) { // Ensure firId is not null
            localStorage.setItem('firId', this.firId.toString());
          }
        }


        if (type === 'manual') {
          this.step++;
        }
        Swal.fire('Success', `Step 1 handled successfully`, 'success');
      },
      (error) => {
        //console.error('Error handling Step 1:', error); // Log the error
        Swal.fire('Error', `Failed to handle Step 1`, 'error');
      }
    );
  }

  submitStepFive(): void {
    this.saveStepFiveAsDraft(true);
    this.updateFirStatus(5); // Calls Step 5 save with submission flag
  }

  submitStepSix(): void {
    const caseType = this.firForm.get('caseType')?.value;

    if (caseType === 'referredChargeSheet') {
      this.updateFirStatus_1();
    } else if (caseType === 'chargeSheet') {
      // Continue the process as usual
      this.saveAsDraft_6(true);
    } else {
      console.error('Invalid case type or case type not selected');
    }
  }

// Update FIR Status to 12 with SweetAlert
updateFirStatus_1(): void {
  if (!this.firId) {
    Swal.fire('Error', 'FIR ID is missing!', 'error');
    return;
  }

  this.firService.updateFirStatus_1(this.firId, 9).subscribe({
    next: (response) => {
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: 'This case is now marked as Mistake of Fact.',
      });
    },
    error: (error) => {
      Swal.fire('Error', 'Failed to update FIR status to Mistake of Fact.', 'error');
      console.error('Error updating FIR status:', error);
    },
  });
}



dateTimeValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
      const dateOfOccurrence = formGroup.get('dateOfOccurrence')?.value;
      const timeOfOccurrence = formGroup.get('timeOfOccurrence')?.value || '00:00';
      const dateOfRegistration = formGroup.get('dateOfRegistration')?.value;
      const timeOfRegistration = formGroup.get('timeOfRegistration')?.value || '00:00';

      if (dateOfOccurrence && dateOfRegistration) {
          const occurrenceDateTime = new Date(`${dateOfOccurrence}T${timeOfOccurrence}`);
          const registrationDateTime = new Date(`${dateOfRegistration}T${timeOfRegistration}`);

          if (registrationDateTime <= occurrenceDateTime) {
              return { invalidRegistrationDateTime: true };
          }
      }
      return null;
  };
}



  navigateToChargesheetPage(): void {
    // Set mainStep to 2 for Chargesheet Stage, assuming 1 is for FIR Stage
    this.mainStep = 2;
    this.step = 1; // Reset to the first sub-step of Chargesheet Stage
  }


  // onFileSelect1(event: any, index: number) {
  //   const files = event.target.files;
  //   const filesArray = Array.from(files); // Convert FileList to an array

  //   // Update the 'files' form control with the selected files
  //   this.attachments.at(index).get('files')?.setValue(filesArray);

  //   // Trigger change detection to update the UI
  //   this.cdr.detectChanges();
  // }


  // onSubmit(): void {
  //   console.log('Submitting form with step:', this.step); // Log current step

  //   if (this.step === 1 || this.step === 2) {
  //     if (this.firForm.valid) {
  //       console.log('Form is valid. Proceeding to handleStepOne.');
  //       this.handleStepOne('manual');
  //     } else {
  //       console.warn('Form is invalid. Please fill in all required fields.');
  //       Swal.fire('Error', 'Please fill in all required fields.', 'error');
  //     }
  //   } else if (this.step === 6) {
  //     // Skip validations for Step 6 and directly submit or update status
  //     console.log(`Submitting without validation for step ${this.step}.`);
  //     this.submitStepSix();
  //   } else {
  //     console.log(`Static form submission at step ${this.step}.`);
  //     Swal.fire('Info', `Step ${this.step} is a static form, no insertion.`, 'info');
  //     this.nextStep();
  //   }
  // }




  trackStep1FormValidity() {
    this.firForm.statusChanges.subscribe(() => {
      this.nextButtonDisabled = !this.isStep1Valid(); // Enable if Step 1 is valid
      this.cdr.detectChanges(); // Trigger change detection
    });
  }




// Check if the current step is valid
isStepValid(): boolean {
  if (this.step === 1) {
    return this.isStep1Valid();
  } else if (this.step === 2) {
    return this.isStep2Valid();
  } else if (this.step === 3) {
    return this.isStep3Valid();
  } else if (this.step === 4) {
    return this.isStep4Valid();
  } else if (this.step === 5) {
    return this.isStep5Valid();
  }
  return false;
}


isTabEnabled(stepNumber: number): boolean {
  // Enable only the current step or any previous step
  return stepNumber <= this.step;
}
// Check Step 1 validity
isStep1Valid(): boolean {
  const controls = [
    'policeCity',
    'policeZone',
    'policeRange',
    'revenueDistrict',

    'stationName',
    'officerName',
    'officerDesignation',
    'officerPhone',



  ];

  return controls.every((controlName) => this.firForm.get(controlName)?.valid === true);
}

isStep2Valid(): boolean {
  const controls = [
    'firNumber',
    'firNumberSuffix',
    'dateOfOccurrence',
    'timeOfOccurrence',
    'placeOfOccurrence',
    'dateOfRegistration',
    'timeOfRegistration',
  ];

  // Check if all required controls are valid
  const allControlsValid = controls.every((controlName) => this.firForm.get(controlName)?.valid === true);

  // Check for the custom validation error
  const noCustomErrors = !this.firForm.hasError('invalidRegistrationDateTime');

  // Return true only if all controls are valid and there are no custom errors
  return allControlsValid && noCustomErrors;
}



// Check Step 3 validity
isStep3Valid(): boolean {
  // Check if the complainant details section is valid
  const complainantDetails = this.firForm.get('complainantDetails');
  const isComplainantValid = complainantDetails ? complainantDetails.valid === true : false;

  // Check if the victims form array is valid
  const victimsValid = this.victims.controls.every(victim => victim.valid === true);

  // Check if the 'isDeceased' and 'deceasedPersonNames' fields are valid
  const isDeceased = this.firForm.get('isDeceased')?.value;
  const isDeceasedValid = isDeceased !== '' &&
                          (isDeceased === 'no' || (this.firForm.get('deceasedPersonNames')?.valid === true));

  // Ensure all conditions return a boolean
  return Boolean(isComplainantValid && victimsValid && isDeceasedValid);
}


isStep6Valid(): boolean {
  console.log('Form validity:', this.firForm.valid);

  const caseType = this.firForm.get('caseType')?.value;
  console.log('Selected caseType:', caseType);

  // Define fields to validate based on caseType
  let controls: string[] = [];

  if (caseType === 'chargeSheet') {
    // Validate fields specific to `chargeSheet`
    controls = [
      'caseNumber',
      'chargeSheetFiled',
      'courtDistrict',
      'courtName',
      'caseType',
      'reliefAmountScst_1',
      'reliefAmountExGratia_1',
      'reliefAmountSecondStage',
      'totalCompensation_1',
      'proceedingsFileNo_1',
      'proceedingsDate_1',
      'uploadProceedings_1',
    ];
    // Reset `referredChargeSheet` specific fields

  } else if (caseType === 'referredChargeSheet') {
    // Validate fields specific to `referredChargeSheet`
    controls = [
      'rcsFileNumber',
      'rcsFilingDate',
      'mfCopy',
      'chargeSheetFiled',
      'courtDistrict',
      'courtName',
      'caseType',
    ];


  } else {
    // If no caseType is selected, mark form as invalid
    console.error('Invalid caseType selected.');
    return false;
  }

  // Perform validation for all relevant fields
  const allValid = controls.every((controlName) => {
    const control = this.firForm.get(controlName);

    if (control) {
      control.markAsTouched(); // Trigger validation visuals
      if (!control.valid) {
        console.log(`${controlName} is invalid`, control.errors);
      }
    }

    return control ? control.valid : true;
  });

  return allValid;
}
resetFields(fields: string[]): void {
  fields.forEach((field) => {
    const control = this.firForm.get(field);
    if (control) {
      control.reset();
      control.clearValidators();
      control.updateValueAndValidity();
    }
  });
}











nextStep(): void {
  this.nextButtonClicked = true; // Indicate 'Next' button clicked

  // Check if the current step is valid before moving to the next
  if (this.step === 1 && this.isStep1Valid()) {
    this.saveStepOneAsDraft();
    this.updateFirStatus(1); // Update status for step 1
    this.step++;
  } else if (this.step === 2 && this.isStep2Valid()) {
    this.saveStepTwoAsDraft();
    this.updateFirStatus(2); // Update status for step 2
    this.step++;
  } else if (this.step === 3 && this.isStep3Valid()) {
    this.saveStepThreeAsDraft();
    this.updateFirStatus(3); // Update status for step 3
    this.step++;
  } else if (this.step === 4 && this.isStep4Valid()) {
    this.saveStepFourAsDraft();
    this.updateFirStatus(4); // Update status for step 4
    this.step++;
  } else if (this.step === 5 && this.isStep5Valid()) {
    this.submitStepFive(); // Final submission for Step 5
    this.updateFirStatus(5); // Update status for step 5 on submission
    this.loadVictimsReliefDetails();

  } else {
    // Show an error message if the required fields are not filled
    Swal.fire('Error', 'Please fill in all required fields before proceeding.', 'error');
  }

  this.nextButtonClicked = false; // Reset the flag after navigation
}





// Method to update FIR status
updateFirStatus(status: number): void {
  if (this.firId) {
    this.firService.updateFirStatus(this.firId, status).subscribe(
      (response: any) => {
        //console.log('FIR status updated to:', status);
      },
      (error) => {
        //console.error('Error updating FIR status:', error);
        Swal.fire('Error', 'Failed to update FIR status.', 'error');
      }
    );
  }
}



navigateToStep(stepNumber: number): void {
  this.step = stepNumber; // Update the current step
  this.cdr.detectChanges(); // Trigger UI update
  if (stepNumber === 5) {
    this.loadVictimsReliefDetails(); // Fetch victim relief details only for step 5
  }
}




isStep4Valid(): boolean {
  const numberOfAccusedValid = !!this.firForm.get('numberOfAccused')?.valid;
  const accusedsArray = this.firForm.get('accuseds') as FormArray;

  // Check if all accused form groups are valid
  const accusedsValid = accusedsArray.controls.every((accusedGroup) => !!accusedGroup.valid);

  // Return true only if both conditions are satisfied
  return numberOfAccusedValid && accusedsValid;
}

isStep5Valid(): boolean {
  // Validate mandatory fields directly
  const mandatoryFields = [
    'communityCertificate',
    'proceedingsFileNo',
    'proceedingsDate',
    'proceedingsFile',
  ];

  // Check each field's validity
  let isFormValid = true;
  mandatoryFields.forEach((field) => {
    const control = this.firForm.get(field);
    const value = control?.value;
    const isValid = control?.disabled || (control?.valid === true && value !== null && value !== '');
    console.log(`Field: ${field}, Value: ${value}, Valid: ${isValid}`);

    if (!isValid) {
      isFormValid = false;
    }
  });

  // Validate attachments
  const areAttachmentsValid = this.attachments.controls.every((control, index) => {
    const fileControl = control.get('file');
    const value = fileControl?.value;
    const isValid = value === null || (fileControl?.valid === true && value !== '');

    console.log(`Attachment ${index + 1} - Value: ${value}, Valid: ${isValid}`);

    return isValid;
  });

  console.log(`Attachments Valid: ${areAttachmentsValid}`);

  // Final validation status
  const finalStatus = isFormValid && areAttachmentsValid;
  console.log(`Step 5 Form Valid: ${finalStatus}`);
  return finalStatus;
}













  previousStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  setStep(stepNumber: number) {
    this.step = stepNumber;
  }

  onIsDeceasedChange(index: number) {
    const victim = this.victims.at(index);
    const isDeceased = victim.get('isDeceased')?.value;

    if (isDeceased === 'yes') {
      // If "Yes", make the deceased person's name field required
      victim.get('deceasedPersonName')?.setValidators(Validators.required);
    } else {
      // If "No", reset and clear validators for the deceased person's name field
      victim.get('deceasedPersonName')?.reset();
      victim.get('deceasedPersonName')?.clearValidators();
    }

    victim.get('deceasedPersonName')?.updateValueAndValidity(); // Update the validation state
  }

  onIsArrestedChange(index: number) {
    const accused = this.accuseds.at(index);
    if (accused.get('isArrested')?.value) {
      accused.get('reasonForNonArrest')?.reset();
    }
  }

  onPreviousIncidentsChange(index: number) {
    const accused = this.accuseds.at(index);
    const previousIncident = accused.get('previousIncident')?.value;

    if (previousIncident) {
      // If "Yes", make the previous FIR fields required
      accused.get('previousFIRNumber')?.setValidators(Validators.required);
      accused.get('previousFIRNumberSuffix')?.setValidators(Validators.required);
    } else {
      // If "No", reset and clear validators for the previous FIR fields
      accused.get('previousFIRNumber')?.reset();
      accused.get('previousFIRNumber')?.clearValidators();
      accused.get('previousFIRNumberSuffix')?.reset();
      accused.get('previousFIRNumberSuffix')?.clearValidators();
    }

    accused.get('previousFIRNumber')?.updateValueAndValidity();
    accused.get('previousFIRNumberSuffix')?.updateValueAndValidity();
  }

  onScstOffencesChange(index: number) {
    const accused = this.accuseds.at(index);
    const scstOffence = accused.get('scstOffence')?.value;

    if (scstOffence) {
      // If "Yes", make the SC/ST FIR fields required
      accused.get('scstFIRNumber')?.setValidators(Validators.required);
      accused.get('scstFIRNumberSuffix')?.setValidators(Validators.required);
    } else {
      // If "No", reset and clear validators for the SC/ST FIR fields
      accused.get('scstFIRNumber')?.reset();
      accused.get('scstFIRNumber')?.clearValidators();
      accused.get('scstFIRNumberSuffix')?.reset();
      accused.get('scstFIRNumberSuffix')?.clearValidators();
    }

    accused.get('scstFIRNumber')?.updateValueAndValidity();
    accused.get('scstFIRNumberSuffix')?.updateValueAndValidity();
  }



  onFileDrop(event: any): void {
    this.processFiles(event);
  }
    // Handle when a file is dragged over the drop zone
    onFileOver(event: any): void {
      this.isFileOver = true; // You can change styling here for drag-over effect
    }
  onFileLeave(event: any): void {
    this.isFileOver = false; // Reset styling when file leaves the drop zone
  }



  // Process files for preview and upload
  processFiles(files: FileList | File[]): void {
    const newFiles = Array.from(files); // Convert to array if it's a FileList

    newFiles.forEach(file => {
      if (file instanceof File) { // Make sure it's a File (could be needed for type safety)

        // Optional: Check if the file is an image
        if (!file.type.startsWith('image/')) {
          console.error('Invalid file type:', file.type);
          return; // Skip non-image files
        }

        const reader = new FileReader();

        // Once file is loaded, push preview to the array
        reader.onload = (e: any) => {
          // Push the file and its Data URL to the imagePreviews array
          this.imagePreviews.push({ file: file, url: e.target.result });
        };

        // Handle errors in reading the file
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
        };

        // Read file as a Data URL (base64 string)
        reader.readAsDataURL(file);
      }
    });
  }


  // Remove an image from preview array
  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }



  onJudgementSelectionChangehearing(event: any): void {
    const value = event.target.value;
    console.log(value);
    if (value === 'yes') {
      this.firForm.get('judgementDetails.judgementNature')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails.uploadJudgement')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails.judgementNature')?.clearValidators();
      this.firForm.get('judgementDetails.uploadJudgement')?.clearValidators();
      this.hideCompensationSection = true;
    }

    this.firForm.get('judgementDetails.judgementNature')?.updateValueAndValidity();
    this.firForm.get('judgementDetails.uploadJudgement')?.updateValueAndValidity();
    this.hideCompensationSection = true;
  }

  onJudgementSelectionChange_one(event: any): void {
    const value = event.target.value;

    if (value === 'yes') {
      this.firForm.get('judgementDetails_one.judgementNature_one')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.setValidators([Validators.required]);

      // Clear validators for hearingDetails_one (if any)
      this.hearingDetails_one.controls.forEach((control) => {
        control.get('nextHearingDate_one')?.clearValidators();
        control.get('reasonNextHearing_one')?.clearValidators();
        control.get('nextHearingDate_one')?.updateValueAndValidity();
        control.get('reasonNextHearing_one')?.updateValueAndValidity();

      });
    } else if (value === 'no') {
      this.firForm.get('judgementDetails_one.judgementNature_one')?.clearValidators();
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.clearValidators();
      this.firForm.get('judgementDetails_one.judgementNature_one')?.updateValueAndValidity();
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.updateValueAndValidity();
      this.hideCompensationSection = true;
      // Set validators for hearingDetails_one
      this.hearingDetails_one.controls.forEach((control) => {
        control.get('nextHearingDate_one')?.setValidators([Validators.required]);
        control.get('reasonNextHearing_one')?.setValidators([Validators.required]);
        control.get('nextHearingDate_one')?.updateValueAndValidity();
        control.get('reasonNextHearing_one')?.updateValueAndValidity();
      });
    }

    this.cdr.detectChanges(); // Ensure UI updates
  }


  onJudgementSelectionChangehearing1(event: any): void {
    const value = event.target.value;

    if (value === 'yes') {
      this.firForm.get('judgementDetails_one.judgementNature_one')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.setValidators([Validators.required]);

      // Clear validators for hearingDetails_one (if any)
      this.hearingDetails_one.controls.forEach((control) => {
        control.get('nextHearingDate_one')?.clearValidators();
        control.get('reasonNextHearing_one')?.clearValidators();
        control.get('nextHearingDate_one')?.updateValueAndValidity();
        control.get('reasonNextHearing_one')?.updateValueAndValidity();

      });
    } else if (value === 'no') {
      this.firForm.get('judgementDetails_one.judgementNature_one')?.clearValidators();
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.clearValidators();
      this.firForm.get('judgementDetails_one.judgementNature_one')?.updateValueAndValidity();
      this.firForm.get('judgementDetails_one.uploadJudgement_one')?.updateValueAndValidity();
      this.hideCompensationSection = true;
      // Set validators for hearingDetails_one
      this.hearingDetails_one.controls.forEach((control) => {
        control.get('nextHearingDate_one')?.setValidators([Validators.required]);
        control.get('reasonNextHearing_one')?.setValidators([Validators.required]);
        control.get('nextHearingDate_one')?.updateValueAndValidity();
        control.get('reasonNextHearing_one')?.updateValueAndValidity();
      });
    }

    this.cdr.detectChanges(); // Ensure UI updates
  }


  onJudgementSelectionChange_two(event: any): void {
    const value = event.target.value;
    if (value === 'yes') {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.clearValidators();
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.clearValidators();
      this.hideCompensationSection = true;
    }
    this.firForm.get('judgementDetails_two.judgementNature_two')?.updateValueAndValidity();
    this.firForm.get('judgementDetails_two.uploadJudgement_two')?.updateValueAndValidity();
    this.hideCompensationSection = true;
  }

  onJudgementSelectionChangehearing2(event: any): void {
    const value = event.target.value;
    if (value === 'yes') {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.clearValidators();
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.clearValidators();
      this.hideCompensationSection = true;
    }
    this.firForm.get('judgementDetails_two.judgementNature_two')?.updateValueAndValidity();
    this.firForm.get('judgementDetails_two.uploadJudgement_two')?.updateValueAndValidity();
    this.hideCompensationSection = true;
  }

  onJudgementNatureChange_two(): void {
    const judgementNature = this.firForm.get('judgementDetails_two.judgementNature_two')?.value;
    if (judgementNature === 'Convicted_two') {
      this.showLegalOpinionObtained_two = false;
      this.showFiledBy_two = false;
      this.showDesignatedCourt_two = false;
      this.hideCompensationSection = false;
    } else if (judgementNature === 'Acquitted_two') {
      this.showLegalOpinionObtained_two = true;
      this.showFiledBy_two = true;
      this.showDesignatedCourt_two = true;
      this.hideCompensationSection = true;
    }
  }













}
