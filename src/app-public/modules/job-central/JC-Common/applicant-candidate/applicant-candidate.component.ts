import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadResponse, Keywords, LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { BenchCandidateService } from 'src/@shared/http/bench-candidates.service';
import { MarketingDashboardService } from 'src/@shared/http/marketingdashboard.service';
import { AccountTypes } from 'src/static-data/accounttypes';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ValidationService } from 'src/@cv/services/validation.service';
import { distinct, map, takeUntil } from 'rxjs/operators';
import { merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { SubUsers } from 'src/@shared/models/common/subusers';
import { HashTag } from 'src/@shared/models/hashtags';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { ResumeSource } from 'src/@shared/models/common/resumesource';
import { MatSelectChange } from '@angular/material/select';
import { JobCentralService } from '../../core/http/job-central.service';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { UntilDestroy } from '@ngneat/until-destroy';
import moment from 'moment';
import { ApplicantReferences } from '../../core/model/applicantrefences';
import { CandidateMaster } from 'src/@shared/models/common/candidatemaster';
import { CandidateAccount } from 'src/@shared/core/ats/models/candidateaccount';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { CandidateReferences } from 'src/@shared/models/common/candidaterefences';
import * as FileSaver from 'file-saver';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { JobboardResponses } from '../../core/model/jobboardresponses';
import { FormPermissionsService } from 'src/@shared/services/formpermissions.service';
import { IconService } from 'src/@shared/services/icon.service';
import { WorkStatusService } from 'src/@shared/http/work-status.service';

@UntilDestroy()
@Component({
  selector: 'cv-applicant-candidate',
  templateUrl: './applicant-candidate.component.html',
  styleUrls: ['./applicant-candidate.component.scss'],
  animations: [
    fadeInUp400ms,
  ],
  providers: [BenchCandidateService, AccountTypes, FormPermissionsService]
})
export class ApplicantCandidateComponent implements OnInit {

  chipsControl = new FormControl();
  chipsControlValue$ = this.chipsControl.valueChanges;

  ActionMode: string = null;
  title = "Save To DataBase";
  loginUser: LoginUser;
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;
  htselectable: boolean = true;
  htremovable: boolean = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  currentApplicant: JobboardResponses = new JobboardResponses();
  assigneesMulti: FormControl = new FormControl();
  assigneesMultiFilter: FormControl = new FormControl();
  filteredAssignees: ReplaySubject<assign[]> = new ReplaySubject<assign[]>(1);
  public assignees: assign[] = [{ value: 'ramesh', name: 'Ramesh Karra' }, { value: 'Murali', name: 'Murali a' }, { value: 'Rajesh', name: 'Rajesh G' }]
  public _onDestroy = new Subject<void>();
  public assignedList: SelectItem[];
  public RecruiterList: SelectItem[];
  public benchCandidates: CandidateMaster = new CandidateMaster();
  public uploaderDropZoneOver: boolean = false;
  public keywords: Keywords[];
  public hashtags: HashTag[];
  public benchSubUsers: SubUsers[];
  addForm: FormGroup;
  SelectedKwywods: string[] = [];

  HashTagCtrl = new FormControl();
  AllHashTags: string[] = [];
  filteredHashTags: Observable<any[]>;
  SelectedHashTags: any;

  CertCtrl = new FormControl();
  SelectedCerts: string[] = [];
  certselectable: boolean = true;
  certremovable: boolean = true;

  AssigneeCtrl = new FormControl();
  SelectedAssigness: assign[] = [];
  assigneesselectable: boolean = true;
  assigneesremovable: boolean = true;

  public isFileUploaded: boolean = true;
  public workStatuFields: SelectItem[] = [];
  public CandidateStatus: SelectItem[] = [];
  public resumeSource: ResumeSource[];
  public loading: boolean = false;

  public status_textClass: any = 'text-amber-contrast';
  public status_bgClass: any = 'bg-amber';
  isSummary: boolean = false;
  isnotes: boolean = false;

  @ViewChild('fruitInput') fruitInput: ElementRef;
  @ViewChild('hashTagInput') hashTagInput: ElementRef;
  @ViewChild('AssigneeInput') AssigneeInput: ElementRef;

  selectedHashTagChips: any[] = [];

  fileUploadLoading: boolean = false;
  public fileUploadResponse: FileUploadResponse;
  unsubscribe$: Subject<void> = new Subject<void>();

  c2cFromGroup: FormGroup;
  reference1: CandidateReferences = new CandidateReferences();
  reference2: CandidateReferences = new CandidateReferences();
  c2creference: ApplicantReferences = new ApplicantReferences();

  appreference1: ApplicantReferences = new ApplicantReferences();
  appreference2: ApplicantReferences = new ApplicantReferences();
  appc2creference: ApplicantReferences = new ApplicantReferences();

  applicantsRefrences: ApplicantReferences[] = [];

  public enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  cansubVClientAccount: CandidateAccount = new CandidateAccount();
  c2cFormValid: boolean = true;
  IsLocation: boolean = false;
  IsPageDirty: boolean = false;
  dataLoaded: boolean = false;
  reference1FormValid: boolean = true;
  reference2FormValid: boolean = true;
  appReferences_Mandatory: boolean = false;
  appReferences_Readonly: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public def_applicantId: any,
    private dialogRef: MatDialogRef<ApplicantCandidateComponent>,
    private fb: FormBuilder,
    private _service: BenchCandidateService,
    private _mrktService: MarketingDashboardService,
    private _jobService: JobCentralService,
    private cd: ChangeDetectorRef, private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private accountTypes: AccountTypes,
    private jobCentralService: JobCentralService,
    private _formService: FormPermissionsService,
    public iconService: IconService,
    private workStatusService: WorkStatusService) {
    this.addForm = this.fb.group({
      firstName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      lastName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      AvailabilityToJoin: [],
      DOB: [],
      SSN: [null, [ValidationService.ValidateSSN]],
      phone: [null, [Validators.required, ValidationService.phonenumValidator]],
      email: [null, [Validators.required, Validators.email]],
      LinkedIn: [null, [ValidationService.LinkedIn_urlValidator]],
      ApplicantLocation: [null],
      Notes: [null],
      workCategory: [],
      PayRate: [null],
      c2cfirstName: [null],
      c2clastName: [null],
      c2cphonenumber: [null],
      c2cemail: [null],
      wexperience: [],
      wpermit: [Validators.required],
      jobtitle: [Validators.required],
      SkillRating: [], CommRating: []
    });

    this.CandidateStatus = this.accountTypes.CandidateStatus;
    this.resumeSource = [];
    var appRef_attributes = _formService.getFrmPermissions_JobCentral('Applicant_Save_To_DB', 'app_ref');
    this.appReferences_Mandatory = appRef_attributes.find(attr => attr.Key === 'Required')?.Value;
    this.appReferences_Readonly = appRef_attributes.find(attr => attr.Key === 'Readonly')?.Value;
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getHashtags();
      this.GetApplicantDetails(this.loginUser.Company.Id, this.def_applicantId.applicantId);
      this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id).subscribe(data => {
        this.workStatuFields = data;
      });
    }
    this.chipsControlValue$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => this.SelectedHashTags = value);
  }

  GetApplicantDetails(companyId: number, applicantId: number) {
    this._jobService.ViewResponseDetails(companyId, applicantId).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.currentApplicant = result.Data;
        if (this.currentApplicant.ApplicantLocation == "-Not Specified-") {
          this.currentApplicant.ApplicantLocation = "";
          this.IsLocation = false;
        }
        else {
          this.IsLocation = true;
        }
        if (this.currentApplicant.EmploymentType == "W2") {
          this.c2cFormValid = true;
        }

        if (this.currentApplicant.Skillset) {
          this.SelectedKwywods = this.currentApplicant.Skillset.split(",");
        }
        else {
          this.SelectedKwywods = [];
        }

        if (this.currentApplicant.HashTags) {
          let ids: string[] = this.currentApplicant.HashTags.split(',');
          ids.forEach(element => {
            let hastagitem = this.hashtags.find(x => x.HashTagId == Number(element));
            hastagitem.state = true;
            this.selectedHashTagChips.push(hastagitem.HashTagId);
          });
          this.selectedHashTagChips = this.currentApplicant.HashTags.split(',');
        }
        else
          this.selectedHashTagChips = [];

        if (this.currentApplicant.ApplicantRefereces.length > 0) {
          this.currentApplicant.ApplicantRefereces.forEach(item => {
            if (item.RefType == "Refer1") {
              this.reference1.FirstName = item.FirstName;
              this.reference1.LastName = item.LastName;
              this.reference1.Email = item.Email;
              this.reference1.PhoneNumber = item.PhoneNumber;
            } else if (item.RefType = "Refer2") {
              this.reference2.FirstName = item.FirstName;
              this.reference2.LastName = item.LastName;
              this.reference2.Email = item.Email;
              this.reference2.PhoneNumber = item.PhoneNumber;
            }
            else if (item.RefType = "C2C") {
              this.cansubVClientAccount = this.PrepareAccountFromRefrence(item);
              this.c2creference = item;
            }
          })
        }

      }
      if (!this.cd["distroyed"]) {
        this.cd.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  getHashtags() {
    this._service.getCRMHashTag(this.loginUser.Company.Id, 'ATS', 2)
      .subscribe(
        hashtags => {
          this.hashtags = hashtags;
          this.hashtags.forEach(item => {
            this.AllHashTags.push(item.HashTagText);
          });
        },
        error => this._alertService.error(error));

  }

  HashTagschangeSelected(parameter: string, query: string) {
    const index = this.selectedHashTagChips.indexOf(query);
    if (index >= 0) {
      this.selectedHashTagChips.splice(index, 1);
    } else {
      this.selectedHashTagChips.push(query);
    }
    this.IsPageDirty = true;
  }

  getResumeSourceByCompany() {
    this._service.getResumeSourceByCompany(this.loginUser.Company.Id)
      .subscribe(
        resumeSource => {
          this.resumeSource = resumeSource;
        },
        error => {
          this._alertService.error(error);
        });
  }

  inputAssignAddress(event) {
    this.getAssignAddress(event);
  }

  getAssignAddress(event) {
    this.IsPageDirty = true;
    let data = event.address_components
    this.currentApplicant.ApplicantLocation = "";
    this.currentApplicant.City = "";
    this.currentApplicant.State = "";

    if (data && data.length > 0) {
      for (let address of data) {
        if ((address.types.includes("sublocality") || (address.types.includes("locality")))) {
          this.currentApplicant.City = address.long_name;
        }
        else if (address.types.includes("administrative_area_level_1")) {
          this.currentApplicant.State = address.short_name;
        }
      }
      this.currentApplicant.ApplicantLocation = this.currentApplicant.City + ', ' + this.currentApplicant.State;
      this.IsLocation = true;
    }
    else {
      this.currentApplicant.ApplicantLocation = null;
      this.IsLocation = false;
    }
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  SaveCandidate() {

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

    let currentDate: any = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
    this.loading = true;
    this.benchCandidates.Title = " ";
    this.benchCandidates.CompanyId = this.loginUser.Company.Id;
    this.benchCandidates.FirstName = this.currentApplicant.FirstName;
    this.benchCandidates.LastName = this.currentApplicant.LastName;
    this.benchCandidates.Email = this.currentApplicant.Email;
    this.benchCandidates.PrimaryPhoneNumber = this.currentApplicant.Phno;
    this.benchCandidates.AvailabilityToStart = this.currentApplicant.AvailabilityToJoin;
    this.benchCandidates.LinkedIn = this.currentApplicant.LinkedIn;
    this.benchCandidates.DOB = this.currentApplicant.DOB;
    this.benchCandidates.SSN = this.currentApplicant.SSN;
    this.benchCandidates.City = this.currentApplicant.City;
    this.benchCandidates.State = this.currentApplicant.State;
    this.benchCandidates.PayRate = this.currentApplicant.PayRate == undefined ? "0" : this.currentApplicant.PayRate.toString();
    this.benchCandidates.EmploymentType = this.currentApplicant.EmploymentType;
    this.benchCandidates.Notes = this.currentApplicant.Notes;
    this.benchCandidates.TempFileSource = this.currentApplicant.AttachedFilePath;
    this.benchCandidates.TempKey = this.currentApplicant.ActualFileName;
    this.benchCandidates.Source = this.currentApplicant.ApplicantSource;

    if (this.selectedHashTagChips && this.selectedHashTagChips.length > 0)
      this.benchCandidates.HashTags = this.selectedHashTagChips.join(',');

    if (this.SelectedAssigness && this.SelectedAssigness.length > 0)
      this.benchCandidates.Assigned_To = this.SelectedAssigness.map(({ value }) => value);

    if (this.SelectedKwywods && this.SelectedKwywods.length > 0)
      this.benchCandidates.Skillset = this.SelectedKwywods.join(",");


    this.benchCandidates.CreatedBy = this.loginUser.UserId;
    this.benchCandidates.BenchCandidate = false;
    this.benchCandidates.UpdatedBy = this.loginUser.UserId;
    this.benchCandidates.Module = 2; //jobcentral;
    this.benchCandidates.WorkStatusExpiry = null;
    this.benchCandidates.CreatedDate = currentDate;
    this.benchCandidates.ApplicantId = this.def_applicantId.applicantId;
    this.benchCandidates.IsTransferApplicantNotes = true;
    this.benchCandidates.IsFromInbox = true;

    if (this.benchCandidates.EmploymentType == 'C2C') {
      if (this.cansubVClientAccount.AccountID > 0) {
        this.cansubVClientAccount.MappingStatus = true;
        this.cansubVClientAccount.CompanyID = this.loginUser.Company.Id;
        const account = this.DeepCopyForObject(this.cansubVClientAccount);
        this.benchCandidates.AccountMasters.push(account)
      } else if (this.cansubVClientAccount.AccountID == 0 && !isNullOrUndefined(this.cansubVClientAccount.AccountName) && this.cansubVClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.SubPrimeVendor, this.cansubVClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.benchCandidates.AccountMasters.push(account);
      }
    }

    if (isReference1Empty == false) {
      this.reference1.RefType = "Refer1";
      this.reference1.CandidateId = 0;
      this.benchCandidates.CandidateReferences.push(this.reference1);
    }

    if (isReference2Empty == false) {
      this.reference2.RefType = "Refer2";
      this.reference2.CandidateId = 0;
      this.benchCandidates.CandidateReferences.push(this.reference2);
    }

    this._jobService.SaveCandidateFromApplicant(this.benchCandidates)
      .subscribe(
        response => {
          if (response.IsError == false) {
            let canId = response.Data;
            this._alertService.success("Candidate Created Successfully");
            this.loading = false;
            this.dialogRef.close(canId);
          }
          else {
            this._alertService.error(response.ErrorMessage);
            this.loading = false;
          }
        },
        error => {
          this._alertService.error(error);
          this.loading = false;
        }
      );

  }

  onInputKeyPress(event): void {
    const pattern = /[0-9\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.code !== 'Backspace' && event.code !== 'Tab' &&
      event.code !== 'ArrowLeft' && event.code !== 'ArrowRight') {
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }

  onLabelChange(change: MatSelectChange) {
    var selectedStatus = change.value;
    this.benchCandidates.StatusName = selectedStatus.label;
    this.benchCandidates.Status = selectedStatus.value;
  }

  getBenchSubUsers() {
    this.assignees = [];
    this.RecruiterList = [];
    this._service.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          this.benchSubUsers = response;
          var salesTeam = response.filter(item => item.IsActive == true);
          var recruiterTeam = response.filter(item => item.IsActive == true);

          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId });
            });

          this.filteredAssignees.next(this.assignees.slice());
          this.assigneesMultiFilter.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
            this.filterAssigness();
          })

          merge(recruiterTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.RecruiterList.push({ label: y.FullName, value: y.UserId });
            });

        },
        error => {
          this._alertService.error(error);
        });
  }

  filterAssigness() {
    if (!this.assignees) {
      return;
    }
    let search = this.assigneesMultiFilter.value;
    if (!search) {
      this.filteredAssignees.next(this.assignees.slice());
      return;
    } else
      search = search.toLowerCase();
    this.filteredAssignees.next(
      this.assignees.filter(ass => ass.name.toLowerCase().indexOf(search) > -1)
    );
  }


  downloadResume() {
    if (this.currentApplicant.AttachedFilePath) {
      this._jobService.downloadApplicantResume(this.currentApplicant.CompanyId, this.currentApplicant.ResponseId)
        .subscribe(response => {
          let filename = this.currentApplicant.AttachedFileName;
          FileSaver.saveAs(response, filename);
        },
          error => {
            this._alertService.error("Error while downloading the file.");
          })
    }
    else {
      this._alertService.error("Resume is  not available for this candidate.");
    }
  }


  onChange(event) {
    this.fileUploadLoading = true;
    var target = event.target || event.srcElement; //if target isn't there then take srcElement
    let file = target.files;
    if (file && file.length === 0) {
      this._alertService.error('Please Upload a file to continue');
      return;
    }
    this._mrktService.uploadResumeAndParsing(file)
      .subscribe(response => {
        this.fileUploadResponse = response.Data;
        this.benchCandidates.TempKey = this.fileUploadResponse.TempKey;
        this.benchCandidates.ViewResumeInnerPath = this.fileUploadResponse.ViewResumeInnerPath;
        this.benchCandidates.UploadedFileName = this.fileUploadResponse.UploadedFileName;
        this.benchCandidates.TempFileSource = this.fileUploadResponse.ViewResumeInnerPath;
        this.currentApplicant.AttachedFilePath = this.fileUploadResponse.ViewResumeInnerPath;
        this.fileUploadLoading = false;
      },
        error => {
          this._alertService.error(error);
          this.fileUploadLoading = false;
        })

        if (!this.cd["distroyed"]) {
          this.cd.detectChanges();
        }
  }

  viewClose() {
    this.dialogRef.close(false);
  }

  GetCandSubVendorData(event) {
    this.cansubVClientAccount = event;
    this.IsPageDirty = true;
  }

  GetTechRating(event) {
    this.currentApplicant.TechnicalSkillRating = event.toString();
    this.IsPageDirty = true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  GetCommRating(event) {
    this.currentApplicant.CommunicationSkillRating = event.toString();
    this.IsPageDirty = true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }

  prepareAccount(AccountType, acunt: CandidateAccount) {
    let Account: CandidateAccount = new CandidateAccount();
    Account = acunt;
    Account.CreatedBy = this.loginUser.UserId;
    Account.CreatedDate = new Date();
    Account.AccountTypeID = AccountType;
    Account.Employer = false;
    Account.AccountLevel = "candidate";
    Account.MappingStatus = true;
    Account.CompanyID = this.loginUser.Company.Id;
    Account.AccountTypeName = this.accountTypes.ThirdPartyClientList.find(x => x.value == AccountType).label;
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

  contentLoaded() {
    document.getElementById("progressBar").style.display = "none";
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

  UpdateApplicant() {
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

    const isC2CEmpty = Object.values(this.c2creference).every(value => {
      if (!value) {
        return true;
      }
      return false;
    });

    if (isReference1Empty == false) {
      this.appreference1.RefType = "Refer1";
      this.appreference1.ApplicantId = this.def_applicantId.applicantId;
      this.applicantsRefrences.push(this.appreference1);
    }

    if (isReference2Empty == false) {
      this.appreference2.RefType = "Refer2";
      this.appreference2.ApplicantId = this.def_applicantId.applicantId;
      this.applicantsRefrences.push(this.appreference2);
    }

    if (isC2CEmpty == false) {
      this.appc2creference.RefType = "C2C";
      this.appc2creference.ApplicantId = this.def_applicantId.applicantId;
      this.applicantsRefrences.push(this.c2creference);
    }

    this.currentApplicant.CompanyId = this.loginUser.Company.Id;
    this.currentApplicant.ApplicantRefereces = this.applicantsRefrences;

    if (this.selectedHashTagChips && this.selectedHashTagChips.length > 0)
      this.currentApplicant.HashTags = this.selectedHashTagChips.join(',');

    this.currentApplicant.IsCandidateViewed = true;
    this.jobCentralService.UpdateInboxResponse(this.currentApplicant).subscribe(response => {
      if (!response.IsError) {
        this.SaveCandidate();
      }
      else {
        this._alertService.error(response.ErrorMessage);
      }
    }, error => {
      this._alertService.error(error);
    })
  }

  clearFields() {
    this.applicantsRefrences=[];
    this.SelectedKwywods=[];
    this.selectedHashTagChips=[];
    this.reference1 = new CandidateReferences();
    this.reference2 = new CandidateReferences();
    this.c2creference = new ApplicantReferences();
    this.addForm.markAsPristine();
    this.cd.detectChanges();
    //this.GetApplicantDetails(this.loginUser.Company.Id, this.def_applicantId.applicantId);
    this.ngOnInit();
  }

  PrepareAccountFromRefrence(c2cref: ApplicantReferences) {
    let Account: CandidateAccount = new CandidateAccount();
    Account.AccountID = c2cref.AccountId;
    Account.AccountName = c2cref.Company;
    Account.AccountLevel = "candidate";
    Account.MappingStatus = true;
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

  onChildFormValidityChanged(validity: boolean) {
    this.c2cFormValid = validity;
  }

  onEmploymentTypeChange(ob) {
    if (ob.value == 'W2')
      this.c2cFormValid = true;
    else
      this.c2cFormValid = false;
  }

  GetSelectedSkills(event) {
    this.SelectedKwywods = event;
    this.IsPageDirty = true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  UpdateReference1(event) {
    this.IsPageDirty = true;
    this.reference1 = event;
  }

  UpdateReference2(event) {
    this.IsPageDirty = true;
    this.reference2 = event;
  }

  OnReference1FormValidity(validity: boolean) {
    this.reference1FormValid = validity;
  }

  OnReference2FormValidity(validity: boolean) {
    this.reference2FormValid = validity;
  }

}

export class assign {
  value: string;
  name: string;
  constructor() {
    this.value = null;
    this.name = null;
  }
}
