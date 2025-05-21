import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadResponse, Keywords, LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService } from 'src/@shared/services';
import { BenchCandidateService } from 'src/@shared/services/bench-candidates.service';
import { MarketingDashboardService } from 'src/@shared/services/marketingdashboard.service';
import { AccountTypes } from 'src/static-data/accounttypes';
import icClose from '@iconify/icons-ic/twotone-close';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icPerson from '@iconify/icons-ic/twotone-person';
import icfileupload from '@iconify/icons-ic/file-upload';
import icPictureAsPdf from '@iconify/icons-ic/twotone-picture-as-pdf';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icShare from '@iconify/icons-ic/twotone-share';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ValidationService } from 'src/@cv/services/validation.service';
import { distinct, map, takeUntil } from 'rxjs/operators';
import { merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { SubUsers } from 'src/@shared/models/common/subusers';
import { HashTag } from 'src/@shared/models/hashtags';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { BenchCandidate } from 'src/@shared/models/common/benchcandidate';
import { ResumeSource } from 'src//@shared/models/common/resumesource';
import { MatSelectChange } from '@angular/material/select';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { UntilDestroy } from '@ngneat/until-destroy';
import moment from 'moment';
import { CandidateReferences } from 'src//@shared/models/common/candidaterefences';
import { AccountTypeNameEnum, AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { CandidateAccount } from 'src//@shared/core/ats/models/candidateaccount';
import { JobCandidateService } from '../../core/http/jobcandidate.service';
import { CandidateMaster } from 'src//@shared/models/common/candidatemaster';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import * as FileSaver from 'file-saver';
import { JobCentralService } from '../../core/http/job-central.service';
import { ShareApplicantComponent } from '../../JC-Common/share-applicant/share-applicant.component';
import { CandidateAssignComponent } from '../candidate-assign/candidate-assign.component';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import icnote from '@iconify/icons-ic/note';
import { MatTabChangeEvent } from '@angular/material/tabs';
import icInfo from '@iconify/icons-ic/twotone-info';
import { WorkStatusService } from 'src/@shared/http/work-status.service';

@UntilDestroy()
@Component({
  selector: 'cv-edit-candidate',
  templateUrl: './edit-candidate.component.html',
  styleUrls: ['./edit-candidate.component.scss'],
  animations: [
    fadeInUp400ms,
  ],
  providers: [BenchCandidateService, AccountTypes]
})
export class EditCandidateComponent implements OnInit {

  chipsControl = new FormControl();
  chipsControlValue$ = this.chipsControl.valueChanges;

  ActionMode: string = null;
  title = "Add Candidate";
  loginUser: LoginUser;
  icInfo =icInfo;
  icClose = icClose;
  icEdit = icEdit;
  icPerson = icPerson;
  icfileupload = icfileupload;
  icPictureAsPdf = icPictureAsPdf;
  icDelete = icDelete;
  icPersonAdd = icPersonAdd;
  icShare=icShare;
  icArrowDropDown=icArrowDropDown;
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;
  htselectable: boolean = true;
  htremovable: boolean = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  assigneesMulti: FormControl = new FormControl();
  assigneesMultiFilter: FormControl = new FormControl();
  filteredAssignees: ReplaySubject<assign[]> = new ReplaySubject<assign[]>(1);
  public assignees: assign[] = [];
  public _onDestroy = new Subject<void>();
  public assignedList: SelectItem[];
  public RecruiterList: SelectItem[];
  public benchCandidates: CandidateMaster = new CandidateMaster();
  public uploaderDropZoneOver: boolean = false;
  public keywords: Keywords[];
  public hashtags: HashTag[];
  public benchSubUsers: SubUsers[];
  addForm: FormGroup;
  // KeywordCtrl = new FormControl();
  // AllKeywords: string[] = [];
  // filteredKeywords: Observable<any[]>;
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
  workStatuFields: SelectItem[] = [];
  public CandidateStatus: SelectItem[] = [];
  public resumeSource: ResumeSource[];
  public loading: boolean = false;

  public status_textClass: any = 'text-amber-contrast';
  public status_bgClass: any = 'bg-amber';

  @ViewChild('fruitInput') fruitInput: ElementRef;
  @ViewChild('hashTagInput') hashTagInput: ElementRef;
  @ViewChild('AssigneeInput') AssigneeInput: ElementRef;

  selectedHashTagChips: any[] = [];

  fileUploadLoading: boolean = false;
  public fileUploadResponse: FileUploadResponse;
  unsubscribe$: Subject<void> = new Subject<void>();

  enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  enumAccountTypeName: typeof AccountTypeNameEnum = AccountTypeNameEnum;
  cansubVClientAccount: CandidateAccount = new CandidateAccount();
  icnote=icnote;
  ref1FromGroup: FormGroup;
  ref2FromGroup: FormGroup;
  c2cFromGroup: FormGroup;
  reference1: CandidateReferences = new CandidateReferences();
  reference2: CandidateReferences = new CandidateReferences();
  c2creference: CandidateReferences = new CandidateReferences();
  DialogResponse: ConfirmDialogModelResponse;
  datemask = [/\d/, /\d/, '/', /\d/, /\d/];
  isSummary: boolean = false;
  isnotes: boolean = false;
  IsPageDirty:boolean=false;
  c2cFormValid:boolean=true;
  IsLocation: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public inputValues: any,
    private dialogRef: MatDialogRef<EditCandidateComponent>,
    private fb: FormBuilder,
    private _jobservice: JobCentralService,
    private _jcservice: JobCandidateService,
    private _service: BenchCandidateService,
    private _mrktService: MarketingDashboardService,
    private cd: ChangeDetectorRef, 
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private accountTypes: AccountTypes,
    private _eventemtterservice: EventEmitterService,
    private dialog: MatDialog,
    private workStatusService: WorkStatusService) {
    this.addForm = this.fb.group({
      firstName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      lastName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      phone: [null, [Validators.required,ValidationService.phonenumValidator]],
      email: [null, [Validators.required, Validators.email]],  // Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      location: [null],
      wexperience: [null],
      skills: [null],
      tags: [null],
      wpermit: [null, [Validators.required]],
      wpermitexpiration: [null],
      cansource: [null],
      PayRate: [null,[ValidationService.numberValidator]],
      assignees: [null],
      benchpriority: [null],
      Certifications: [null],
      LinkedIn: [null],
      title: [null],
      Qualification: [null],
      Notes: [null],
      AvailablityToStart: [null],
      DOB: [],
      SSN: [],
      EmployementType: [],
      jobtitle:[null],
      SkillRating: [null],
      CommRating: [null]
    });
    this.ref1FromGroup = this.fb.group({
      firstName: [null, [ValidationService.onlyAlphabetsValidator]],
      lastName: [null, [ValidationService.onlyAlphabetsValidator]],
      company: [null],
      designation: [null],
      email: [null,[Validators.email]],
      phonenumber: [null,[ValidationService.phonenumValidator]]
    });
    this.ref2FromGroup = this.fb.group({
      firstName: [null, [ValidationService.onlyAlphabetsValidator]],
      lastName: [null, [ValidationService.onlyAlphabetsValidator]],
      company: [null],
      designation: [null],
      email: [null,[Validators.email]],
      phonenumber: [null,[ValidationService.phonenumValidator]]
    });
    this.c2cFromGroup = this.fb.group({
      firstName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      lastName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      email: [null,[Validators.required, Validators.email]],
      phonenumber: [null,[Validators.required]]
    });
   
    
    this.CandidateStatus = this.accountTypes.CandidateStatus;
    this.resumeSource = [];
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.isSummary = true;
      this.getHashtags();
      this.getCandidate(this.inputValues.candidateId);
      this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id).subscribe(data => {
        this.workStatuFields = data;
      });
      if (!this.cd["distroyed"]) {
        this.cd.detectChanges();
      }
    }
    this.chipsControlValue$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(value => this.SelectedHashTags = value);
  }


  getCandidate(CandidateId: number) {
    this._jcservice.GetCandidateForEdit(CandidateId, this.loginUser.Company.Id)
      .subscribe(response => {
        if (response.IsError == false) {
          this.benchCandidates = response.Data;
          this.benchCandidates.PrimaryPhoneNumber = this.PhoneValid(this.benchCandidates.PrimaryPhoneNumber);

          if (this.benchCandidates.Skillset) {
            this.SelectedKwywods = this.benchCandidates.Skillset.split(",");
          }
          else {
            this.SelectedKwywods = [];
          }

          if (this.benchCandidates.HashTags) {
            let ids: string[] = this.benchCandidates.HashTags.split(',');
            ids.forEach(element => {
              let hastagitem = this.hashtags.find(x => x.HashTagId == Number(element));
              hastagitem.state = true;
              this.selectedHashTagChips.push(hastagitem.HashTagId);
            });
            this.selectedHashTagChips = this.benchCandidates.HashTags.split(',');
          }
          else
            this.selectedHashTagChips = [];

          this.SelectedCerts = this.benchCandidates.Certifications ? this.benchCandidates.Certifications.split(',') : [];

          this.SelectedAssigness = this.benchCandidates.AssignedList;
          if(this.benchCandidates.AccountMasters.length>0){
           this.benchCandidates.AccountMasters.forEach(element =>{
            const acntTypeName = this.getAccounttypeName(element.AccountTypeID);
            const prepaedAccount = this.prepareAccount(element.AccountTypeID, element);
            this.cansubVClientAccount = prepaedAccount;
           })
          }

          if(this.benchCandidates.CandidateReferences.length > 0){
            this.benchCandidates.CandidateReferences.forEach(item=>{
              if(item.RefType=="Refer1"){
                this.reference1 = item;
              }else if(item.RefType=="Refer2"){
                this.reference2 = item;
              }
            })
          }
        
          if (!this.cd["distroyed"]) {
            this.cd.detectChanges();
          }
        }
        else {
          this._alertService.error(response.ErrorMessage);
        }
      }, error => {
        this._alertService.error(error);
      });
  }


  onPhoneNumberChange() {
    this.benchCandidates.PrimaryPhoneNumber = this.PhoneValid(this.benchCandidates.PrimaryPhoneNumber);
  }
  private PhoneValid(phone) {
    //normalize string and remove all unnecessary characters
    if (phone) {
      phone = phone.replace(/[^\d]/g, "");
      //check if number length equals to 10
      if (phone.length == 10) {
        //reformat and return phone number
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  

  getHashtags() {
    this._service.getCRMHashTag(this.loginUser.Company.Id, 'ATS', 2)
      .subscribe(
        hashtags => {
          this.hashtags = hashtags;
          this.hashtags.forEach(item => {
            this.AllHashTags.push(item.HashTagText);
          });
          this.getResumeSourceByCompany();
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
    this.IsPageDirty=true;
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
    this.getAssignAddress(event.target.value);
  }
  getAssignAddress(event) {
    this.IsPageDirty = true;
    let data = event.address_components
    this.benchCandidates.Location = "";
    this.benchCandidates.City = "";
    this.benchCandidates.State = "";

    if (data && data.length > 0) {
      for (let address of data) {
        if ((address.types.includes("sublocality") || (address.types.includes("locality")))) {
          this.benchCandidates.City = address.long_name;
        }
        else if (address.types.includes("administrative_area_level_1")) {
          this.benchCandidates.State = address.short_name;
        }
      }
      this.benchCandidates.Location = this.benchCandidates.City + ', ' + this.benchCandidates.State;
      this.IsLocation = true;
    }
    else {
      this.benchCandidates.Location = null;
      this.IsLocation = false;
    }
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }
  // getAssignAddress(event) {
  //   let data = event.address_components
  //   this.benchCandidates.Location = "";
  //   this.benchCandidates.City = "";
  //   this.benchCandidates.State = "";
  //   this.benchCandidates.Country = "";
  //   this.benchCandidates.ZipCode = "";
  //   if (data.length > 0) {
  //     for (let address of data) {
  //       if (address.types.includes("street_number")) {
  //         //this.onboardEmployeeAssignment.WLAddress1 = address.long_name;
  //       } else if (address.types.includes("route")) {
  //         //this.onboardEmployeeAssignment.WLAddress1 = isNullOrUndefined(this.onboardEmployeeAssignment.WLAddress1) ? "" : this.onboardEmployeeAssignment.WLAddress1 + " " + address.long_name;
  //       } else if ((address.types.includes("sublocality") || (address.types.includes("locality")))) {
  //         this.benchCandidates.City = address.long_name;
  //       } else if (address.types.includes("administrative_area_level_1")) {
  //         this.benchCandidates.State = address.short_name;
  //       } else if (address.types.includes("country")) {
  //         this.benchCandidates.Country = address.short_name;
  //       } else if (address.types.includes("postal_code")) {
  //         this.benchCandidates.Zip = address.long_name;
  //       }
  //     }
  //     this.benchCandidates.Location = this.benchCandidates.City + ', ' + this.benchCandidates.State;
  //   }
  // }

  UpdateCandidate() {
    let currentDate: any = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
    this.loading = true;

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

    if(this.benchCandidates.EmploymentType=='C2C'){
      if (this.cansubVClientAccount.AccountID > 0) {
        this.cansubVClientAccount.MappingStatus = true;
        this.cansubVClientAccount.CompanyID=this.loginUser.Company.Id;
        const account = this.DeepCopyForObject(this.cansubVClientAccount);
        this.benchCandidates.AccountMasters.push(account)
      } else if (this.cansubVClientAccount.AccountID == 0 && !isNullOrUndefined(this.cansubVClientAccount.AccountName) && this.cansubVClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.SubVendor, this.cansubVClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.benchCandidates.AccountMasters.push(account);
      }
    }

    this.benchCandidates.CompanyId = this.loginUser.Company.Id;

    if (this.selectedHashTagChips && this.selectedHashTagChips.length > 0)
      this.benchCandidates.HashTags = this.selectedHashTagChips.join(',');

    if (this.SelectedAssigness && this.SelectedAssigness.length > 0)
      this.benchCandidates.Assigned_To = this.SelectedAssigness.map(({ value }) => value);

    if (this.SelectedKwywods && this.SelectedKwywods.length > 0)
      this.benchCandidates.Skillset = this.SelectedKwywods.join(",");


    this.benchCandidates.CompanyId = this.loginUser.Company.Id;
    this.benchCandidates.BenchCandidate = false;
    this.benchCandidates.UpdatedBy = this.loginUser.UserId;
    this.benchCandidates.Module = 2; //jobcentral;
    this.benchCandidates.WorkStatusExpiry = null;
    this.benchCandidates.CreatedDate = new Date();;
    this.benchCandidates.ApplicantId = 0;
    this.benchCandidates.IsTransferApplicantNotes=false;
    this.benchCandidates.IsFromInbox=false;
    this.benchCandidates.Email = this.benchCandidates.CandidateEmail;
    

    this._jcservice.SaveCandidate(this.benchCandidates)
      .subscribe(
        response => {
          if (response.IsError == false) {
            let canId = response.Data;
            this._alertService.success("Candidate Updated Successfully");
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

  // RemoveResume(resumeBank: BenchCandidate) {
  //   this._mrktService.RemoveCandidateResume(resumeBank.CandidateID).subscribe(response => {
  //     this._alertService.success("resume removed successfully");
  //     this.benchCandidates.Resume_Path_Bucket = null;
  //     this.benchCandidates.ResumePathType = null;
  //     this.benchCandidates.ResumePathKey = null;
  //     this.benchCandidates.UploadedFileName = null;

  //   }, error => {
  //     this._alertService.error(error);
  //   });
  // }

  onChange(event) {
    this.fileUploadLoading = true;
    if (this.benchCandidates.ViewResumeInnerPath) {
      this.clearDocument();
    }
    var target = event.target || event.srcElement; //if target isn't there then take srcElement
    let file = target.files;
    if (file && file.length === 0) {
      this._alertService.error('Please Upload a file to continue');
      return;
    }
    this._mrktService.uploadResumeAndParsing(file)
      .subscribe(response => {debugger;
        this.fileUploadResponse = response.Data;
        this.benchCandidates.TempKey = this.fileUploadResponse.TempKey;
        this.benchCandidates.ViewResumeInnerPath = this.fileUploadResponse.ViewResumeInnerPath;
        this.benchCandidates.UploadedFileName = file[0].name;
        this.benchCandidates.TempFileSource = "New";
    
        setTimeout(() => {
          this.fileUploadLoading = false;
          // Trigger change detection
          this.cd.detectChanges();
        }, 5000);
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
    this.dialogRef.close(true);
  }

  GetCandSubVendorData(event) {
    this.cansubVClientAccount = event;
    this.IsPageDirty=true;
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
    Account.CompanyID=this.loginUser.Company.Id;
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

  getAccounttypeName(AccountTypeId): string {
    let Name = "";
    if (AccountTypeId === this.enumAccountTypes.EndClient) {
      Name = this.enumAccountTypeName.EndClient;
    } else if (AccountTypeId === this.enumAccountTypes.PrimeVendor) {
      Name = this.enumAccountTypeName.PrimeVendor;
    } else if (AccountTypeId === this.enumAccountTypes.ManagedServiceProvider) {
      Name = this.enumAccountTypeName.ManagedServiceProvider
    } else if (AccountTypeId === this.enumAccountTypes.ImplementationPartner) {
      Name = this.enumAccountTypeName.ImplementationPartner
    } else if (AccountTypeId === this.enumAccountTypes.SubPrimeVendor) {
      Name = this.enumAccountTypeName.SubPrimeVendor
    } else if (AccountTypeId === this.enumAccountTypes.ReferralVendor) {
      Name = this.enumAccountTypeName.ReferralVendor
    }
    else if(AccountTypeId === this.enumAccountTypes.SubVendor){
      Name = this.enumAccountTypeName.SubVendor
    }
    return Name;
  }

  downloadResume(){
    if (this.benchCandidates.ResumePathKey) {
      this._jobservice.downloadResumeFile(this.benchCandidates.ResumePathKey, this.benchCandidates.ResumePathType)
        .subscribe(response => {
          let filename = this.benchCandidates.UploadedFileName;
          FileSaver.saveAs(response, filename);
        }),
        error => {
          this._alertService.error("Error while downloading the file.");
        }
    }
    else
    {
      this._alertService.error("Resume is  not available for this candidate.");
    }
  }

  contentLoaded() {
    this.fileUploadLoading=false;
    //document.getElementById("progressBar").style.display = "none";
  }

  ShareCandidate() {
    this.dialog.open(ShareApplicantComponent, {
      data: { resourceId: this.benchCandidates.CandidateID, resourceType: 'Candidate', }, width: '60%', height: '65vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
      }
    });
  }

  AssignRecruiter(){
    this.dialog.open(CandidateAssignComponent, {
      data: { candidateId: this.benchCandidates.CandidateID, resourceType: 'Recruiter', }, width: '60%', height: '65vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
      }
    });
  }

  AssignManager(){
    this.dialog.open(CandidateAssignComponent, {
      data: { candidateId: this.benchCandidates.CandidateID, resourceType: 'Manager', }, width: '60%', height: '65vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
      }
    });
  }

  DeleteCandidate() {
    const message = 'Candidate  <b><span class="displayEmail"> ' + this.benchCandidates.FirstName + ' ' + this.benchCandidates.LastName + ' </span></b> will be deleted from database ?'
    const dialogData = new ConfirmDialogModel("Delete Candidate", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.OnCofirmCandidateDelete(this.benchCandidates);
      }
    });
  }

  OnCofirmCandidateDelete(candidate: BenchCandidate) {
    const candidateVM = {
      CandidateId: candidate.CandidateID,
      CompanyId: this.loginUser.Company.Id,
      UpdatedBy: this.loginUser.UserId
    }
    this._jcservice.DeleteCandidate(candidateVM).subscribe(result => {
      if (result.IsError == false) {
        this._alertService.success(result.SuccessMessage);
      }
      else {
        this._alertService.error(result.ErrorMessage);
      }

    }, error => {
      this._alertService.error(error);
    });

    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }

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

  clearFields(){
    this.SelectedKwywods=[];
    this.selectedHashTagChips=[];
    this.reference1 = new CandidateReferences();
    this.reference2 = new CandidateReferences();
    this.c2creference = new CandidateReferences();
    this.addForm.markAsPristine();
    this.cd.detectChanges();

    this.ngOnInit();
  }

  onChildFormValidityChanged(validity: boolean) {
    this.c2cFormValid = validity;
  }

  GetTechRating(event){
    this.benchCandidates.TechnicalSkillRating = event.toString();
    this.IsPageDirty=true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  GetCommRating(event){
    this.benchCandidates.CommunicationSkillRating = event.toString();
    this.IsPageDirty=true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  onEmploymentTypeChange(ob) {
    if(ob.value=='W2')
      this.c2cFormValid = true;
    else
      this.c2cFormValid = false;
  }

  GetSelectedSkills(event) {debugger;
    this.SelectedKwywods = event;
    this.IsPageDirty=true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  clearDocument() {
    this.benchCandidates.ViewResumeInnerPath = null;
    this.cd.detectChanges();
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
