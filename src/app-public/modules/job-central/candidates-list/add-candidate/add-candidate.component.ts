import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import icClose from '@iconify/icons-ic/twotone-close';
import { Inject } from '@angular/core';
import icfileupload from '@iconify/icons-ic/file-upload';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { distinct, map } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';
import { ValidationService } from 'src/@cv/services/validation.service';
import { JobCandidateService } from '../../core/http/jobcandidate.service';
import { Keywords } from 'src/@shared/models';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HashTag } from 'src/@shared/models/hashtags';
import { FileUploadResponse } from 'src/@shared/models/fileuploadresponse';
import icPictureAsPdf from '@iconify/icons-ic/twotone-picture-as-pdf';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { AccountTypes } from 'src/static-data/accounttypes';
import { ResumeSource } from 'src/@shared/models/common/resumesource';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import { LoginUser } from 'src/@shared/models';
import { SubUsers } from  'src/@shared/models/common/subusers';
import iclocationon from '@iconify/icons-ic/location-on';
import { FileStoreService } from 'src/@shared/services/file-store.service'; 
import { assign } from 'src/@shared/models/assign';
import { CandidateMaster } from 'src/@shared/models/common/candidatemaster';
import { CandidateAccount } from 'src/@shared/core/ats/models/candidateaccount';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { CandidateReferences } from 'src/@shared/models/common/candidaterefences';
import { MatTabChangeEvent } from '@angular/material/tabs';
import icnote from '@iconify/icons-ic/note';
import icInfo from '@iconify/icons-ic/twotone-info';
import { ConfirmDialogExistsComponent } from 'src/@shared/components/filter-components/confirm-dialog-exists/confirm-dialog-exists.component';
import { MarketingDashboardService } from 'src/@shared/services/marketingdashboard.service';
import { WorkStatusService } from 'src/@shared/http/work-status.service';


@Component({
  selector: 'cv-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [JobCandidateService, AccountTypes, FileStoreService]
})
export class AddCandidateComponent implements OnInit {

  loginUser: LoginUser;

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;
  htselectable: boolean = true;
  htremovable: boolean = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  public fileUploadLoading: boolean = false;
  public fileUploadResponse: FileUploadResponse;
  filuploadControl: FormControl = new FormControl();
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  assigneesMulti: FormControl = new FormControl();
  assigneesMultiFilter: FormControl = new FormControl();
  icnote = icnote;
  icInfo = icInfo;
  existingCandidate: CandidateMaster = new CandidateMaster();
  public benchCandidates: CandidateMaster = new CandidateMaster();
  public uploaderDropZoneOver: boolean = false;
  public keywords: Keywords[];
  public hashtags: HashTag[];
  viewHashtags: string[] = [];
  public benchSubUsers: SubUsers[];
  AssignToNames: string[] = [];
  addForm: FormGroup;
  form: FormGroup;
  icDoneAll = icDoneAll;
  icClose = icClose;
  icFileUpload = icfileupload;
  icPictureAsPdf = icPictureAsPdf;
  iclocationon = iclocationon;
  public candidateCVUploader: FileUploader = new FileUploader({ url: this.fileStoreService.uploadResume() });
  public assignees: assign[] = [];
  public _onDestroy = new Subject<void>();
  SelectedKwywods: string[] = [];

  HashTagCtrl = new FormControl();
  AllHashTags: string[] = [];
  filteredHashTags: Observable<any[]>;
  SelectedHashTags: string[] = [];

  CertCtrl = new FormControl();
  SelectedCerts: string[] = [];
  certselectable: boolean = true;
  certremovable: boolean = true;

  filteredAssignees: Observable<any[]>;
  Allassignees: string[] = [];
  AssigneeCtrl = new FormControl();
  SelectedAssigness: assign[] = [];
  assigneesselectable: boolean = true;
  assigneesremovable: boolean = true;

  public isFileUploaded: boolean = false;
  public workStatusFields: SelectItem[] = [];
  public resumeSource: ResumeSource[];
  public loading: boolean = false;

