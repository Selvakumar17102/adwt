import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, Event as RouterEvent } from '@angular/router';
import { FormControl, AbstractControl } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { CommonModule,formatDate  } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FirService } from 'src/app/services/fir.service';

import Swal from 'sweetalert2';
import { MatRadioModule } from '@angular/material/radio';
import Tagify from '@yaireo/tagify';
declare var $: any;

interface HearingDetail {
  nextHearingDate?: string;  // The date for the next hearing
  reasonNextHearing?: string;  // The reason for the next hearing
}


// Define the Officer interface
interface Officer {
  officer_id?: string; // optional because it might not exist initially
  name: string;
  designation: string;
  phone: string;
}
interface FileWithPreview extends File {
  previewUrl: string;  // Add previewUrl for images
}
interface FileWithPreview1 extends File {
  previewUrl: string;  // Add previewUrl for images
}
interface FileWithPreview2 extends File {
  previewUrl: string;  // Add previewUrl for images
}
interface ImagePreview {
  file: File;
  url: string;
  index: number;
}

@Component({
  selector: 'app-edit-fir',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    NgxDropzoneModule
  ],
  templateUrl: './edit-fir.component.html',
  styleUrl: './edit-fir.component.scss'
})
export class EditFirComponent implements OnInit, OnDestroy {


  @ViewChild('fileInput') fileInput: any;
  imagePreviews: { url: string, file: File }[] = []; 
  imagePreviews3: { url: string, file: File }[] = []; 
  imagePreviews2: { url: string, file: File }[] = []; 
  imagePreviews1: ImagePreview[] = [];
  isClickTriggered = false;
  isClickTriggered1 = false;
  isClickTriggered2 = false; 
  allFiles: { chargesheet_attachment_id: number, file_path: string }[] = [];
  allFiles1: { chargesheet_attachment_id: number, file_path: string }[] = [];
  isFileOver: boolean = false; 
  communitiesOptions: string[] = [];
  isFileOver1: boolean = false; 
  isFileOver2: boolean = false; 
  files: FileWithPreview[] = [];   
  files1: FileWithPreview1[] = [];   
  files2: FileWithPreview2[] = [];   
  mainStep: number = 1;
  step: number = 1;
  firForm: FormGroup;
  firId: string | null = null;
  chargesheet_id: string | null = null;


  case_id: string | undefined = '';
        case_id1: string | undefined = '';
        case_id2: string | undefined = '';

  userId: string = '';
  loading: boolean = false;
  yearOptions: number[] = [];
  today: string = '';
  nextButtonDisabled: boolean = true;
  victimNames: string[] = [];
  nextButtonClicked: boolean = false; // Track if 'Next' was clicked
  tabNavigation: boolean = false; // Track if main tab is clicked
  numberOfVictims: number = 0;

  showJudgementCopy: boolean = false;
  showLegalOpinionObtained: boolean = false;
  showCaseFitForAppeal: boolean = false;
  showGovernmentApproval: boolean = false;
  showFiledBy: boolean = false;
  showDesignatedCourt: boolean = false;
  courtDivisions: string[] = [];
  courtRanges: string[] = [];

  showDuplicateSection_1: boolean = false;
  showLegalOpinionObtained_two: boolean = false;
  showFiledBy_two: boolean = false;
  showDesignatedCourt_two: boolean = false;
  showCaseFitForAppeal_two: boolean = false;

  hideCompensationSection: boolean = false;


  showDuplicateSection = false; // To show/hide the duplicate form section
  showLegalOpinionObtained_one = false;
  showFiledBy_one = false;
  showDesignatedCourt_one = false;
  showCaseFitForAppeal_one = false;


  reliefValues: any;

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

  @ViewChild('tagifyInput', { static: false }) tagifyInput!: ElementRef;
  // sectionsIPC: string[] = []; // Array to store multiple tags


  // Dropdown options
  policeCities: string[] = [];
  policeZones: string[] = [];
  policeRanges: string[] = [];
  revenueDistricts: string[] = [];


  offenceOptions: string[] = [];
  offenceActsOptions: string[] = [];
  scstSectionsOptions: string[] = [];
  // alphabetList: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  // stationNumbers: number[] = Array.from({ length: 99 }, (_, k) => k + 1);
  firNumberOptions: number[] = Array.from({ length: 99 }, (_, k) => k + 1);
  selectedAdditionalReliefs: string[] = [];
  policeStations: string[] = [];
  victimCountArray: number[] = [];
  i: number;
  specialCourtname: string[] = [];
  constructor(
    private fb: FormBuilder,
    private firService: FirService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  onDrop1(event: DragEvent): void {
    if (event.dataTransfer?.files) {
      const droppedFiles = Array.from(event.dataTransfer.files); // Convert FileList to File[] 
      droppedFiles.forEach(file => {
        // Ensure that only image files are processed
        if (file && file.type && file.type.startsWith('image/')) {
          const reader = new FileReader();

          reader.onload = (e: any) => {
            const fileWithPreview1: FileWithPreview1 = {
              ...file,
              previewUrl: e.target.result // Set the base64 URL for the preview
            };
            this.files1.push(fileWithPreview1);
            this.imagePreviews2.push({ file: file, url: e.target.result });

            // Manually trigger change detection to update the view immediately
            this.cdr.detectChanges();
          };

          reader.readAsDataURL(file); // Convert image to base64 data URL
        }
      });
      this.uploadFiles(droppedFiles);
    }
  }
  onDrop2(event: DragEvent): void {
    if (event.dataTransfer?.files) {
      const droppedFiles = Array.from(event.dataTransfer.files); // Convert FileList to File[] 
      droppedFiles.forEach(file => {
        // Ensure that only image files are processed
        if (file && file.type && file.type.startsWith('image/')) {
          const reader = new FileReader();

          reader.onload = (e: any) => {
            const fileWithPreview2: FileWithPreview2 = {
              ...file,
              previewUrl: e.target.result // Set the base64 URL for the preview
            };
            this.files2.push(fileWithPreview2);
            this.imagePreviews3.push({ file: file, url: e.target.result });

            // Manually trigger change detection to update the view immediately
            this.cdr.detectChanges();
          };

          reader.readAsDataURL(file); // Convert image to base64 data URL
        }
      });
      this.uploadFiles(droppedFiles);
    }
  }
  onDrop(event: DragEvent): void {
    if (event.dataTransfer?.files) {
      const droppedFiles = Array.from(event.dataTransfer.files); // Convert FileList to File[]

      droppedFiles.forEach(file => {
        // Ensure that only image files are processed
        if (file && file.type && file.type.startsWith('image/')) {
          const reader = new FileReader();

          reader.onload = (e: any) => {
            const fileWithPreview: FileWithPreview = {
              ...file,
              previewUrl: e.target.result // Set the base64 URL for the preview
            };
            this.files.push(fileWithPreview);
            this.imagePreviews.push({ file: file, url: e.target.result });

            // Manually trigger change detection to update the view immediately
            this.cdr.detectChanges();
          };

          reader.readAsDataURL(file); // Convert image to base64 data URL
        }
      });
      this.uploadFiles(droppedFiles);
    }
  }

  uploadFiles(files: File[]): void {
    const formData = new FormData();

  // Append each file to the form data
  files.forEach((file, index) => {
    formData.append('images', file, file.name); // 'images' is the key expected by the backend
  }); 
  }
  
  onFileOver1(event: Event): void {
    // Check if the event is related to the drag-over action
    this.isFileOver1 = event.type === 'dragenter'; // 'dragenter' indicates the drag is over the dropzone
  }

  removeFile1(index: number): void {
    this.files1.splice(index, 1);
    this.imagePreviews2.splice(index, 1);
  }

  removeFile2(index: any): void {
    const attachmentIdToDelete = this.allFiles[index].chargesheet_attachment_id;
   
    this.allFiles.splice(index, 1);  
    this.removeAttachmentFromBackend1(attachmentIdToDelete);
  }
  removeAttachmentFromBackend1(id: number): void {
    this.firService.removeAttachmentFromBackend1(id).subscribe(
      response => {
        console.log('Attachment removed successfully:', response);
      },
      error => {
        console.error('Error removing attachment:', error);
      }
    );
  }
  removeAttachmentFromBackend(id: number): void {
    this.firService.removeAttachmentFromBackend(id).subscribe(
      response => {
        console.log('Attachment removed successfully:', response);
      },
      error => {
        console.error('Error removing attachment:', error);
      }
    );
  }
  removeFile4(index: any): void {
    const attachmentIdToDelete = this.allFiles1[index].chargesheet_attachment_id;
   
    this.allFiles1.splice(index, 1);  
    this.removeAttachmentFromBackend(attachmentIdToDelete);
  }

  onFileOver2(event: Event): void {
    // Check if the event is related to the drag-over action
    this.isFileOver2 = event.type === 'dragenter'; // 'dragenter' indicates the drag is over the dropzone
  }

  removeFile3(index: number): void {
    this.files2.splice(index, 1);
    this.imagePreviews3.splice(index, 1);
  }
  
  onFileOver(event: Event): void {
    // Check if the event is related to the drag-over action
    this.isFileOver = event.type === 'dragenter'; // 'dragenter' indicates the drag is over the dropzone
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  onChange2(event: Event): void { 
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files) {
      const selectedFiles = Array.from(inputElement.files);  // Convert FileList to File[]
      this.processFiles2(selectedFiles);  // Process the selected files
    } else {
      console.log('No files selected or the input is empty');
    } 
    // Once files are processed, reset the flag to allow the next click
    this.isClickTriggered1 = false;
  }

  onChange1(event: Event): void { 
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files) {
      const selectedFiles = Array.from(inputElement.files);  // Convert FileList to File[]
      this.processFiles1(selectedFiles);  // Process the selected files
    } else {
      console.log('No files selected or the input is empty');
    } 
    // Once files are processed, reset the flag to allow the next click
    this.isClickTriggered1 = false;
  }

