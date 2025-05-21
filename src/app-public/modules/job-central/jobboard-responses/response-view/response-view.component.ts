import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Optional, Output, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { ApplicantFileUploadResponse, FileUploadResponse, LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService, TimeZoneService } from 'src/@shared/services';
import { JobCentralService } from '../../core/http/job-central.service';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import icClose from '@iconify/icons-ic/twotone-close';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ApplicantReferences } from '../../core/model/applicantrefences';
import { ValidationService } from 'src/@cv/services/validation.service';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { combineLatest, forkJoin, Observable, of, Subject } from 'rxjs';
import { HashTag } from 'src/@shared/models/hashtags';
import * as FileSaver from 'file-saver';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDialogNotesComponent } from 'src/@shared/components/filter-components/confirm-dialog-notes/confirm-dialog-notes.component';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { AccountTypes } from 'src/static-data/accounttypes';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { JobboardResponses } from '../../core/model/jobboardresponses';
import { ShareApplicantComponent } from '../../JC-Common/share-applicant/share-applicant.component';
import { AssignMyselfComponent } from '../../JC-Common/assign-myself/assign-myself.component';
import { ApplicantAssignComponent } from '../../JC-Common/applicant-assign/applicant-assign.component';
import { RecruiterMappings } from '../../core/model/applicantrecruitermapping';
import { MatSelectChange } from '@angular/material/select';
import { ApplicantCandidateComponent } from '../../JC-Common/applicant-candidate/applicant-candidate.component';
import { CandidateAccount } from 'src/@shared/core/ats/models/candidateaccount';
import { ApplicantIgnoreComponent } from '../../JC-Common/applicant-ignore/applicant-ignore.component';
import { ApplicationStatus } from '../../core/model/applicantstatus';
import { IconService } from 'src/@shared/services/icon.service';
import { FormPermissionsService } from 'src/@shared/services/formpermissions.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { catchError, finalize, map, takeUntil } from 'rxjs/operators';
import { WorkStatusService } from 'src/@shared/http/work-status.service';

@UntilDestroy()
@Component({
  selector: 'cv-response-view',
  templateUrl: './response-view.component.html',
  styleUrls: ['./response-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms,
  ],
  providers: [AccountTypes, FormPermissionsService]
})
export class ResponseViewComponent implements OnInit {

  loading:boolean=false;
  isLoading:boolean=false;
  addForm: FormGroup;
  loginUser: LoginUser;
  reference1FormValid: boolean = false;
  reference2FormValid: boolean = false;
  appReferences_Mandatory: boolean;
  appReferences_Readonly: boolean;
  selectedKeywords: string[] = [];
  hashtags: any[] = [];
  statusLabelsData:ApplicationStatus[] = [];
  currentApplicant: JobboardResponses = new JobboardResponses();
  destroy$ = new Subject<boolean>();
  icClose = icClose;
  selectedHashTagChips: any[] = [];
  EditApplicantStatusList :ApplicationStatus[];
  statusLabels: ApplicationStatus[];
  fileUploadLoading:boolean;
  submitButtonTitle: string;
  SelectedSource: string;
  IsAssigneeToMySelf: boolean;

  formattedPhone: string = '';
  FinalHashTagsText: any[] = [];
  applicantsRefrences: ApplicantReferences[] = [];
  showReferencesError = false;

  SelectedKwywods: string[] = [];

  reference1: ApplicantReferences = new ApplicantReferences();
  reference2: ApplicantReferences = new ApplicantReferences();
  c2creference: ApplicantReferences = new ApplicantReferences();
  cansubVClientAccount: CandidateAccount = new CandidateAccount();
  enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;