  @ViewChild('fruitInput') fruitInput: ElementRef;
  @ViewChild('hashTagInput') hashTagInput: ElementRef;
  @ViewChild('AssigneeInput') AssigneeInput: ElementRef;
  @ViewChild('FieldEmail') FieldEmail: ElementRef;

  selectedHashTagChips: any[] = [];
  IsFileLoading: boolean = false;

  public enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  cansubVClientAccount: CandidateAccount = new CandidateAccount();

  ref1FromGroup: FormGroup;
  ref2FromGroup: FormGroup;
  reference1: CandidateReferences = new CandidateReferences();
  reference2: CandidateReferences = new CandidateReferences();
  c2creference: CandidateReferences = new CandidateReferences();
  isSummary: boolean = false;
  isnotes: boolean = false;
  datemask = [/\d/, /\d/, '/', /\d/, /\d/];
  @ViewChild('fieldEmail') fieldEmail: ElementRef;
  c2cFormValid:boolean=true;
  IsLocation:boolean=false;
  //input value -- {applicantId:0,candidateId:0,jobID:0,source:'jobcentral'}
  constructor(@Inject(MAT_DIALOG_DATA) public inputvalues: any,
    private dialogRef: MatDialogRef<AddCandidateComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _service: JobCandidateService,
    private cdRef: ChangeDetectorRef, 
    private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private accountTypes: AccountTypes,
    private fileStoreService: FileStoreService,
    private _mrktService: MarketingDashboardService,
    private workStatusService: WorkStatusService
  ) {
    this.addForm = this.fb.group({
      firstName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      lastName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      phone: [null, [Validators.required,ValidationService.phonenumValidator]],
      email: [null, [Validators.required, Validators.email]],
      location: [null,[ValidationService.urlValidator]],
      wexperience: [null, [ValidationService.numberWithDecimalValidator]],
      skills: [null],
      tags: [null],
      wpermit: [null, [Validators.required]],
      wpermitexpiration: [null],
      cansource: [null],
      PayRate: [null],
      assignees: [null],
      benchpriority: [null],
      Certifications: [null],
      LinkedIn: [null],
      Availability_To: [null],
      title: [null, [Validators.required]],
      Qualification: [null],
      DOB: [null],
      SSN: [null],
      Notes: [null],
      EmploymentType: [null],
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
    
    this.form = this._formBuilder.group({
      terms: ['', Validators.required]
    });
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['']
    });

    this.fileUploadResponse = {
      DisplayFileName: '',
      ActualFileName: '',
      UploadedFileName: '',
      ViewResumeInnerPath:'',
      TempKey:''
    }
    
    this.resumeSource = [];

    // this.filteredKeywords = this.KeywordCtrl.valueChanges.pipe(
    //   map((item: string | null) => item ? this._filter(item) : this.AllKeywords.slice()));

    this.filteredHashTags = this.HashTagCtrl.valueChanges.pipe(
      map((htag: string | null) => htag ? this._Hashtgsfilter(htag) : this.AllHashTags.slice()));

    this.filteredAssignees = this.AssigneeCtrl.valueChanges.pipe(
      map((item: string | null) => item ? this._Assignfilter(item) : this.assignees.slice()));

    this.benchCandidates = new CandidateMaster();

  }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.isSummary = true;
      this.getHashtags();

      this.loadWorkStatusFields().subscribe({
        next: (workStatusFields) => {
          this.workStatusFields = workStatusFields;
          if (!this.cdRef["distroyed"]) {
            this.cdRef.detectChanges();
          }
        },
        error: (error) => {
          console.error('Error loading work status fields:', error);
          this._alertService.error('Error loading work status fields');
        }
      });
      