  onChange(event: Event): void { 
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files) {
      const selectedFiles = Array.from(inputElement.files);  // Convert FileList to File[]
      this.processFiles(selectedFiles);  // Process the selected files
    } else {
      console.log('No files selected or the input is empty');
    } 
    // Once files are processed, reset the flag to allow the next click
    this.isClickTriggered = false;
  }

  

  triggerFileInputClick2(): void {
    if (!this.isClickTriggered2) { 
      this.isClickTriggered2 = true;  // Set flag to prevent further triggers
      this.fileInput.nativeElement.click();  // Simulate click on the file input
    }
  }
    triggerFileInputClick1(): void {
    if (!this.isClickTriggered1) { 
      this.isClickTriggered1 = true;  // Set flag to prevent further triggers
      this.fileInput.nativeElement.click();  // Simulate click on the file input
    }
  }
  
  triggerFileInputClick(): void {
    if (!this.isClickTriggered) { 
      this.isClickTriggered = true;  // Set flag to prevent further triggers
      this.fileInput.nativeElement.click();  // Simulate click on the file input
    }
  }
  
  processFiles1(files: File[]): void {

    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
  
        // Once the file is read, create a preview URL
        reader.onload = (e: any) => {
          const fileWithPreview1: FileWithPreview1 = {
            ...file,              // Spread the original file properties
            previewUrl: e.target.result  // Set the base64 URL for preview
          }; 
          this.files1.push(fileWithPreview1);  // Add the file with preview to the array
          this.imagePreviews2.push({ file: file, url: e.target.result }); 
          this.cdr.detectChanges(); 
        };
  
        reader.readAsDataURL(file);  // Convert image to base64 URL
      }
    });
    this.isClickTriggered1 = false;
  }
  processFiles2(files: File[]): void {

    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
  
        // Once the file is read, create a preview URL
        reader.onload = (e: any) => {
          const fileWithPreview2: FileWithPreview2 = {
            ...file,              // Spread the original file properties
            previewUrl: e.target.result  // Set the base64 URL for preview
          }; 
          this.files2.push(fileWithPreview2);  // Add the file with preview to the array
          this.imagePreviews3.push({ file: file, url: e.target.result }); 
          this.cdr.detectChanges(); 
        };
  
        reader.readAsDataURL(file);  // Convert image to base64 URL
      }
    });
    this.isClickTriggered1 = false;
  }

  // Helper method to process files and generate preview URL
  processFiles(files: File[]): void {

    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
  
        // Once the file is read, create a preview URL
        reader.onload = (e: any) => {
          const fileWithPreview: FileWithPreview = {
            ...file,              // Spread the original file properties
            previewUrl: e.target.result  // Set the base64 URL for preview
          };
          this.files.push(fileWithPreview);  // Add the file with preview to the array
          this.cdr.detectChanges(); 
        };
  
        reader.readAsDataURL(file);  // Convert image to base64 URL
      }
    });
    // this.isClickTriggered = false;
  }
  



  // onFileDrop(event: any): void { 
  //   if (event.files) {
  //     this.processFiles(event.files);  // Access the dropped files directly
  //   }
  // }

  // // Handle when a file is dragged over the drop zone
  // onFileOver(event: any): void {
  //   this.isFileOver = true;  // Set to true to show the drag-over effect
  // }

  // // Handle when a file is dragged out of the drop zone
  // onFileLeave(event: any): void {
  //   this.isFileOver = false;  // Reset the effect when file leaves
  // }

  // Process files for preview and upload
  // processFiles(files: FileList | File[]): void {
  //   const newFiles = Array.from(files);  // Convert FileList to an array if needed 
  //   newFiles.forEach(file => {
  //     if (file instanceof File) { 

  //       // Check if the file is an image
  //       if (!file.type.startsWith('image/')) {
  //         console.error('Invalid file type:', file.type);
  //         return;  // Skip non-image files
  //       }

  //       const reader = new FileReader();

  //       // Once file is loaded, push preview to the array
  //       reader.onload = (e: any) => {
  //         this.imagePreviews.push({ file: file, url: e.target.result });
  //       };

  //       // Handle errors in reading the file
  //       reader.onerror = (error) => {
  //         console.error('Error reading file:', error);
  //       };

  //       // Read file as a Data URL (base64 string)
  //       reader.readAsDataURL(file);
  //     }
  //   }); 
  // }

  // Remove an image from the preview array
  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }



  triggerChangeDetection() {
    this.cdr.detectChanges();
  }
  
  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      const firId = params['fir_id'];
      if (firId) {
        sessionStorage.setItem('firId', firId); // Save FIR ID to session storage
      }
    });


    this.generateVictimCount();  
    this.initializeForm();
    this.firId = this.getFirIdFromSession(); // Get FIR ID from session storage 
    if(!this.firId)
    { 
      this.clearSession();
    } 
    this.loadOptions();
    this.loadOffenceActs();
    this.loadScstSections();
    this.generateYearOptions();
    // this.loadnativedistrict();
    this.loadVictimsDetails();

    this.loadCourtDivisions();
    this.loadCommunities();

    this.loadPoliceDivisionDetails();

    this.loadDistricts();
    this.updateValidationForCaseType(); 
    if (this.firId) {
      this.loadFirDetails(this.firId);
      //console.log(`Using existing FIR ID: ${this.firId}`);
    } else {
      //console.log('Creating a new FIR entry');
    }

    // Listen for route changes
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this.firId = this.getFirIdFromSession();
        if(!this.firId)
          { 
            this.clearSession();
          } 
      }
    });

    this.userId = sessionStorage.getItem('userId') || '';

    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];
    // if (this.userId) {
    //   this.loadUserData();
    // }
    this.ngAfterViewInit();
    this.trackStep1FormValidity();
    this.firForm.statusChanges.subscribe(() => {
      if (!this.tabNavigation) {
        // Only validate when not navigating tabs
        this.nextButtonDisabled = !this.isStepValid();
        this.cdr.detectChanges();
      }
    });


    const preFilledDistrict = this.firForm.get('policeCity')?.value; // Get pre-filled district
    if (preFilledDistrict) {
      this.loadPoliceStations(preFilledDistrict); // Load stations for the pre-filled district
    }

    // Watch for district changes and reload stations dynamically
    this.firForm.get('policeCity')?.valueChanges.subscribe((district) => {
      this.loadPoliceStations(district);
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
  loadCommunities(): void {
    this.firService.getAllCommunities().subscribe(
      (communities: string[]) => {

        // console.log('Communities fetched:', communities);

        this.communitiesOptions = communities;
      },
      (error) => {
        console.error('Error loading communities:', error);
        Swal.fire('Error', 'Failed to load communities.', 'error');
      }
    );
  }
  onCourtDivisionChange1(value: any): void { 

    if (value) {
      this.firService.getCourtRangesByDivision(value).subscribe(
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
  loadFirDetails(firId: string): void {

    this.firService.getFirDetails(firId).subscribe(
      (response) => {

        console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",response);

        this.showDuplicateSection = false;
        this.showDuplicateSection_1 = false;

        

        if (response.data5 && response.data5.length > 0) {

          response.data5.forEach((item: any, index: number) => {

            if (index === 0) {

              this.case_id = item.case_id || '';
              // Populate main section
              this.firForm.patchValue({
                Court_name1: item.court_name || '',
                trialCourtDistrict: item.court_district || '',
                trialCaseNumber: item.trial_case_number || '',
                publicProsecutor: item.public_prosecutor || '',
                prosecutorPhone: item.prosecutor_phone || '',
                firstHearingDate: item.first_hearing_date ? formatDate(item.first_hearing_date, 'yyyy-MM-dd', 'en') : '',
                judgementAwarded: item.judgement_awarded || '',
              });
        
              // Handle hearing details for the main section
              if (item.hearingDetails && Array.isArray(item.hearingDetails)) {
                const hearingDetailsControl = this.firForm.get('hearingDetails') as FormArray;
                hearingDetailsControl.clear();
                item.hearingDetails.forEach((hearing: HearingDetail) => {
                  hearingDetailsControl.push(this.createHearingDetailGroup());
                });
              }
            } else if (index === 1) {
              this.case_id1 = item.case_id || '';
              // Populate duplicate section 1
              this.showDuplicateSection = true;
              this.firForm.patchValue({
                Court_one: item.court_name || '',
                courtDistrict_one: item.court_district || '',
                caseNumber_one: item.trial_case_number || '',
                publicProsecutor_one: item.public_prosecutor || '',
                prosecutorPhone_one: item.prosecutor_phone || '',
                firstHearingDate_one: item.first_hearing_date ? formatDate(item.first_hearing_date, 'yyyy-MM-dd', 'en') : '',
                judgementAwarded_one: item.judgement_awarded || '',
              });
        
              // Handle hearing details for duplicate section 1
              if (item.hearingDetails_one && Array.isArray(item.hearingDetails_one)) {
                const hearingDetailsControl = this.firForm.get('hearingDetails_one') as FormArray;
                hearingDetailsControl.clear();
                item.hearingDetails_one.forEach((hearing: HearingDetail) => {
                  hearingDetailsControl.push(this.createHearingDetailGroup_one());
                });
              }
            } else if (index === 2) {
              this.case_id2 = item.case_id || '';
              // Populate duplicate section 2
              this.showDuplicateSection_1 = true;
              this.firForm.patchValue({
                Court_three: item.court_name || '',
                courtDistrict_two: item.court_district || '',
                caseNumber_two: item.trial_case_number || '',
                publicProsecutor_two: item.public_prosecutor || '',
                prosecutorPhone_two: item.prosecutor_phone || '',
                firstHearingDate_two: item.first_hearing_date ? formatDate(item.first_hearing_date, 'yyyy-MM-dd', 'en') : '',
                judgementAwarded_two: item.judgement_awarded || '',
              });
        
              // Handle hearing details for duplicate section 2
              if (item.hearingDetails_two && Array.isArray(item.hearingDetails_two)) {
                const hearingDetailsControl = this.firForm.get('hearingDetails_two') as FormArray;
                hearingDetailsControl.clear();
                item.hearingDetails_two.forEach((hearing: HearingDetail) => {
                  hearingDetailsControl.push(this.createHearingDetailGroup_two());
                });
              }
            }
          });

          // console.log('Case IDs:', { case_id, case_id1, case_id2 });
        }
        
        


        // if(response.data.police_station)
        // {
        //   const str = response.data.police_station ?? ''; // Ensures that str is at least an empty string if null or undefined
        //   const result = str.split("-");
        //   this.firForm.get('alphabetSelection')?.setValue(result[0]);
        //   this.firForm.get('stationNumber')?.setValue(result[1]);
        //   this.firForm.get('stationName')?.setValue(result[2]);
        // }  

        // step 1
        if(response.data.police_city){
          this.firForm.get('policeCity')?.setValue(response.data.police_city);
        }
        if(response.data.police_range){
          this.firForm.get('policeRange')?.setValue(response.data.police_range); 
        }
        if(response.data.police_zone){
          this.firForm.get('policeZone')?.setValue(response.data.police_zone); 
        }
        if(response.data.revenue_district){
          this.firForm.get('revenueDistrict')?.setValue(response.data.revenue_district); 
        }
        if(response.data.police_station){
          this.firForm.get('stationName')?.setValue(response.data.police_station); 
        }
        if(response.data.officer_name){
          this.firForm.get('officerName')?.setValue(response.data.officer_name); 
        }
        if(response.data.officer_designation){
          this.firForm.get('officerDesignation')?.setValue(response.data.officer_designation); 
        }
        if(response.data.officer_phone){
          this.firForm.get('officerPhone')?.setValue(response.data.officer_phone); 
        }

        // step 2
        if(response.data.fir_number){
          this.firForm.get('firNumber')?.setValue(response.data.fir_number); 
        }
        if(response.data.fir_number_suffix){
          this.firForm.get('firNumberSuffix')?.setValue(response.data.fir_number_suffix); 
        }
        if(response.data.date_of_occurrence) { 
          const dateObj = new Date(response.data.date_of_occurrence);
          const formattedDate = dateObj.toISOString().split('T')[0];
          this.firForm.get('dateOfOccurrence')?.setValue(formattedDate);
        }
        if(response.data.time_of_occurrence){
          this.firForm.get('timeOfOccurrence')?.setValue(response.data.time_of_occurrence); 
        }
        if(response.data.place_of_occurrence){
          this.firForm.get('placeOfOccurrence')?.setValue(response.data.place_of_occurrence); 
        }
        if(response.data.date_of_registration){
          const dateObj1 = new Date(response.data.date_of_occurrence);
          const formattedDate1 = dateObj1.toISOString().split('T')[0];
          this.firForm.get('dateOfRegistration')?.setValue(formattedDate1); 
        }
        if(response.data.time_of_registration){
          this.firForm.get('timeOfRegistration')?.setValue(response.data.time_of_registration); 
        }

        // step 3
        // if(response.data.sections_ipc){
        //   this.firForm.get('sectionsIPC')?.setValue(response.data.sections_ipc); 
        // }
        // if (response.data.nature_of_offence) {
        //   // Split the comma-separated string into an array
        //   const selectedOffences = response.data.nature_of_offence.split(',').map((offence: string) => offence.trim()); 
        
        //   // Set the selected offences to the form control
        //   this.firForm.get('natureOfOffence')?.setValue(selectedOffences); 
        // }

        if(response.data.name_of_complainant){ 
          this.firForm.get('complainantDetails.nameOfComplainant')?.setValue(response.data.name_of_complainant); 
        }
        if(response.data.mobile_number_of_complainant){
          this.firForm.get('complainantDetails.mobileNumberOfComplainant')?.setValue(response.data.mobile_number_of_complainant); 
        }
        if(response.data.is_victim_same_as_complainant){
          const isVictimSameAsComplainant = response.data.is_victim_same_as_complainant === 1;
          this.firForm.get('complainantDetails.isVictimSameAsComplainant')?.setValue(isVictimSameAsComplainant);
        }




        if (response.data4.all_attachments) {
          try {
            // Split the concatenated string by commas to get each attachment's id and file path
            const allFilesArray: { chargesheet_attachment_id: number, file_path: string }[] = response.data4.all_attachments.split(',').map((attachment: string) => {
              const [attachmentId, filePath] = attachment.split('||'); // Split by colon to get id and path
              return { chargesheet_attachment_id: attachmentId, file_path: filePath };
            });
        
            this.allFiles1 = allFilesArray;
          } catch (error) {
            console.error('Error parsing all_attachments:', error);
            this.allFiles1 = [];
          }
        }
        
        if (response.data3.all_attachments) {
          try {
            // Split the concatenated string by commas to get each attachment's id and file path
            const allFilesArray: { chargesheet_attachment_id: number, file_path: string }[] = response.data3.all_attachments.split(',').map((attachment: string) => {
              const [attachmentId, filePath] = attachment.split('||'); // Split by colon to get id and path
              return { chargesheet_attachment_id: attachmentId, file_path: filePath };
            });
        
            this.allFiles = allFilesArray;
          } catch (error) {
            console.error('Error parsing all_attachments:', error);
            this.allFiles = [];
          }
        }
        
        // if (response.data3.all_files) {
        //   try {
        //     const allFilesArray = JSON.parse(response.data3.all_files);  // Assuming this is a JSON string
        //     this.allFiles = allFilesArray.map((fileUrl: string) => {
        //       // Check if the fileUrl is relative and prepend the base URL
        //       if (fileUrl) {
        //         return fileUrl;  // Prepend the base URL to the relative path
        //       }
        //       return fileUrl;  // Already an absolute URL
        //     }); 
        //   } catch (error) {
        //     console.error('Error parsing all_files:', error);
        //     this.allFiles = [];
        //   }
        // }

        if(response.data.number_of_victim){ 
          this.firForm.get('complainantDetails.numberOfVictims')?.setValue(response.data.number_of_victim); 
        }
        if(response.data.is_deceased){ 
          if(response.data.is_deceased == 1){
            this.firForm.get('isDeceased')?.setValue("yes");
          }
          else{
            this.firForm.get('isDeceased')?.setValue("no");
          }
        }

        if (response.data.deceased_person_names) {
          let deceased_person_names: any[] = [];
          if (typeof response.data.deceased_person_names === 'string') {
            try {
              deceased_person_names = JSON.parse(response.data.deceased_person_names);
            } catch (error) {
              console.error("Error parsing deceased_person_names:", error);
            }
          } else {
            deceased_person_names = response.data.deceased_person_names;
          }
          this.victimNames = response.data1
          .map((victim: any) => victim.victim_name);
          this.firForm.get('deceasedPersonNames')?.setValue(deceased_person_names);
        }

        if (response.data.number_of_accused) {
          this.firForm.get('numberOfAccused')?.setValue(response.data.number_of_accused);
        }

          // 1. Total Compensation
          if (response.data3.total_compensation) {
            this.firForm.get('totalCompensation')?.setValue(response.data3.total_compensation);
          }

          // 2. Proceedings File No.
          if (response.data3.proceedings_file_no) {
            this.firForm.get('proceedingsFileNo')?.setValue(response.data3.proceedings_file_no);
          }

          // 3. Proceeding File (judgement file URL)
          if (response.data3.proceedings_file) {
            this.firForm.get('proceedingsFile')?.setValue(response.data3.proceedings_file);
          }

          // 4. Proceedings Date
          if (response.data3.proceedings_date) {
            const dateObj = new Date(response.data3.proceedings_date);
            const formattedDate = dateObj.toISOString().split('T')[0]; // Format to 'yyyy-mm-dd'
            this.firForm.get('proceedingsDate')?.setValue(formattedDate);
          }

          const chargesheetDetails = response.data4;
          if (chargesheetDetails.charge_sheet_filed) {
            if(chargesheetDetails.charge_sheet_filed == "yes")
            {
              this.firForm.get('chargeSheetFiled')?.setValue("yes");
            }
            else{
              this.firForm.get('chargeSheetFiled')?.setValue("no");
            }
            
          }

          if(chargesheetDetails.chargesheet_id){
            this.chargesheet_id = chargesheetDetails.chargesheet_id;
          }

        if (chargesheetDetails.court_district) {
          this.firForm.get('courtDivision')?.setValue(chargesheetDetails.court_district);
          this.onCourtDivisionChange1(chargesheetDetails.court_district);
        }
        if (chargesheetDetails.court_name) { 
          this.firForm.get('courtName')?.setValue(chargesheetDetails.court_name);
        }
        if (chargesheetDetails.case_type) {
          this.firForm.get('caseType')?.setValue(chargesheetDetails.case_type);
        }
        if (chargesheetDetails.case_number) {
          this.firForm.get('caseNumber')?.setValue(chargesheetDetails.case_number);
        }

        // Set RCS file number and filing date
        if (chargesheetDetails.rcs_file_number) {
          this.firForm.get('rcsFileNumber')?.setValue(chargesheetDetails.rcs_file_number);
        }
        if (chargesheetDetails.rcs_filing_date) {
          const rcsFilingDate = new Date(chargesheetDetails.rcs_filing_date);
          const formattedDate = rcsFilingDate.toISOString().split('T')[0];
          this.firForm.get('rcsFilingDate')?.setValue(formattedDate);
        }

        if (response.data4.total_compensation_1) {
          this.firForm.get('totalCompensation_1')?.setValue(response.data4.total_compensation_1);
        } 
        if (response.data4.proceedings_file_no) {
          console.log(response.data4.proceedings_file_no);
          console.log("response.data4.proceedings_file_no");
          this.firForm.get('proceedingsFileNo_1')?.setValue(response.data4.proceedings_file_no);
        }

        // 3. Proceeding File (judgement file URL)
        if (response.data4.upload_proceedings_path) { 
          this.firForm.get('uploadProceedings_1')?.setValue(response.data4.upload_proceedings_path);
        }

          // 4. Proceedings Date
          if (response.data4.proceedings_date) {
            const dateObj = new Date(response.data4.proceedings_date);
            const formattedDate = dateObj.toISOString().split('T')[0]; // Format to 'yyyy-mm-dd'
            this.firForm.get('proceedingsDate_1')?.setValue(formattedDate);
          }
          
          
        if (response.data1 && response.data1.length > 0) {
          // Resetting the victims array in case of a previous value
          const victimsFormArray = this.firForm.get('victims') as FormArray;
          victimsFormArray.clear(); // Clear any existing victims data

          response.data1.forEach((victim: any) => {
            const victimGroup = this.createVictimGroup();
            let offence_committed_data: any[] = [];
            let scst_sections_data: any[] = [];

            if (victim.offence_committed) {
              offence_committed_data = JSON.parse(victim.offence_committed);
            }
            if (victim.scst_sections) {
              scst_sections_data = JSON.parse(victim.scst_sections);
            }
        
            victimGroup.patchValue({
              victim_id: victim.victim_id,
              name: victim.victim_name,
              age: victim.victim_age,
              gender: victim.victim_gender,
              mobileNumber: victim.mobile_number,
              address: victim.address,
              victimPincode: victim.victim_pincode,
              community: victim.community,
              caste: victim.caste,
              guardianName: victim.guardian_name,
              isNativeDistrictSame: victim.is_native_district_same,
              nativeDistrict: victim.native_district,
              offenceCommitted: offence_committed_data,
              scstSections: scst_sections_data,
              sectionsIPC: victim.sections_ipc
            });
        
            victimsFormArray.push(victimGroup);
          });       
        }

        if (response.data2 && response.data2.length > 0) {
          const accusedFormArray = this.firForm.get('accuseds') as FormArray;
          accusedFormArray.clear(); 
          response.data2.forEach((accused: any) => {
            const accusedGroup = this.createAccusedGroup();

            accusedGroup.patchValue({
              accusedId: accused.accused_id,
              age: accused.age,
              name: accused.name,
              gender: accused.gender,
              address: accused.address,
              pincode: accused.pincode,
              community: accused.community,
              caste: accused.caste,
              guardianName: accused.guardian_name,
              previousIncident: accused.previous_incident == 1 ? "true" : "false",
              previousFIRNumber: accused.previous_fir_number,
              previousFIRNumberSuffix: accused.previous_fir_number_suffix,
              scstOffence: accused.scst_offence == 1 ? "true" : "false",
              scstFIRNumber: accused.scst_fir_number,
              scstFIRNumberSuffix: accused.scst_fir_number_suffix,
              antecedents: accused.antecedents,
              landOIssues: accused.land_o_issues,
              gistOfCurrentCase: accused.gist_of_current_case,
              // uploadFIRCopy: accused.upload_fir_copy
            });

            accusedFormArray.push(accusedGroup);
          });
        }

      },
      (error) => {
        console.error('Error loading FIR details:', error);
      }
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: any): void { 
    this.firId = this.getFirIdFromSession();
    if(!this.firId)
      { 
        this.clearSession();
      } 
  } 

  getFirIdFromSession(): string | null {

    // console.log("ppppppppppppppppppppppppppppppp",sessionStorage.getItem('firId'));

    return sessionStorage.getItem('firId');
  }

  






  clearSession(): void { 
    const currentUri = window.location.href;
     
    sessionStorage.removeItem('firId');
    sessionStorage.removeItem('officerIds');
  }

  ngOnDestroy(): void { 
    this.firId = this.getFirIdFromSession();
    if(!this.firId)
      { 
        this.clearSession();
      } 
  }


  checkFormValidity() {
    // Enable the "Next" button only if the form is valid and it's Step 1
    this.nextButtonDisabled = !(this.firForm.valid && this.step === 1);
    this.cdr.detectChanges(); // Trigger change detection
  }




  courtNames: string[] = [
    'Chennai District Court',
    'Madurai Bench of Madras High Court',
    'Coimbatore District Court',
    'Salem District Court',
    'Trichy District Court'
  ];

  courtDistricts: string[] = [
    'Chennai',
    'Madurai',
    'Coimbatore',
    'Salem',
    'Trichy'
  ];


  // Save Step 1 and track officer IDs after the first save
  saveStepOneAsDraft() {
    const firData = {
      ...this.firForm.value,
    };

    this.firService.handleStepOne(this.firId, firData).subscribe(
      (response: any) => { 
        this.firId = response.fir_id;
        if (this.firId) {
          sessionStorage.setItem('firId', this.firId); 
        }
        const officerIds = response.officerIds || [];
        const savedOfficerIds: string[] = [];
        sessionStorage.setItem('officerIds', JSON.stringify(savedOfficerIds)); 

        Swal.fire('Success', 'FIR saved as draft for step 1.', 'success');
      },
      (error) => {
        console.error('Error saving FIR for step 1:', error);
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
      // natureOfOffence: this.firForm.value.natureOfOffence, // Array or single value
      // sectionsIPC: this.firForm.value.sectionsIPC,  // Convert to a comma-separated string
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
        console.error('Error saving FIR for step 2:', error);
        Swal.fire('Error', 'Failed to save FIR as draft for step 2.', 'error');
      }
    );
  }

  saveStepThreeAsDraft() {

    const firData = {
      firId: this.firId,
      complainantDetails: this.firForm.get('complainantDetails')?.value,
      victims: this.victims.value,
      isDeceased: this.firForm.get('isDeceased')?.value,
      deceasedPersonNames: this.firForm.get('deceasedPersonNames')?.value || [],
    };

    this.firService.saveStepThreeAsDraft(firData).subscribe(
      (response: any) => {
        this.firId = response.fir_id;
        if (this.firId) {
          sessionStorage.setItem('firId', this.firId);
        }
        Swal.fire('Success', 'FIR saved as draft for step 3.', 'success');
      },
      (error) => {
        console.error('Error saving FIR for step 3:', error);
        Swal.fire('Error', 'Failed to save FIR as draft for step 3.', 'error');
      }
    );
  }

  saveStepFourAsDraft(): void {
    const firData = {
      firId: this.firId,
      numberOfAccused: this.firForm.get('numberOfAccused')?.value,
      accuseds: this.accuseds.value, // Accuseds array data (form values)
    };

    this.firService.saveStepFourAsDraft(firData).subscribe(
      (response: any) => {
        this.firId = response.fir_id;
        if (this.firId) {
          sessionStorage.setItem('firId', this.firId);
        }
        Swal.fire('Success', 'FIR saved as draft for step 4.', 'success');
      },
      (error) => {
        console.error('Error saving FIR for step 4:', error);
        Swal.fire('Error', 'Failed to save FIR as draft for step 4.', 'error');
      }
    );
  }


  saveStepFiveAsDraft(isSubmit: boolean = false): void {
    if (!this.firId) {
      Swal.fire('Error', 'FIR ID is missing. Unable to proceed.', 'error');
      return;
    }
  
    const firData = {
      firId: this.firId,
      victimsRelief: this.victimsRelief.value.map((relief: any) => ({
        communityCertificate: relief.communityCertificate,
        reliefAmountScst: relief.reliefAmountScst,
        reliefAmountExGratia: relief.reliefAmountExGratia,
        reliefAmountFirstStage: relief.reliefAmountFirstStage,
        additionalRelief: relief.additionalRelief,
      })),
      totalCompensation: this.firForm.get('totalCompensation')?.value,
      proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value,
      proceedingsDate: this.firForm.get('proceedingsDate')?.value,
      status: isSubmit ? 5 : undefined,
    };
  
    this.firService.saveStepFiveAsDraft(firData).subscribe(
      (response) => {
        if (isSubmit) {
          Swal.fire({
            title: 'Success',
            text: 'FIR Stage Form Completed! Redirecting to Chargesheet...',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.navigateToChargesheetPage();
          });
        } else {
          Swal.fire('Success', 'Step 5 data saved as draft successfully', 'success');
        }
      },
      (error) => {
        console.error('Error saving Step 5 data:', error);
        Swal.fire('Error', 'Failed to save Step 5 data', 'error');
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
        // $(this.tagifyInput.nativeElement).on('itemAdded', (event: any) => {
        //   this.sectionsIPC.push(event.item);
        //   this.updateSectionsIPCControl();
        // });

        // $(this.tagifyInput.nativeElement).on('itemRemoved', (event: any) => {
        //   this.sectionsIPC = this.sectionsIPC.filter(tag => tag !== event.item);
        //   this.updateSectionsIPCControl();
        // });
      }
    }, 0);
  }

  // Update the form control for sectionsIPC
  // updateSectionsIPCControl(): void {
  //   this.firForm.get('sectionsIPC')?.setValue(this.sectionsIPC.join(', '));
  // }







  // Handle file selection
  onFileSelect1(event: any, index: number) {
    const files = event.target.files;
    const filesArray = Array.from(files); // Convert FileList to an array

    // Update the 'files' form control with the selected files
    this.attachments.at(index).get('files')?.setValue(filesArray);

    // Trigger change detection to update the UI
    this.cdr.detectChanges();
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
                this.policeStations = stations;
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
      caseType: ['', Validators.required], 
      proceedingsFileNo_1: ['', Validators.required], 
      totalCompensation_1: ['', Validators.required],  
      policeZone: ['', Validators.required],
      policeRange: ['', Validators.required],
      revenueDistrict: ['', Validators.required],
      // alphabetSelection: ['', Validators.required],
      // stationNumber: ['', Validators.required],
      stationName: ['', Validators.required],
      uploadProceedings_1: ['', Validators.required],
      proceedingsFile: ['', Validators.required],
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
      proceedingsDate_1: ['', Validators.required],
      placeOfOccurrence: ['', Validators.required],
      dateOfRegistration: ['', Validators.required],
      timeOfRegistration: ['', Validators.required],
      // natureOfOffence: [[], Validators.required],
      sectionsIPC: ['trerterterterter'],
      scstSections: [[]],

      // Step 3 Fields - Complainant and Victim Details
      complainantDetails: this.fb.group({
        nameOfComplainant: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]],
        mobileNumberOfComplainant: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        isVictimSameAsComplainant: [false],
        numberOfVictims: [1, Validators.required],
      }),
      victims: this.fb.array([this.createVictimGroup()]),
      isDeceased: ['', Validators.required],
      deceasedPersonNames: [[]],

      // Step 4 Fields - Accused Details
      numberOfAccused: [1, Validators.required],
      accuseds: this.fb.array([]),

      // Step 5 Fields - Victim Relief and Compensation Details
      victimsRelief: this.fb.array([this.createVictimReliefGroup()]),

      reliefAmountScst: ['', Validators.required],
      reliefAmountExGratia: ['', Validators.required],
      reliefAmountFirstStage: ['', Validators.required],
      reliefAmountSecondStage: ['', Validators.required],
      totalCompensation: ['', Validators.required],
      additionalRelief: [[], Validators.required],



      // Charge Sheet Details
      chargeSheetFiled: ['', Validators.required],
      courtDivision: ['', Validators.required],
      courtName: ['', Validators.required],
      caseNumber: ['', Validators.required],

      // Step 6 Fields - Case Trial and Court Details
      Court_name1: ['', Validators.required],
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

      Court_one: ['', Validators.required],
      courtDistrict_one: ['', Validators.required],
      caseNumber_one: ['', Validators.required],
      publicProsecutor_one: ['', Validators.required],
      prosecutorPhone_one: ['', Validators.required],
      firstHearingDate_one: ['', Validators.required],


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
      proceedingsDate: ['', Validators.required],
      uploadProceedings: ['', Validators.required],
      attachments: this.fb.array([]) // Dynamic attachments array
    });

    // Other setup functions
    this.trackStep1FormValidity();
    this.onNumberOfVictimsChange();
    this.onNumberOfAccusedChange();
    this.populateVictimsRelief();
    // this.onCourtDivisionChange();

  }




  loadVictimsDetails(): void {
    // Check if FIR ID is null or doesn't match the one from session
    if (!this.firId || this.firId !== sessionStorage.getItem('firId')) { 
      return; // Skip loading if FIR ID is not valid or doesn't match
    }

    // this.firService.getVictimsDetailsByFirId(this.firId).subscribe(
    //   (response: any) => {
    //     this.numberOfVictims = response.numberOfVictims;
    //     this.victimNames = response.victimNames;

    //     // Initialize victimsRelief array based on the number of victims
    //     this.populateVictimsRelief();
    //   },
    //   (error) => {
    //     console.error('Error fetching victim details:', error);
    //     Swal.fire('Error', 'Failed to load victim details', 'error');
    //   }
    // );
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




  onJudgementNatureChange_one(): void {
    const judgementNature = this.firForm.get('judgementDetails_one.judgementNature_one')?.value;

    if (judgementNature === 'Convicted_one') {
      // Show only Upload Judgement Copy
      this.showJudgementCopy = true;
      this.showLegalOpinionObtained_one = false;
      this.showFiledBy_one = false;
      this.showDesignatedCourt_one = false;
      this.hideCompensationSection = false;
      this.showDuplicateSection_1 = false;

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
  }

  onDesignatedCourtChange_one(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;

    this.showDuplicateSection_1 = selectedValue === 'highCourt_one' || selectedValue === 'supremeCourt_one'; 
  }


  onJudgementNatureChange(): void {
    const judgementNature = this.firForm.get('judgementDetails.judgementNature')?.value;

    if (judgementNature === 'Convicted') {
      // Show Upload Judgement Copy only
      this.showJudgementCopy = true;
      this.showLegalOpinionObtained = false;
      this.showFiledBy = false;
      this.showDesignatedCourt = false;
      this.showDuplicateSection = false;
      this.showDuplicateSection_1 = false;

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
    }

    this.firForm.get('judgementDetails.judgementNature')?.updateValueAndValidity();
    this.firForm.get('judgementDetails.uploadJudgement')?.updateValueAndValidity();
  }
  onJudgementSelectionChangehearing(event: any): void {
    const value = event.target.value; 
    if (value === 'yes') {
      this.firForm.get('judgementDetails.judgementNature')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails.uploadJudgement')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails.judgementNature')?.clearValidators();
      this.firForm.get('judgementDetails.uploadJudgement')?.clearValidators();
    }

    this.firForm.get('judgementDetails.judgementNature')?.updateValueAndValidity();
    this.firForm.get('judgementDetails.uploadJudgement')?.updateValueAndValidity();
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





  onAdditionalReliefChange(event: any, value: string): void {
    const checked = event.target.checked;

    if (checked) {
      // Add the value if checked
      if (!this.selectedAdditionalReliefs.includes(value)) {
        this.selectedAdditionalReliefs.push(value);
      }
    } else {
      // Remove the value if unchecked
      this.selectedAdditionalReliefs = this.selectedAdditionalReliefs.filter(
        (relief) => relief !== value
      );
    }
  }


  onJudgementSelectionChange_two(event: any): void {
    const value = event.target.value;
    if (value === 'yes') {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.clearValidators();
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.clearValidators();
    }
    this.firForm.get('judgementDetails_two.judgementNature_two')?.updateValueAndValidity();
    this.firForm.get('judgementDetails_two.uploadJudgement_two')?.updateValueAndValidity();
  }

  onJudgementSelectionChangehearing2(event: any): void {
    const value = event.target.value;
    if (value === 'yes') {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.setValidators([Validators.required]);
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.setValidators([Validators.required]);
    } else {
      this.firForm.get('judgementDetails_two.judgementNature_two')?.clearValidators();
      this.firForm.get('judgementDetails_two.uploadJudgement_two')?.clearValidators();
    }
    this.firForm.get('judgementDetails_two.judgementNature_two')?.updateValueAndValidity();
    this.firForm.get('judgementDetails_two.uploadJudgement_two')?.updateValueAndValidity();
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


  populateVictimsRelief(): void {
    const victimsReliefArray = this.victimsRelief;
    victimsReliefArray.clear(); // Clear existing form controls

    // Populate the form array with victim names
    this.victimNames.forEach((victimName) => {
      const reliefGroup = this.createVictimReliefGroup();
      reliefGroup.patchValue({ name: victimName }); // Set victim name
      victimsReliefArray.push(reliefGroup); // Add to FormArray
    });

    this.cdr.detectChanges(); // Trigger change detection
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
    this.victimNames = this.victims.controls.map((victim) => victim.get('name')?.value).filter(name => name);
    this.populateVictimsRelief();
    this.cdr.detectChanges(); // Trigger change detection
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
      victim_id: [''],
      age: ['', Validators.required],
      name: [{ value: '', disabled: false }, [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]],
      gender: ['', Validators.required],
      mobileNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')] // 10-digit validation
      ],
      address: [''],
      victimPincode: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{6}$')] // 6-digit validation
      ],
      community: ['', Validators.required],
      caste: ['', Validators.required],
      guardianName: ['', [Validators.required, Validators.pattern('^[A-Za-z\\s]*$')]],
      isNativeDistrictSame: ['', Validators.required],
      nativeDistrict: [''],
      offenceCommitted: ['', Validators.required],
      scstSections:  ['', Validators.required], // Ensure this field exists for multi-select
      sectionsIPC:  [''],
    });
  }

  isPincodeInvalid(index: number): boolean {
    const pincodeControl = this.accuseds.at(index).get('pincode');
    return (pincodeControl?.touched ?? false) && !(pincodeControl?.valid ?? true);
  }



  createVictimReliefGroup(): FormGroup {
    return this.fb.group({
      communityCertificate: ['', Validators.required], // Form control for Community Certificate
      reliefAmountScst: [{ value: '100', disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$')]], // Pre-set to 100, read-only
      reliefAmountExGratia: [{ value: '100', disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$')]], // Pre-set to 100, read-only
      reliefAmountFirstStage: [{ value: '100', disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$')]], // Pre-set to 100, read-only
      totalCompensation: ['', Validators.required], // Total compensation field, editable
      additionalRelief: [[]], // Array for checkboxes or multi-select options
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

  // loadnativedistrict() {
  //   this.firService.getPoliceRevenue().subscribe(
  //     (Native: any) => {
  //       this.policeStations = Native.map((Native: any) => Native.revenue_district_name);
  //     },
  //     (error: any) => {
  //       Swal.fire('Error', 'Failed to load offence options.', 'error');
  //     }
  //   );
  // }

  loadOffenceActs() {
    this.firService.getOffenceActs().subscribe(
      (acts: any) => {
        this.offenceActsOptions = acts.map((act: any) => act.offence_act_name);
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load offence acts options.', 'error');
      }
    );
  }

  loadScstSections() {
    this.firService.getCastes().subscribe(
      (sections: any) => {
        this.scstSectionsOptions = sections.map((section: any) => section.caste_name);
      },
      (error: any) => {
        Swal.fire('Error', 'Failed to load SC/ST sections options.', 'error');
      }
    );
  }

  // loadUserData() {
  //   this.firService.getUserDetails(this.userId).subscribe(
  //     (user: any) => {
  //       if (user && user.district) {
  //         const district = user.district;
  //         this.firForm.patchValue({ policeCity: district });
  //         this.loadPoliceDivisionDetails(district);
  //       }
  //     },
  //     (error: any) => {
  //       Swal.fire('Error', 'Failed to load user details.', 'error');
  //     }
  //   );
  // }

  loadPoliceDivisionDetails() {
    this.firService.getPoliceDivisionedit().subscribe(
      (data: any) => {
        
        this.policeCities = data.district_division_name || [];
        this.policeZones = data.police_zone_name || [];
        this.policeRanges = data.police_range_name || [];
        this.revenueDistricts = data.revenue_district_name || [];

        this.cdr.detectChanges();
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
      previousIncident: [],
      previousFIRNumber: [''],
      previousFIRNumberSuffix: [''],
      scstOffence: [],
      scstFIRNumber: [''],
      scstFIRNumberSuffix: [''],
      antecedents: ['', Validators.required],
      landOIssues: ['', Validators.required],
      gistOfCurrentCase: ['', Validators.required],
      // uploadFIRCopy: [null, Validators.required]
    });
  }


  // Handle City Change
  onCityChange(event: any) {
    const selectedCity = event.target.value;
    // if (selectedCity) {
    //   this.loadPoliceDivisionDetails();
    // }
  }
  get attachments_1(): FormArray {
    return this.firForm.get('attachments_1') as FormArray;
  }
  
  get attachments_2(): FormArray {
    return this.firForm.get('attachments_2') as FormArray;
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

    addAttachment_2(): void {
      this.attachments_2.push(this.createAttachmentGroup());
    } 

      
  addAttachment_1(): void {
    this.attachments_1.push(this.createAttachmentGroup());
  }


  isStep6Valid(): boolean { 

    const controls = [
      'chargeSheetFiled',
      'courtDivision',
      'courtName',
      'caseType',
      'caseNumber',
      'reliefAmountScst_1',
      'reliefAmountExGratia_1',
      'reliefAmountSecondStage',
      'totalCompensation_1',
      'proceedingsFileNo_1',   // Added fields for chargeSheet
      'proceedingsDate_1',      // Added fields for chargeSheet
      'uploadProceedings_1',    // Added fields for chargeSheet
      'file_1',                 // Added fields for chargeSheet
    ];

    let caseType = this.firForm.get('caseType')?.value;  // Get the selected case type 

    // Add conditional validation logic based on caseType
    if (caseType === 'chargeSheet') {
      // Add fields specific to chargeSheet case type
      controls.push(
        'chargeSheetFiled',
        'courtDivision',
        'courtName',
        'reliefAmountScst_1',
        'reliefAmountExGratia_1',
        'reliefAmountSecondStage',
        'totalCompensation_1',
        'proceedingsFileNo_1',
        'proceedingsDate_1',
        'uploadProceedings_1',
        'file_1'
      );
    } else if (caseType === 'referredChargeSheet') {
      // Add fields specific to referredChargeSheet case type
      controls.push('rcsFileNumber', 'rcsFilingDate', 'mfCopy');
    }

    // Perform validation for all fields based on the controls array
    let allValid = controls.every((controlName) => {
      const control = this.firForm.get(controlName);
      if (control) {
        // Mark control as touched to trigger validation
        control.markAsTouched();

        if (!control.valid) {
          // console.log(`${controlName} is invalid`, control.errors);  // Log specific errors for each control
        }
      }
      return control ? control.valid : true;
    });

    return allValid;
  }

  removeAttachment_1(index: number): void {
    if (this.attachments_1.length > 1) {
      this.attachments_1.removeAt(index);
    }
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

  addAttachment(): void {
    this.attachments.push(this.createAttachmentGroup());
  }

  removeAttachment(index: number): void {
    if (this.attachments.length > 1) {
      this.attachments.removeAt(index);
    }
  }

 

  // Getter for attachments FormArray
  get attachments(): FormArray {
    return this.firForm.get('attachments') as FormArray;
  }



  
   
  getImagePreviewForIndex(index: number) {
    return this.imagePreviews1.some(item => item.index === index);
  }
  
  getImagePreviewsForIndex(index: number) {
    return this.imagePreviews1.filter(item => item.index === index);
  }
  onFileChange(event: Event, index: number): void { 
    const fileInput = event.target as HTMLInputElement;
  
    if (fileInput?.files?.length) {
      const file = fileInput.files[0];  // Get the first selected file
  
      // Find and remove the existing file object with the same index
      const existingFileIndex = this.imagePreviews1.findIndex(item => item.index === index);
      if (existingFileIndex !== -1) {
        // Remove the existing file object at that index
        this.imagePreviews1.splice(existingFileIndex, 1);
      }
      this.accuseds.at(index).get('uploadFIRCopy')?.setValue(null);
      // Push the new file object with the file, preview URL, and index
      this.imagePreviews1.push({
        file: file,
        url: URL.createObjectURL(file),
        index: index
      });
    }
  } 
  
  
  // saveStepFourAsDraft(): void {
  //   const firData = {
  //     firId: this.firId,
  //     numberOfAccused: this.firForm.get('numberOfAccused')?.value,
  //     accuseds: this.accuseds.value // Accuseds array data (form values)
  //   };

    
  //   const formData = new FormData();
  //   // console.log(formData);
  
  //   // Append form fields to FormData (firData)
  //   Object.keys(firData).forEach((key) => {
  //     const value = firData[key as keyof typeof firData];
  //     if (Array.isArray(value)) {
  //       // If the value is an array (e.g., accuseds)
  //       value.forEach((val, index) => {
  //         // Handle nested objects inside the array (accuseds)
  //         if (typeof val === 'object') {
  //           // Iterate over object properties of each accused
  //           Object.keys(val).forEach((subKey) => {
  //             formData.append(`accuseds[${index}].${subKey}`, String(val[subKey]));
  //           });
  //         } else {
  //           formData.append(`${key}[${index}]`, String(val));
  //         }
  //       });
  //     } else {
  //       // If the value is not an array, just append directly
  //       formData.append(key, String(value));
  //     }
  //   });
  
  //   // Example: Appending image files (if any)
  //   this.imagePreviews1.forEach((image, index) => {
  //     formData.append(`images[${index}]`, image.file, image.file.name);
  //   });
  
  //   // You can inspect the FormData if needed
 
  
  //   // Call the service to save as draft

  //   // console.log("testing",formData);
  //   this.firService.saveStepFourAsDraft(formData).subscribe(
  //     (response: any) => {
  //       this.firId = response.fir_id;
  //       if (this.firId) {
  //         sessionStorage.setItem('firId', this.firId);
  //       }
  //       Swal.fire('Success', 'FIR saved as draft for step 4.', 'success');
  //     },
  //     (error) => {
  //       console.error('Error saving FIR for step 4:', error);
  //       Swal.fire('Error', 'Failed to save FIR as draft for step 4.', 'error');
  //     }
  //   );
  // }
  
  
  
  

  // saveStepFiveAsDraft(isSubmit: boolean = false): void {
  //   if (!this.firId) {
  //     Swal.fire('Error', 'FIR ID is missing. Unable to proceed.', 'error');
  //     return;
  //   }

  //   const firData = {
  //     firId: this.firId,
  //     victimsRelief: this.victimsRelief.value.map((relief: any) => ({
  //       communityCertificate: relief.communityCertificate,
  //       reliefAmountScst: relief.reliefAmountScst,
  //       reliefAmountExGratia: relief.reliefAmountExGratia,
  //       reliefAmountFirstStage: relief.reliefAmountFirstStage,
  //       additionalRelief: relief.additionalRelief,
  //     })),
  //     totalCompensation: this.firForm.get('totalCompensation')?.value,
  //     proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value,
  //     proceedingsDate: this.firForm.get('proceedingsDate')?.value,
  //     // proceedingsFile: this.firForm.get('proceedingsFile')?.value,
  //     // attachments: this.attachments.value.map((attachment: any) => ({
  //     //   fileName: attachment.fileName,
  //     //   filePath: attachment.filePath, // Adjust if file path is set after uploading
  //     // })),
  //     status: isSubmit ? 5 : undefined,
  //   };

  //   const formData = new FormData();

  //   Object.keys(firData).forEach((key) => {
  //     const value = firData[key as keyof typeof firData]; 
  //     formData.append(key, String(value));  // Convert value to string to avoid type issues 
  //   }); 
  //   this.imagePreviews2.forEach(image => {
  //     formData.append('images', image.file, image.file.name);
  //   });

  //   const files = this.getFiles('proceedingsFile');  
  //   if (files && files.length > 0) { 
  //     // Assuming you want to use the first file (files[0])
  //     formData.append('uploadJudgement', files[0], files[0].name);
  //   } else {
  //     console.error('No files selected or files are null/undefined');
  //   }

    
  //   this.firService.saveStepFiveAsDraft(formData).subscribe(
  //     (response) => {
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
  //     (error) => {
  //       console.error('Error saving Step 5 data:', error);
  //       Swal.fire('Error', 'Failed to save Step 5 data', 'error');
  //     }
  //   );
  // }

  submitStepSix(): void {
    if (!this.firId) {
      Swal.fire('Error', 'FIR ID is missing. Unable to proceed.', 'error');
      return;
    }

    // Directly update FIR status to 6 without form submission
    this.firService.updateFirStatus(this.firId, 6).subscribe(
      () => {
        Swal.fire({
          title: 'Success',
          text: 'FIR status updated to 6.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.navigateToNextStep(); // Move to the next step in your workflow
        });
      },
      (error) => {
        console.error('Error updating FIR status:', error);
        Swal.fire('Error', 'Failed to update FIR status.', 'error');
      }
    );
  }


  submitStepSeven(): void {
    if (!this.firId) {
      Swal.fire('Error', 'FIR ID is missing. Unable to proceed.', 'error');
      return;
    }

    // Directly update FIR status to 7 without form submission
    this.firService.updateFirStatus(this.firId, 7).subscribe(
      () => {
        Swal.fire({
          title: 'Success',
          text: 'FIR status updated to 7.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      },
      (error) => {
        console.error('Error updating FIR status:', error);
        Swal.fire('Error', 'Failed to update FIR status.', 'error');
      }
    );
  }




  // Helper function to navigate to the next step
  navigateToNextStep(): void {
    if (this.mainStep === 2 && this.step === 1) {
      this.mainStep = 3; // Move to Trial Stage if currently in Chargesheet Stage
      this.step = 1;      // Reset to Step 1 of the new stage
    } else if (this.mainStep === 1 && this.step < 5) {
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
    }
  }



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
      this.saveStepFiveAsDraft();
    }
  }
  getFiles(inputId: string): FileList | null {
    const fileInput = document.getElementById(inputId) as HTMLInputElement; 
    return fileInput?.files && fileInput.files.length > 0 ? fileInput.files : null;
  }
  formDataToObject(formData: FormData): Record<string, any> {
    const obj: Record<string, any> = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  saveStepSevenAsDraft(isSubmit: boolean = false): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;


    const formFields = {
      firId: this.firId,
      
      
      case_id: this.case_id,
      Court_name: this.firForm.get('Court_name1')?.value,
      courtDistrict1: this.firForm.get('trialCourtDistrict')?.value,
      caseNumber: this.firForm.get('caseNumber')?.value,
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


      case_id1: this.case_id1,
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

      case_id2: this.case_id2,
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


      hearingDetails: JSON.stringify(this.firForm.get('hearingDetails')?.value),
      hearingDetails_one: JSON.stringify(this.firForm.get('hearingDetails_one')?.value),
      hearingDetails_two: JSON.stringify(this.firForm.get('hearingDetails_two')?.value),
      totalCompensation: this.firForm.get('totalCompensation')?.value, 
      proceedingsDate: this.firForm.get('proceedingsDate')?.value, 
      proceedingsFileNo: this.firForm.get('proceedingsFileNo')?.value,  
      status: isSubmit ? 7 : undefined,
    };

    

    // const formData = new FormData(); 

    // Object.keys(formFields).forEach((key) => {
    //   const value = formFields[key as keyof typeof formFields]; 
    //   formData.append(key, String(value)); 
    // });

    // this.imagePreviews.forEach(image => {
    //   formData.append('images', image.file, image.file.name);
    // });
  
    // const filesFields = ['uploadJudgement', 'uploadJudgement_one', 'uploadJudgement_two','uploadProceedings'];

    // filesFields.forEach((field) => {
    //   const files = this.getFiles(field); 
    //   if (files) {
    //     for (let i = 0; i < files.length; i++) {
    //       formData.append(field, files[i]); 
    //     }
    //   }
    // });
    // if (this.firId) {
    //   formData.append('fir_ids', this.firId);
    // }
    // const formDataObject = this.formDataToObject(formData);  

    this.firService.editStepSevenAsDraft(formFields).subscribe({
      next: (response) => {
        if (isSubmit) {
          Swal.fire({
            title: 'Success',
            text: 'FIR Stage Form Completed! Redirecting to Chargesheet...',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.navigateToChargesheetPage();
          });
        } else {
          Swal.fire('Success', 'Step 5 data saved as draft successfully', 'success');
        }
      },
      error: (error) => {
        console.error('Error saving Step 5 data:', error);
        Swal.fire('Error', 'Failed to save Step 5 data', 'error');
      }
    });
    
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
          chargesheet_id: this.chargesheet_id, 
          chargeSheetFiled: this.firForm.get('chargeSheetFiled')?.value || '',
          courtDivision: this.firForm.get('courtDivision')?.value || '',
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
          // uploadProceedingsPath: this.firForm.get('uploadProceedings_1')?.value || '',
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

    // const formData = new FormData(); 

    // Object.keys(chargesheetData).forEach((key) => {
    //   const value = chargesheetData[key as keyof typeof chargesheetData]; 
    //   formData.append(key, String(value));  // Convert value to string to avoid type issues 
    // }); 
    // this.imagePreviews3.forEach(image => {
    //   formData.append('images', image.file, image.file.name);
    // }); 

    // const files = this.getFiles('uploadProceedings_1');  
    // if (files && files.length > 0) { 
    //   formData.append('uploadProceedings_1', files[0], files[0].name);
    // } else {
    //   console.error('No files selected or files are null/undefined');
    // }

    // Call the service to send data to the backend

    console.log("rrrrrrrrrrrrrrrr",chargesheetData);

    
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


  saveAsDraft_7(): void {
    this.saveStepSevenAsDraft();   
  }




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

    this.firService.handleStepOne(this.firId, firData).subscribe(
      (response: any) => { 

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
        console.error('Error handling Step 1:', error); // Log the error
        Swal.fire('Error', `Failed to handle Step 1`, 'error');
      }
    );
  }

  submitStepFive(): void {
    this.saveStepFiveAsDraft(true); // Calls Step 5 save with submission flag
  }



  navigateToChargesheetPage(): void {
    // Set mainStep to 2 for Chargesheet Stage, assuming 1 is for FIR Stage
    this.mainStep = 2;
    this.step = 1; // Reset to the first sub-step of Chargesheet Stage
  }





  // onSubmit(): void { 

  //   if (this.step === 1 || this.step === 2) {
  //     if (this.firForm.valid) { 
  //       this.handleStepOne('manual');
  //     } else {
  //       console.warn('Form is invalid. Please fill in all required fields.');
  //       Swal.fire('Error', 'Please fill in all required fields.', 'error');
  //     }
  //   } else if (this.step === 6) {
  //     // Skip validations for Step 6 and directly submit or update status 
  //     this.submitStepSix();
  //   } else { 
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
      // 'alphabetSelection',
      // 'stationNumber',
      'stationName',



    ];

    return controls.every((controlName) => this.firForm.get(controlName)?.valid === true);
  }

  // Check Step 2 validity
  isStep2Valid(): boolean {
    const controls = [
      'firNumber',
      'firNumberSuffix',
      'dateOfOccurrence',
      'timeOfOccurrence',
      'placeOfOccurrence',
      'dateOfRegistration',
      'timeOfRegistration',
      // 'natureOfOffence',
      // 'sectionsIPC',
    ];

    return controls.every((controlName) => this.firForm.get(controlName)?.valid === true);
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
          // console.log('FIR status updated to:', status);
        },
        (error) => {
          console.error('Error updating FIR status:', error);
          Swal.fire('Error', 'Failed to update FIR status.', 'error');
        }
      );
    }
  }



  navigateToStep(stepNumber: number): void {
    this.step = stepNumber; // Update the current step
    this.cdr.detectChanges(); // Trigger UI update
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
    const victimsReliefArray = this.victimsRelief as FormArray;

    // Helper function to check validity of each control, even if disabled
    const checkAllControlsValid = (group: FormGroup): boolean => {
      return Object.keys(group.controls).every((controlName) => {
        const control = group.get(controlName);
        return control?.disabled || control?.valid; // Allow disabled fields to be considered valid
      });
    };

    // Validate each FormGroup in victimsRelief array using the helper function
    const victimsReliefValid = victimsReliefArray.controls.every((reliefGroup) =>
      checkAllControlsValid(reliefGroup as FormGroup)
    );

    // Additional fields validation
    const isTotalCompensationValid = this.firForm.get('totalCompensation')?.valid || false;
    const isProceedingsFileNoValid = this.firForm.get('proceedingsFileNo')?.valid || false;
    const isProceedingsDateValid = this.firForm.get('proceedingsDate')?.valid || false;
    const isProceedingsFileValid = this.firForm.get('proceedingsFile')?.valid || false;
    const areAttachmentsValid = this.attachments.valid;

    // Ensure all conditions are true before enabling the button
    return (
      victimsReliefValid &&
      isTotalCompensationValid &&
      isProceedingsFileNoValid &&
      isProceedingsDateValid &&
      isProceedingsFileValid &&
      areAttachmentsValid
    );
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


}