  Techrating: number = 0;
  Commrating: number = 0;
  workStatuFields: SelectItem[] = [];
  SelectedResponseId:number;
  isnotes: boolean = false;
  isSummary:boolean = false;
  DialogResponse: ConfirmDialogModelResponse;
  applicantsMapping: RecruiterMappings[] = [];
  datemask = [/\d/, /\d/, '/', /\d/, /\d/];
  @Input() Input_ResponseId: number;
  @Input() Input_Source: string;
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: { ResponseId: number; Source: string },
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private formService: FormPermissionsService,
    private jobCentralService: JobCentralService,
    private dialogRef: MatDialogRef<ResponseViewComponent>,
    private cd: ChangeDetectorRef,
    private accountTypes: AccountTypes,
    public iconService: IconService,
    private _eventemtterservice: EventEmitterService,
    private workStatusService: WorkStatusService
  ) {
    this.initializeForms();
    this.initializeFormPermissions();
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.isSummary = true;
      this.isnotes = false;
    } else if (event.index === 1) {
      this.isSummary = false;
      this.isnotes = true;
    }
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    this.loginUser = this.authService.getLoginUser();
    if (this.loginUser) {
      this.isSummary=true;
      this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id).subscribe(data => {
        this.workStatuFields = data;
      });
      this.SelectedResponseId = this.Input_ResponseId || (this.dialogData ? this.dialogData.ResponseId : 0);
      this.SelectedSource = this.Input_Source || (this.dialogData ? this.dialogData.Source : null);
      this.submitButtonTitle = this.SelectedResponseId > 0 ? 'UPDATE' : 'ADD';
      this.loadInitialData();
      if (this.SelectedResponseId === 0) {
        this.addEmailDuplicateValidator();
      }
    }
  }


  initializeForms(): void {
    this.addForm = this.fb.group({
      firstName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      lastName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      AvailabilityToJoin: [],
      DOB: [],
      SSN: [null, [ValidationService.ValidateSSN]],
      phone: [null, [this.phoneValidator]],
      email: ['', [Validators.required, Validators.email]],
      LinkedIn: [null, [ValidationService.LinkedIn_urlValidator]],
      ApplicantLocation: [null],
      Notes: [null],
      workCategory: [],
      jobtitle:[null],
      wpermit:[null],
      PayRate: [null],
      c2cfirstName: [null],
      c2clastName: [null],
      c2cphonenumber: [null],
      c2cemail: [null],
      SkillRating: [null],
      CommRating: [null],
      skills: [null],
      subVendorInfo: [''],
    });

    this.addForm.get('phone')?.valueChanges.subscribe(value => {
      this.formattedPhone = this.formatPhoneNumber(value);
      this.addForm.get('phone')?.setValue(this.formattedPhone, { emitEvent: false });
    });

    this.addForm.get('workCategory').valueChanges.subscribe(value => {
      this.onEmploymentTypeChange(value);
    });
  }

  initializeFormPermissions(): void {
    debugger;
    const appRefAttributes = this.formService.getFrmPermissions_JobCentral('View_Jobbaord_Response', 'app_ref');
    this.appReferences_Mandatory = appRefAttributes.find(attr => attr.Key === 'Required')?.Value;
    this.appReferences_Readonly = appRefAttributes.find(attr => attr.Key === 'Readonly')?.Value;
    this.showReferencesError = this.appReferences_Mandatory;
  }

  
  loadInitialData(): void {
    this.loading = true;

    const requests = [
      this.loadHashtags(),
      this.loadApplicantStatusLabels(),
      this.SelectedResponseId > 0 ? this.loadApplicantDetails() : of(null)  // Conditionally add applicant details
    ];

    forkJoin(requests).pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        this.alertService.error('Error loading initial data');
        return of([[], [], null]);  // Fallback to default values on error
      }),
      finalize(() => {
        this.loading = false;
        this.cd.markForCheck();  // Trigger change detection
      })
    ).subscribe({
      next: ([hashtags, statusLabelsData, applicantDetails]) => {
        this.setupHashTags(hashtags);
        this.setupStatusLabels(statusLabelsData);

        if (this.SelectedResponseId > 0) {
          this.setupApplicantDetails(applicantDetails);  // Only set up if details are loaded
        }
      },
      error: () => {
        this.alertService.error('Error occurred while loading initial data');
      }
    });
  }


  
  loadHashtags(): Observable<HashTag[]> {
    return this.jobCentralService.getCRMHashTag(
      this.loginUser.Company.Id,
      'ATS',
      2
    );
  }

  loadApplicantStatusLabels(): Observable<ApplicationStatus[]>{
    return this.jobCentralService.fetchApplicantStatus(this.loginUser.Company.Id).pipe(
      map(response => {
        if (response.IsError) {
          throw new Error(response.ErrorMessage);
        }
        return response.Data;
      })
    );
  }

  loadApplicantDetails(): Observable<JobboardResponses> {
    const companyId = this.loginUser.Company.Id;
  
    return this.jobCentralService.ViewResponseDetails(companyId, this.SelectedResponseId).pipe(
      map(response => {
        if (response.IsError) {
          throw new Error(response.ErrorMessage);
        }
        return response.Data;
      })
    );
  }
  

  // Set up hashtags in the component
  setupHashTags(hashtags: HashTag[]): void {
    this.hashtags = hashtags;
  }

  // Set up applicant details and patch form data
  setupApplicantDetails(applicantDetails: any): void {
    if (applicantDetails) {
      this.currentApplicant = applicantDetails;
      this.patchFormData(this.currentApplicant);
    }
  }

  setupStatusLabels(LabelsData: any[]):void{
    this.statusLabels = LabelsData;
    this.EditApplicantStatusList = this.statusLabels.filter(item => item.IsDefault !=true);
  }

  patchFormData(applicant: any): void {debugger;
    this.addForm.patchValue({
      firstName: applicant.FirstName || '',
      lastName: applicant.LastName || '',
      email: applicant.Email || '',
      phone: applicant.Phno || '',
      DOB: applicant.DOB || '',
      SSN: applicant.SSN || '',
      LinkedIn: applicant.LinkedIn || '',
      AvailabilityToJoin: applicant.AvailabilityToJoin || '',
      workCategory: applicant.EmploymentType || '',
      PayRate: applicant.PayRate || '',
      wpermit: applicant.WorkPermit || '',
      jobtitle : applicant.JobTitle || ''

    });
    this.Techrating = Number(this.currentApplicant.TechnicalSkillRating);
    this.Commrating = Number(this.currentApplicant.CommunicationSkillRating);
    // Process hashtags
    if (this.currentApplicant.HashTags) {
      let ids: string[] = this.currentApplicant.HashTags.split(',');
      ids.forEach(element => {
        let hastagitem = this.hashtags.find(x => x.HashTagId == Number(element));
        if (hastagitem) {
          hastagitem.state = true;  // Only set state if hashtag is found
          this.selectedHashTagChips.push(hastagitem.HashTagId);
        }
      });
      this.selectedHashTagChips = this.currentApplicant.HashTags.split(',');
    } else {
      this.selectedHashTagChips = [];
    }

    // Process skills
    if (this.currentApplicant.Skillset) {
      this.selectedKeywords = this.currentApplicant.Skillset.split(",");
      this.addForm.get('skills').setValue(this.selectedKeywords);
    } else {
      this.selectedKeywords = [];
      this.addForm.get('skills').setValue('');
    }

    // Process references
    if (this.currentApplicant.ApplicantRefereces.length > 0) {
      this.currentApplicant.ApplicantRefereces.forEach(item => {
        if (item.RefType === "Refer1") {
          this.reference1 = item;
        } else if (item.RefType === "Refer2") {
          this.reference2 = item;
        } else if (item.RefType === "C2C") {
          this.cansubVClientAccount = this.PrepareAccountFromRefrence(item);
          this.c2creference = item;
          this.addForm.get('subVendorInfo').setValue(this.cansubVClientAccount);
        }
      });
    }

    this.IsAssigneeToMySelf = !!(this.currentApplicant.RecruiterList && 
      this.currentApplicant.RecruiterList.some(x => x.UserId === this.loginUser.UserId));
  }

  prepareAccount(AccountType, acunt: CandidateAccount) {
    let Account: CandidateAccount = new CandidateAccount();
    Account = acunt;
    Account.CreatedBy = this.loginUser.UserId;
    Account.CreatedDate = new Date();
    Account.AccountTypeID = AccountType;
    Account.Employer = acunt.Employer;
    Account.AccountLevel = "candidate";
    Account.MappingStatus = true;
    Account.CompanyID = this.loginUser.Company.Id;
    Account.AccountTypeName = this.accountTypes.CandidateC2C.find(x => x.value == AccountType).label;
    if (AccountType === this.enumAccountTypes.EndClient) {
      Account.SalesPOC = null;
    } else {
      Account.SalesPOC.CreatedBy = this.loginUser.UserId;
      Account.SalesPOC.CreatedDate = new Date();
      Account.SalesPOC.FirstName = acunt.SalesPOC.FirstName;
      Account.SalesPOC.LastName = acunt.SalesPOC.LastName;
      Account.SalesPOC.Email = acunt.SalesPOC.Email;
      Account.SalesPOC.Phonenumber = acunt.SalesPOC.Phonenumber;
    }
    return Account;
  }

  PrepareAccountFromRefrence(c2cref: ApplicantReferences) {
    let Account: CandidateAccount = new CandidateAccount();
    Account.AccountID = c2cref.AccountId;
    Account.AccountName = c2cref.Company;
    Account.AccountLevel = "candidate";
    Account.MappingStatus = true;
    Account.Employer = c2cref.Employer;
    Account.CreatedBy = this.loginUser.UserId;
    Account.CreatedDate = new Date();
    Account.CompanyID = this.loginUser.Company.Id;
    Account.AccountTypeName = this.accountTypes.CandidateC2C.find(x => x.value == 7).label;
    Account.SalesPOC.CreatedBy = this.loginUser.UserId;
    Account.SalesPOC.CreatedDate = new Date();
    Account.SalesPOC.FirstName = c2cref.FirstName;
    Account.SalesPOC.LastName = c2cref.LastName;
    Account.SalesPOC.Email = c2cref.Email;
    Account.SalesPOC.Phonenumber = c2cref.PhoneNumber;
    return Account;
  }

  onEmploymentTypeChange(value: string) {
    const subVendorControl = this.addForm.get('subVendorInfo');
    if (value === 'C2C') {
      // Make subVendorInfo required if C2C is selected
      subVendorControl.setValidators([Validators.required]);
    } else {
      // Remove the required validator if not C2C
      subVendorControl.clearValidators();
    }
    // Recalculate the validation status
    subVendorControl.updateValueAndValidity();
    this.currentApplicant.EmploymentType = value;
  }

  // Handle skill selection changes
  updateSelectedSkills(event: any): void {
    this.selectedKeywords = event;
    this.addForm.get('skills').setValue(this.selectedKeywords.length > 0 ? this.selectedKeywords : '');
    this.markFormAsDirty();
  }

  markFormAsDirty(): void {
    this.addForm.get('skills').markAsDirty();
  }

  UpdateReference1(event: any) {
    this.reference1 = event;
  }

  UpdateReference2(event: any) {
    this.reference2 = event;
  }

  // Reference form validity handlers
  onReference1FormValidity(isValid: boolean): void {
    if (isValid) {
      this.showReferencesError = false;
      this.reference1FormValid = true;
    }
  }

  onReference2FormValidity(isValid: boolean): void {
    if (isValid) {
      this.showReferencesError = false;
      this.reference2FormValid = true;
    }
  }

  GetSelectedSkills(event: any) {
    this.selectedKeywords = event;
    this.addForm.get('skills').setValue(this.selectedKeywords.length > 0 ? this.selectedKeywords : '');
    this.markFormAsDirty();
  }

  HashTagschangeSelected(parameter: string, query: string) {
    const index = this.selectedHashTagChips.indexOf(query);
    if (index >= 0) {
      this.selectedHashTagChips.splice(index, 1);
    } else {
      this.selectedHashTagChips.push(query);
    }

  }

  onRatingChange(event:any) {
    this.currentApplicant.TechnicalSkillRating = event.toString();
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  onCommRatingChange(event:any) {
    this.currentApplicant.CommunicationSkillRating = event.toString();
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  GetCandSubVendorData(subVendorData: any) {debugger;
    this.cansubVClientAccount = subVendorData;
    this.addForm.get('subVendorInfo').setValue(subVendorData);
  }

  getAssignAddress(event:any) {
    let data = event.address_components
    this.currentApplicant.ApplicantLocation = "";
    this.currentApplicant.City = "";
    this.currentApplicant.State = "";
    if (data.length > 0) {
      for (let address of data) {
        if (address.types.includes("street_number")) {
          //this.onboardEmployeeAssignment.WLAddress1 = address.long_name;
        } else if (address.types.includes("route")) {
          //this.onboardEmployeeAssignment.WLAddress1 = isNullOrUndefined(this.onboardEmployeeAssignment.WLAddress1) ? "" : this.onboardEmployeeAssignment.WLAddress1 + " " + address.long_name;
        } else if ((address.types.includes("sublocality") || (address.types.includes("locality")))) {
          this.currentApplicant.City = address.long_name;
        } else if (address.types.includes("administrative_area_level_1")) {
          this.currentApplicant.State = address.short_name;
        } else if (address.types.includes("country")) {
          //this.benchCandidates.Country = address.short_name;
        } else if (address.types.includes("postal_code")) {
          //this.benchCandidates.Zip = address.long_name;
        }
      }
      this.currentApplicant.ApplicantLocation = this.currentApplicant.City + ', ' + this.currentApplicant.State;
    }

    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }
  inputAssignAddress(event:any) {
  }

  DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }

  onLabelChange(change: MatSelectChange) {
    var selectedStatus = change.value;
    const Psubmission = {
      ApplicantId: this.currentApplicant.ResponseId,
      companyId: this.loginUser.Company.Id,
      ApplicantStatus: selectedStatus.StatusId,
      UpdatedBy: this.loginUser.UserId
    };
    this.jobCentralService.UpdateApplicantStatus(Psubmission)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this.alertService.success(response.SuccessMessage);

            this.currentApplicant.ApplicantStatusName = selectedStatus.StatusName;
            this.currentApplicant.ApplicantStatus = selectedStatus.StatusId;
            this.currentApplicant.bgClass = selectedStatus.bgclass;
          }
          if (!this.cd["distroyed"]) {
            this.cd.detectChanges();
          }
        },
        error => {
          this.alertService.error(error);
        }
      );
  }

  updateApplicant(): void {debugger;

    if (this.addForm.invalid) {
      this.triggerFormValidation();
      this.alertService.error('Please fill the required fields.');
      return;
    }
    
    if (this.appReferences_Mandatory) {
       // Only check `reference1FormValid` and `reference2FormValid` if mandatory
      if (!this.reference1FormValid && !this.reference2FormValid) {
        this.showReferencesError = true;
        this.triggerFormValidation();
        this.alertService.error('Please fill the required fields.');
        return;
      }
    }
    else{
      this.showReferencesError=false;
    }
  
    this.isLoading = true;

    const isReference1Empty = Object.values(this.reference1).every(value => {
      if (!value) {
        return true;
      }
      return false;
    });

    const isReference2Empty = Object.values(this.reference2).every(value => {
      if (!value) {
        return true;
      }
      return false;
    });

    if (isReference1Empty == false) {
      this.reference1.RefType = "Refer1";
      this.reference1.ApplicantId = this.currentApplicant.ResponseId;
      this.applicantsRefrences.push(this.reference1);
    }

    if (isReference2Empty == false) {
      this.reference2.RefType = "Refer2";
      this.reference2.ApplicantId = this.currentApplicant.ResponseId;
      this.applicantsRefrences.push(this.reference2);
    }

    if (this.currentApplicant.EmploymentType == "C2C") {
      if (this.cansubVClientAccount.AccountID > 0) {
        this.cansubVClientAccount.MappingStatus = true;
        this.cansubVClientAccount.CompanyID = this.loginUser.Company.Id;
        const account = this.DeepCopyForObject(this.cansubVClientAccount);
        const c2creference = this.DeepCopyForObject(this.c2creference);
        c2creference.ApplicantId = this.currentApplicant.ResponseId;
        c2creference.RefType = "C2C";
        c2creference.Company = account.AccountName;
        c2creference.FirstName = account.SalesPOC.FirstName;
        c2creference.LastName = account.SalesPOC.LastName;
        c2creference.Email = account.SalesPOC.Email;
        c2creference.PhoneNumber = account.SalesPOC.Phonenumber;
        c2creference.AccountId = account.AccountID;
        c2creference.ContactId = account.SalesPOC.ContactID;
        c2creference.Employer = account.Employer;
        this.applicantsRefrences.push(c2creference);

      } else if (this.cansubVClientAccount.AccountID == 0 && !isNullOrUndefined(this.cansubVClientAccount.AccountName) && this.cansubVClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.SubVendor, this.cansubVClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        const c2creference = this.DeepCopyForObject(this.c2creference);
        c2creference.ApplicantId = this.currentApplicant.ResponseId;
        c2creference.RefType = "C2C";
        c2creference.Company = account.AccountName;
        c2creference.FirstName = account.SalesPOC.FirstName;
        c2creference.LastName = account.SalesPOC.LastName;
        c2creference.Email = account.SalesPOC.Email;
        c2creference.PhoneNumber = account.SalesPOC.Phonenumber;
        c2creference.AccountId = account.AccountID;
        c2creference.ContactId = account.SalesPOC.ContactID;
        c2creference.Employer = account.Employer;
        this.applicantsRefrences.push(c2creference);
      }
    }

    // Manually map form fields to currentApplicant fields
    this.currentApplicant.FirstName = this.addForm.get('firstName')?.value;
    this.currentApplicant.LastName = this.addForm.get('lastName')?.value;
    this.currentApplicant.Email = this.addForm.get('email')?.value;
    this.currentApplicant.Phno = this.addForm.get('phone')?.value;
    this.currentApplicant.DOB = this.addForm.get('DOB')?.value;
    this.currentApplicant.SSN = this.addForm.get('SSN')?.value;
    this.currentApplicant.LinkedIn = this.addForm.get('LinkedIn')?.value;
    this.currentApplicant.AvailabilityToJoin = this.addForm.get('AvailabilityToJoin')?.value;
    this.currentApplicant.EmploymentType = this.addForm.get('workCategory')?.value;
    this.currentApplicant.PayRate = this.addForm.get('PayRate')?.value || null;
    this.currentApplicant.JobTitle = this.addForm.get('jobtitle')?.value;
    this.currentApplicant.WorkPermit = this.addForm.get('wpermit')?.value;

    //default values
    this.currentApplicant.ApplicantRefereces = this.applicantsRefrences;
    this.currentApplicant.UpdatedBy = this.loginUser.UserId;
    this.currentApplicant.IsCandidateViewed = true;

    if (this.selectedHashTagChips && this.selectedHashTagChips.length > 0)
      this.currentApplicant.HashTags = this.selectedHashTagChips.join(',');

    if (this.selectedKeywords && this.selectedKeywords.length > 0)
      this.currentApplicant.Skillset = this.selectedKeywords.join(",");

    if (this.SelectedResponseId > 0) {
      this.UpdateApplicant();
    }
    else {
      this.SaveNewApplicant();
    }
  }

  UpdateApplicant() {
    this.jobCentralService.UpdateInboxResponse(this.currentApplicant).subscribe(response => {
      if (!response.IsError) {
        this.alertService.success(response.SuccessMessage);
        this.applicantsRefrences = [];
      }
      else {
        this.alertService.error(response.ErrorMessage);
      }
    }, error => {
      this.alertService.error(error);
    })
  }

  SaveNewApplicant() {
    this.currentApplicant.CreatedDate = new Date();
    this.currentApplicant.ActualDate = new Date();
    this.currentApplicant.AssignedDate = new Date();
    this.currentApplicant.CreatedBy = this.loginUser.UserId;
    this.currentApplicant.RecruiterId = this.loginUser.UserId;
    this.currentApplicant.CompanyId = this.loginUser.Company.Id;
    this.currentApplicant.ApplicantSource = "Manual";
    this.currentApplicant.IsCandidateViewed = true;
    this.jobCentralService.NewApplicant(this.currentApplicant).subscribe(response => {
      if (!response.IsError) {
        this.alertService.success(response.SuccessMessage);
        this.dialogRef.close(response.Data);
        this.applicantsRefrences = [];
      }
      else {
        this.alertService.error(response.ErrorMessage);
      }
    }, error => {
      this.alertService.error(error);
    })
  }

  triggerFormValidation(): void {
    Object.keys(this.addForm.controls).forEach(controlName => {
      this.addForm.controls[controlName].markAsTouched();
      this.addForm.controls[controlName].updateValueAndValidity();
    });
  }

  onChange(event) {
    this.fileUploadLoading = true;
    if (this.currentApplicant.AttachedFilePath) {
      this.clearDocument();
    }
    var target = event.target || event.srcElement; //if target isn't there then take srcElement
    let file = target.files;
    if (file && file.length === 0) {
      this.alertService.error('Please Upload a file to continue');
      return;
    }
    this.jobCentralService.UploadApplicantResume(file)
      .subscribe(response => {
        this.currentApplicant.ActualFileName = response.ActualFileName;
        this.currentApplicant.AttachedFilePath = response.AttachedFilePath;
        this.currentApplicant.AttachedFileName = response.AttachedFileName;

        setTimeout(() => {
          this.fileUploadLoading = false;
          // Trigger change detection
          this.cd.detectChanges();
          if (this.currentApplicant.ResponseId > 0) {
            this.UpdateNewResumeToAplicant();
          }
        }, 5000);
      },
        error => {
          this.alertService.error(error);
          this.fileUploadLoading = false;
        })
  }

  UpdateNewResumeToAplicant() {
    const appFilter = {
      ResponseId: this.currentApplicant.ResponseId,
      AttachedFileName: this.currentApplicant.AttachedFileName,
      ActualFileName: this.currentApplicant.ActualFileName,
      DisplayFileName: this.currentApplicant.AttachedFilePath,
      CompanyId: this.loginUser.Company.Id
    }
    this.jobCentralService.UpdateApplicantResume(appFilter)
      .subscribe(response => {
        if (!response.IsError) {
          this.alertService.success(response.SuccessMessage);
        }
        else {
          this.alertService.error(response.ErrorMessage);
        }
      },
        error => {
          this.alertService.error(error);

        })
  }

  clearDocument() {
    this.currentApplicant.AttachedFilePath = null;
    this.cd.detectChanges();
  }


  clearFields() {
    this.selectedHashTagChips = [];
    this.applicantsRefrences = [];
    this.addForm.reset();
    this.loadInitialData();
  }

  formatPhoneNumber(value: string): string {
    const cleaned = ('' + value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : value;
  }

  phoneValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value ? control.value.trim() : '';

    // Check if the input is empty or null
    if (value === null || value === '') {
      return null; // No validation errors for empty value
    }

    // Regular expression for phone number in format (XXX) XXX-XXXX
    const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

    if (phonePattern.test(value)) {
      return null;  // Valid phone number
    } else {
      return { 'invalidPhoneNumber': true };  // Invalid phone number
    }
  }

  AssignMyselfApplicant() {
    var applicant = new RecruiterMappings();
    applicant.ID = 1;
    applicant.RecruiterId = this.loginUser.UserId;
    applicant.ApplicantId = this.currentApplicant.ResponseId;
    applicant.MappingStatus = true;
    applicant.RecruiterEmail = this.loginUser.Email;
    applicant.RecruiterName = this.loginUser.FullName;
    this.applicantsMapping.push(applicant);

    const applicants = {
      companyId: this.loginUser.Company.Id,
      ResponseId: this.currentApplicant.ResponseId,
      applicantRecruiters: this.applicantsMapping,
      AssignedBy: this.loginUser.UserId,
      Notes: null,
      Action: 'Assign',
      UpdateBy: this.loginUser.UserId
    }
    this.jobCentralService.AssignSingleApplicants(applicants).subscribe(response => {
      if (!response.IsError) {
        this.alertService.success(response.SuccessMessage);
        this.applicantsMapping = [];
        if (this.SelectedSource == 'LinkedIn')
          this._eventemtterservice.linkedinResponseEvent.emit();
        else if (this.SelectedSource == 'Dice')
          this._eventemtterservice.DiceResponseEvent.emit();
        else if (this.SelectedSource == 'ACP')
          this._eventemtterservice.OtherSourceResponseEvent.emit();
        else if (this.SelectedSource == 'Ignored')
          this._eventemtterservice.IgnoredResponsesEvent.emit();
        else if (this.SelectedSource == 'Monster')
          this._eventemtterservice.MonsterResponseEvent.emit();
      }
      else {
        this.alertService.error(response.ErrorMessage);
      }
    }, error => {
      this.alertService.error(error);
    })
  }

  AssignApplcant() {
    this.dialog.open(ApplicantAssignComponent, {
      data: { responses: null, model: 'single', responseId: this.currentApplicant.ResponseId }, width: '60%', height: '60vh', disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {

        if (this.SelectedSource == 'LinkedIn')
          this._eventemtterservice.linkedinResponseEvent.emit();
        else if (this.SelectedSource == 'Dice')
          this._eventemtterservice.DiceResponseEvent.emit();
        else if (this.SelectedSource == 'ACP')
          this._eventemtterservice.OtherSourceResponseEvent.emit();
        else if (this.SelectedSource == 'Ignored')
          this._eventemtterservice.IgnoredResponsesEvent.emit();
        else if (this.SelectedSource == 'Monster')
          this._eventemtterservice.MonsterResponseEvent.emit();
      }
    });
  }

  ReviewApplcant() {
    this.dialog.open(AssignMyselfComponent, {
      data: { resourceId: this.currentApplicant.ResponseId, resourceType: 'Inbox' }, maxWidth: '95vw', width: '95vw', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        if (this.SelectedSource == 'LinkedIn')
          this._eventemtterservice.linkedinResponseEvent.emit();
        else if (this.SelectedSource == 'Dice')
          this._eventemtterservice.DiceResponseEvent.emit();
        else if (this.SelectedSource == 'ACP')
          this._eventemtterservice.OtherSourceResponseEvent.emit();
        else if (this.SelectedSource == 'Ignored')
          this._eventemtterservice.IgnoredResponsesEvent.emit();
        else if (this.SelectedSource == 'Monster')
          this._eventemtterservice.MonsterResponseEvent.emit();
      }
    });
  }

  IgnoreApplicant() {
    this.dialog.open(ApplicantIgnoreComponent, {
      data: { responseId: this.currentApplicant.ResponseId, Source: this.SelectedSource }, width: '60%', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {

        if (this.SelectedSource == 'LinkedIn')
          this._eventemtterservice.linkedinResponseEvent.emit();
        else if (this.SelectedSource == 'Dice')
          this._eventemtterservice.DiceResponseEvent.emit();
        else if (this.SelectedSource == 'ACP')
          this._eventemtterservice.OtherSourceResponseEvent.emit();
        else if (this.SelectedSource == 'Ignored')
          this._eventemtterservice.IgnoredResponsesEvent.emit();
        else if (this.SelectedSource == 'Monster')
          this._eventemtterservice.MonsterResponseEvent.emit();

        this.dialogRef.close();
      }
    });
  }

  ShareApplcant() {
    this.dialog.open(ShareApplicantComponent, {
      data: { resourceId: this.currentApplicant.ResponseId, resourceType: 'Applicant' }, width: '60%', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
      }
    });
  }

  SaveToDB() {
    this.dialog.open(ApplicantCandidateComponent, {
      data: { applicantId: this.currentApplicant.ResponseId, candidateId: 0 }, maxWidth: '95vw', width: '95vw', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
        //written logic in stored procedure.
      }
    });
  }

  AssignForTechScreen() {
    const message = 'Applicant <b><span class="displayEmail"> ' + this.currentApplicant.FirstName + ' ' + this.currentApplicant.LastName + ' </span></b> status will be changed to Under Tech Screen ?'
    const dialogData = new ConfirmDialogModel("Tech Screen", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        const Psubmission = {
          ApplicantId: this.currentApplicant.ResponseId,
          companyId: this.loginUser.Company.Id,
          ApplicantStatus: 10, //Under Tech Screen
          UpdatedBy: this.loginUser.UserId,
          IsUnderTechScreen: true
        };
        this.UpdateResponseStatus(Psubmission);
      }
    });
  }

  AssignForMarketing() {
    const message = 'Applicant <b><span class="displayEmail"> ' + this.currentApplicant.FirstName + ' ' + this.currentApplicant.LastName + ' </span></b> will be moved to Marketing Screen ?'
    const dialogData = new ConfirmDialogModel("Tech Screen", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        const Psubmission = {
          ApplicantId: this.currentApplicant.ResponseId,
          companyId: this.loginUser.Company.Id,
          ApplicantStatus: 14,//Marketing Status 
          UpdatedBy: this.loginUser.UserId,
          IsMarketing: true
        };
        this.UpdateResponseStatus(Psubmission);
      }
    });
  }

  UpdateResponseStatus(ResponseStaus: any) {
    this.jobCentralService.UpdateApplicantStatusWithRecruiter(ResponseStaus)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this.alertService.success(response.SuccessMessage);
          }
        },
        error => {
          this.alertService.error(error);
        }
      );
  }

  BackToInbox() {
    const message = 'Applicant ' + this.currentApplicant.FirstName + " " + this.currentApplicant.LastName + ' will be moved to Inbox? Please provide a reason.'
    const dialogData = new ConfirmDialogModel("Back To Inbox", message);
    const dialogRef = this.dialog.open(ConfirmDialogNotesComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.ConfirmBackToInbox(this.currentApplicant, this.DialogResponse.Notes);
      }
    });
  }

  ConfirmBackToInbox(applicant: JobboardResponses, DeleteNotes: string) {
    if (applicant.ResponseId > 0) {
      const pfilters = {
        InboxId: applicant.ResponseId,
        applicantId: 0,
        companyId: this.loginUser.Company.Id,
        updatedby: this.loginUser.UserId,
        notes: DeleteNotes,
        RecruiterId: this.loginUser.UserId
      };
      this.jobCentralService.ApplicantBackToInbox(pfilters).subscribe(response => {
        if (response.IsError == false) {
          this.alertService.success("Applicant Successfully Moved to Inbox");

          if (this.SelectedSource == 'LinkedIn')
            this._eventemtterservice.linkedinResponseEvent.emit();
          else if (this.SelectedSource == 'Dice')
            this._eventemtterservice.DiceResponseEvent.emit();
          else if (this.SelectedSource == 'ACP')
            this._eventemtterservice.OtherSourceResponseEvent.emit();
          else if (this.SelectedSource == 'Ignored')
            this._eventemtterservice.IgnoredResponsesEvent.emit();
          else if (this.SelectedSource == 'Monster')
            this._eventemtterservice.MonsterResponseEvent.emit();

          this.dialogRef.close();

        }
      },
        error => {
          this.alertService.error(error);
        })
    }
  }

  viewClose() {
    this.dialogRef.close(0);
  }

  downloadResume() {
    this.jobCentralService.DownloadInboxResume(this.currentApplicant.CompanyId, this.currentApplicant.ResponseId)
      .subscribe(response => {
        let filename = this.currentApplicant.AttachedFileName;
        FileSaver.saveAs(response, filename);
      },
        error => {
          this.alertService.error("Error while downloading the file.");
        })
  }

  contentLoaded() {
    this.fileUploadLoading = false;
    //document.getElementById("progressBar").style.display = "none";
  }

  async emailDuplicateValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    const email = control.value; debugger;
    
    // If no email is entered, return null (no error)
    if (!email) {
      return null;
    }
  
    // Use the existing CheckCandidateByEmail method to perform the validation
    const isDuplicate = await this.CheckCandidateByEmail(email);
    
    return isDuplicate ? { duplicateEmail: true } : null;
  }

  addEmailDuplicateValidator() {
    const emailControl = this.addForm.get('email');
    if (emailControl) {
      emailControl.setAsyncValidators(this.emailDuplicateValidator.bind(this));
      emailControl.updateValueAndValidity(); // Trigger validation
    }
  }
  
  // Modify the CheckCandidateByEmail method to accept the email as a parameter and return a boolean directly
  async CheckCandidateByEmail(email: string): Promise<boolean> {
    if (!email.trim()) {
      return false;
    }
  
    const ApplicantSearchVM = {
      ResponseId: 0, // For new applicant, set ResponseId to 0
      Email: email.trim(),
      CompanyId: this.loginUser.Company.Id
    };
  
    const response = await this.jobCentralService.SyncCheckApplicantByEmail(ApplicantSearchVM);
    
    if (response.IsError) {
      this.alertService.error(response.ErrorMessage);
      return false;
    }
    
    const isDuplicate = response.Data.some(applicant => applicant.ResponseId !== this.SelectedResponseId);
    if (isDuplicate) {
      this.alertService.error("Applicant with the same email address already exists in Database");
    }
    
    return isDuplicate;
  }
  


}