      this.benchCandidates.WorkStatusExpiry = null;
      this.getBenchSubUsers();
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }
    this.candidateCVUploader.onAfterAddingFile = (item: FileItem) => {
      this.fileUploadLoading = true;
      item.withCredentials = false;
      item.file.name = item.file.name;
      this.candidateCVUploader.uploadItem(item);
    }
    this.candidateCVUploader.onSuccessItem = (item: FileItem, response: string) => {
      let result = JSON.parse(response);
      this.isFileUploaded = true;
      this.fileUploadResponse = result;
      this.benchCandidates = result;
      this.fileUploadLoading = true;
      this.benchCandidates.TempKey = this.fileUploadResponse.ActualFileName;
      this.benchCandidates.ViewResumeInnerPath = this.fileUploadResponse.DisplayFileName;
      this.benchCandidates.UploadedFileName = item.file.name;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }

  }

  loadWorkStatusFields() {
    return this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id);
  }

  fileOverCV(e: any) {
    this.uploaderDropZoneOver = e;
  }
  getAddress(event) {
    let data = event.address_components
    this.benchCandidates.Location = null;
    if (data.length > 0) {
      for (let address of data) {
        if (address.types.includes("locality")) {
          this.benchCandidates.Location = address.long_name;
        } else if (address.types.includes("administrative_area_level_1")) {
          this.benchCandidates.Location += ", " + address.long_name;
        }
      }
    }
  }
  
  inputEmployeeAddress(event) {
    this.benchCandidates.Location = (event.target.value === null || event.target.value === undefined) ? "" : event.target.value;
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
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  // GetKeywords() {
  //   this._service.GetKeywords(this.loginUser.Company.Id)
  //     .subscribe(
  //       keyword => {
  //         this.keywords = keyword;
  //         this.keywords.forEach(item => {
  //           this.AllKeywords.push(item.KeywordsText)
  //         });
  //       },
  //       error => alert(error));
  // }

  getHashtags() {
    this._service.getCRMHashTag(this.loginUser.Company.Id, 'ATS', 2)
      .subscribe(
        hashtags => {
          this.hashtags = hashtags;
          this.hashtags.forEach(item => {
            this.AllHashTags.push(item.HashTagText)
          });
          this.getResumeSourceByCompany();
        },
        error => alert(error));

  }

  private _Hashtgsfilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.AllHashTags.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.AllKeywords.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  // }

  private _Assignfilter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.assignees.filter(fruit => fruit.name.toLowerCase().indexOf(filterValue) === 0);
  }

  // remove(item: any): void {
  //   const index = this.SelectedKwywods.indexOf(item);

  //   if (index >= 0) {
  //     this.SelectedKwywods.splice(index, 1);
  //   }
  // }

  removeHashTag(tagitem: any): void {
    const index = this.SelectedHashTags.indexOf(tagitem);

    if (index >= 0) {
      this.SelectedHashTags.splice(index, 1);
    }
  }

  certremove(certitem: any): void {
    const index = this.SelectedCerts.indexOf(certitem);
    if (index >= 0) {
      this.SelectedCerts.splice(index, 1);
    }
  }

  assigneesremove(assigneeitem: any): void {
    const index = this.SelectedAssigness.indexOf(assigneeitem);
    if (index >= 0) {
      this.SelectedAssigness.splice(index, 1);
    }
  }

  // add(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;

  //   // Add our fruit
  //   if ((value || '').trim()) {
  //     this.SelectedKwywods.push(value.trim());
  //   }

  //   // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }

  //   this.KeywordCtrl.setValue(null);

  // }
  // selected(event: MatAutocompleteSelectedEvent): void {
  //   this.SelectedKwywods.push(event.option.viewValue);
  //   this.fruitInput.nativeElement.value = '';
  //   this.KeywordCtrl.setValue(null);
  // }

  addHashTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.SelectedHashTags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.HashTagCtrl.setValue(null);

  }
  addCert(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.SelectedCerts.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.CertCtrl.setValue(null);
  }

  hashtagselected(event: MatAutocompleteSelectedEvent): void {
    this.SelectedHashTags.push(event.option.viewValue);
    this.hashTagInput.nativeElement.value = '';
    this.HashTagCtrl.setValue(null);
  }
  Assigneeselected(event: MatAutocompleteSelectedEvent): void {
    const newassing = new assign();
    newassing.name = event.option.viewValue;
    newassing.value = event.option.value;
    let exitem = this.SelectedAssigness.find(x => x.value == newassing.value);
    if (!exitem) {
      this.SelectedAssigness.push(newassing);
    }
    this.AssigneeInput.nativeElement.value = '';
    this.AssigneeCtrl.setValue(null);
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
  onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
  }
  

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
      .subscribe(response => {
        this.fileUploadResponse = response.Data;
        this.benchCandidates.TempKey = this.fileUploadResponse.TempKey;
        this.benchCandidates.ViewResumeInnerPath = this.fileUploadResponse.ViewResumeInnerPath;
        this.benchCandidates.UploadedFileName = file[0].name;
        this.benchCandidates.TempFileSource = "New";

        setTimeout(() => {
          this.fileUploadLoading = false;
          // Trigger change detection
          this.cdRef.detectChanges();
        }, 5000);
      },
        error => {
          this._alertService.error(error);
          this.fileUploadLoading = false;
        })

        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
  }

  deleteFile() {
    this.filuploadControl.reset();
    this.fileUploadResponse.ActualFileName = null;
    this.fileUploadResponse.ActualFileName = null;
    this.fileUploadResponse.UploadedFileName = null;
    this.benchCandidates.TempKey = null;
    this.benchCandidates.ViewResumeInnerPath = null;
    this.benchCandidates.UploadedFileName = null;
    this.fileUploadLoading = false;
    this.isFileUploaded = false;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  inputAssignAddress(event) {
    this.getAssignAddress(event.target.value);
    event.target.value=null;
  }
  
  getAssignAddress(event) {

    this.benchCandidates.Location = "";
    this.benchCandidates.City = "";
    this.benchCandidates.State = "";

    let data = event.address_components
    
    if (data && data.length > 0) {
      for (let address of data) {
       if ((address.types.includes("sublocality") || (address.types.includes("locality")))) {
          this.benchCandidates.City = address.long_name;
        } 
        else if (address.types.includes("administrative_area_level_1")) {
          this.benchCandidates.State = address.short_name;
        } 
      }
      this.benchCandidates.Location = this.benchCandidates.City +', ' +this.benchCandidates.State;
      this.IsLocation=true;
    }
    else{
      this.benchCandidates.Location = "";
      this.IsLocation=false;
      this.cdRef.detectChanges();
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  

  saveCandidate() {
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


    if (this.SelectedKwywods && this.SelectedKwywods.length > 0)
      this.benchCandidates.Skillset = this.SelectedKwywods.join(",");

    if (this.selectedHashTagChips && this.selectedHashTagChips.length > 0)
      this.benchCandidates.HashTags = this.selectedHashTagChips.join(',');

    if (this.SelectedCerts && this.SelectedCerts.length > 0)
      this.benchCandidates.Certifications = this.SelectedCerts.join(',');

    if (this.SelectedAssigness && this.SelectedAssigness.length > 0) {
      this.benchCandidates.Assigned_To = this.SelectedAssigness.map(({ value }) => value);
    }
    else {
      let selfassign: string[] = [];
      selfassign.push(this.loginUser.UserId);
      this.benchCandidates.Assigned_To = selfassign;
    }

    if (this.benchCandidates.EmploymentType == 'C2C') {
      if (this.cansubVClientAccount.AccountID > 0) {
        this.cansubVClientAccount.MappingStatus = true;
        this.cansubVClientAccount.CompanyID = this.loginUser.Company.Id;
        const account = this.DeepCopyForObject(this.cansubVClientAccount);
        this.benchCandidates.AccountMasters.push(account)
      } else if (this.cansubVClientAccount.AccountID == 0 && !isNullOrUndefined(this.cansubVClientAccount.AccountName) && this.cansubVClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.SubVendor, this.cansubVClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.benchCandidates.AccountMasters.push(account);
      }
    }

    if (this.inputvalues && this.inputvalues.jobID && this.inputvalues.jobID > 0) {
      this.benchCandidates.JobId = this.inputvalues.jobID;
    } else {
      this.benchCandidates.JobId = 0;
    }


    if (!isNullOrUndefined(this.benchCandidates.WorkStatusExpiry)) {
      let expectDate: any = new Date(this.benchCandidates.WorkStatusExpiry).toDateString();
      this.benchCandidates.WorkStatusExpiry = new Date(expectDate);
    }

    this.benchCandidates.CompanyId = this.loginUser.Company.Id;
    this.benchCandidates.CreatedBy = this.loginUser.UserId;
    this.benchCandidates.BenchCandidate = false;
    this.benchCandidates.UpdatedBy = this.loginUser.UserId;
    this.benchCandidates.Module = 2; //jobcentral;
    this.benchCandidates.WorkStatusExpiry = null;
    this.benchCandidates.CreatedDate = new Date();;
    this.benchCandidates.ApplicantId = 0;
    this.benchCandidates.IsTransferApplicantNotes = false;
    this.benchCandidates.IsFromInbox = false;
    this.benchCandidates.Email = this.benchCandidates.CandidateEmail;


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

    this._service.SaveCandidate(this.benchCandidates)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success("Candidate has been added");
            this.loading = false;
            this.dialogRef.close(true);
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

  getBenchSubUsers() {
    this.assignees = [];
    this._service.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {
          this.benchSubUsers = response;
          var salesTeam = response.filter(item => item.IsActive == true);
          merge(salesTeam)
            .pipe(distinct((x) => x.UserId))
            .subscribe(y => {
              this.assignees.push({ name: y.FullName, value: y.UserId, email: y.PrimaryEmail,mapping:false });
              this.Allassignees.push(y.FullName);
            });
        },
        error => {
          this._alertService.error(error);
        });
  }

  async CheckCandidateByEmail() {
    if (!isNullOrUndefined(this.benchCandidates.CandidateEmail)) {
      let title = null;
      let message = null;
      const CandidateSearchVM = {
        CandidateId: this.benchCandidates.CandidateID,
        Email: this.benchCandidates.CandidateEmail.trim(),
        CompanyId: this.loginUser.Company.Id
      }
      this.existingCandidate = new CandidateMaster();
      let response = await this._service.SyncCheckCandidateByEmail(CandidateSearchVM);
      if (response.IsError == false) {
        this.existingCandidate = response.Data;
        if (this.existingCandidate.CandidateID > 0) {
          title = 'Candidate Exists!';
          message = '<p>Candidate with email <b><span class="displayEmail">' + this.existingCandidate.CandidateEmail + '</span></b> already exists in the system.</p>'

          const dialogRef = this.dialog.open(ConfirmDialogExistsComponent, {
            width: '60%', panelClass: "dialog-class",
            data: { title: title, message: message },
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.benchCandidates.CandidateEmail = null;
          });
          if (!this.cdRef["distroyed"]) {
            this.cdRef.detectChanges();
          }
        }
      }
      else {
        this._alertService.error(response.ErrorMessage);
        return false;
      }
    }
  }

  HashTagschangeSelected(parameter: string, query: string) {
    const index = this.selectedHashTagChips.indexOf(query);
    if (index >= 0) {
      this.selectedHashTagChips.splice(index, 1);
    } else {
      this.selectedHashTagChips.push(query);
    }

  }

  GetCandSubVendorData(event) {
    this.cansubVClientAccount = event;
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

  downloadResume() {

  }

  clearFields() {
    this.benchCandidates = new CandidateMaster();
    this.addForm.markAsPristine();

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  contentLoaded() {
    this.fileUploadLoading=false;
    //document.getElementById("progressBar").style.display = "none";
  }

  onTabChanged(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.isSummary = true;
      this.isnotes = false;
    } else if (event.index === 1) {
      this.isSummary = false;
      this.isnotes = true;
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  onChildFormValidityChanged(validity: boolean) {
    this.c2cFormValid = validity;
  }

  GetTechRating(event){
    this.benchCandidates.TechnicalSkillRating = event.toString();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  GetCommRating(event){
    this.benchCandidates.CommunicationSkillRating = event.toString();
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  onEmploymentTypeChange(ob) {
    if(ob.value=='W2')
      this.c2cFormValid = true;
    else
      this.c2cFormValid = false;
  }

  GetSelectedSkills(event) {
    this.SelectedKwywods = event;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  clearDocument() {
    this.benchCandidates.ViewResumeInnerPath = null;
    this.cdRef.detectChanges();
  }

  
}
