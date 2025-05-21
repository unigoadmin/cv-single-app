import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadResponse,LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService } from 'src/@shared/services';
import { BenchCandidateService } from '../../bench-candidates/bench-candidates.service';
import { MarketingDashboardService } from '../../core/http/marketingdashboard.service';
import { AccountTypes } from 'src/static-data/accounttypes';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ValidationService } from 'src/@cv/services/validation.service';
import { Subject } from 'rxjs';
import { SelectItem } from '../../core/models/selectitem';
import { ResumeSource } from '../../core/models/resumesource';
import { MatSelectChange } from '@angular/material/select';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { UntilDestroy } from '@ngneat/until-destroy';
import moment from 'moment';
import { CandidateReferences } from '../../core/models/candidaterefences'; 
import { AccountTypeNameEnum, AccountTypesEnum, UserModules } from 'src/@cv/models/accounttypeenum';
import { CandidateAccount } from '../../core/models/candidateaccount';
import { CandidateMaster } from '../../core/models/candidatemaster';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import * as FileSaver from 'file-saver';
import { TcCandidateAssignComponent } from '../candidate-assign/candidate-assign.component';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { IconService } from 'src/@shared/services/icon.service';  
import { CandidateShareComponent } from '../candidate-share/candidate-share.component';
import { CandidateReviewComponent } from '../candidate-review/candidate-review.component';
import { assign } from 'src/@shared/models/assign';
import { CandidateAssigneMapping } from '../../core/models/candidateassigneemapping';
import { CandidateService } from '../../core/http/candidates.service';
import { QuickSubmitComponent } from '../../bench-candidates/quick-submit/quick-submit.component';
import { ConfirmDialogNotesComponent } from 'src/@shared/components/filter-components/confirm-dialog-notes/confirm-dialog-notes.component';
import { CandidateAssignBenchComponent } from '../candidate-assign-bench/candidate-assign-bench.component';
import { CandidateStatus } from 'src/@shared/models/candidatestatus.model';
import { WorkStatusService } from 'src/@shared/http/work-status.service';

@UntilDestroy()
@Component({
  selector: 'cv-tc-candidate-details',
  templateUrl: './tc-candidate-details.component.html',
  styleUrls: ['./tc-candidate-details.component.scss'],
  animations: [
    fadeInUp400ms,
  ],
  providers: [BenchCandidateService, AccountTypes]
})
export class TcCandidateDetailsComponent implements OnInit  {

  ActionMode: string = null;
  title = "Add Candidate";
  loginUser: LoginUser;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  benchCandidates: CandidateMaster = new CandidateMaster();
  uploaderDropZoneOver: boolean = false;
  candidateForm: FormGroup;
  benchForm : FormGroup;
  SelectedKwywods: string[] = [];
  isFileUploaded: boolean = true;
  workStatuFields: SelectItem[] = [];
  CandidateStatus: SelectItem[] = [];
  resumeSource: ResumeSource[];
  loading: boolean = false;
  SelectedAssigness: assign[] = [];
  isBenchFormVisible = false;
  isCandidateLoaded:boolean=false;
  selectedHashTagChips: any[] = [];

  fileUploadLoading: boolean = false;
  fileUploadResponse: FileUploadResponse;
  unsubscribe$: Subject<void> = new Subject<void>();

  enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  enumAccountTypeName: typeof AccountTypeNameEnum = AccountTypeNameEnum;
  cansubVClientAccount: CandidateAccount = new CandidateAccount();
  c2cFromGroup: FormGroup;
  c2creference: CandidateReferences = new CandidateReferences();
  DialogResponse: ConfirmDialogModelResponse;
  datemask = [/\d/, /\d/, '/', /\d/, /\d/];
  isSummary: boolean = false;
  isnotes: boolean = false;
  IsNotesTabVisible:boolean=false;
  IsPageDirty:boolean=false;
  c2cFormValid:boolean=true;
  IsLocation: boolean = false;
  dbHashTags:string;
  currentModule:string;
  isFormControlsInitialized = false;
  existingAssigness:any[] = [];
  candidatesMapping: CandidateAssigneMapping[] = [];
  resetUsersChip:boolean=false;
  resetHashTags:boolean=false;
  CandidateStausList: CandidateStatus[];
  IsEmailDisabled:boolean=false;
  constructor(@Inject(MAT_DIALOG_DATA) public inputValues: any,
    private dialogRef: MatDialogRef<TcCandidateDetailsComponent>,
    private fb: FormBuilder,
    private _canservice: CandidateService,
    private _service: BenchCandidateService,
    private _mrktService: MarketingDashboardService,
    private cd: ChangeDetectorRef, 
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private accountTypes: AccountTypes,
    private _eventemtterservice: EventEmitterService,
    public iconService: IconService,
    private dialog: MatDialog,
    private workStatusService: WorkStatusService) {
    this.candidateForm = this.fb.group({
      firstName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      lastName: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      phone: [null, [Validators.required,ValidationService.phonenumValidator]],
      email: [{ value: null, disabled: this.IsEmailDisabled }, [Validators.required, Validators.email]], 
      location: [null],
      wexperience: [null],
      skills: [null],
      tags: [null],
      wpermit: [null],
      wpermitexpiration: [null],
      cansource: [null],
      PayRate: [null,[ValidationService.numberValidator]],
      assignees: [null],
      benchpriority: [null],
      Certifications: [null],
      LinkedIn: [null,[ValidationService.LinkedIn_urlValidator]],
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
    this.benchForm = this.fb.group({
      sellrate: [null],
      benchpriority: [null],
      assignees: [null],
    });
    
    this.CandidateStatus = this.accountTypes.CandidateStatus;
    this.resumeSource = [];
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.currentModule=UserModules.TalentCentral;
      this.isBenchFormVisible = this.inputValues.IsBench;
      this.getResumeSourceByCompany();
      this.isSummary = true;
      this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id).subscribe(data => {debugger;
        this.workStatuFields = data;
      });
      if(this.inputValues.mode=='Edit'){
        this.IsNotesTabVisible=true;
        this.getCandidate(this.inputValues.candidateId);
      }
      else{
        this.IsNotesTabVisible=false;
        this.benchCandidates=new CandidateMaster();
        this.IsEmailDisabled = false;
        this.candidateForm.get('email').enable();
        this.UpdateBenchFormControls();
      }
      if (!this.cd["distroyed"]) {
        this.cd.detectChanges();
      }
    }
    
  }

  UpdateBenchFormControls() {

    if (this.isBenchFormVisible) {
      this.benchForm.get('sellrate').setValidators([Validators.required, ValidationService.numberValidator]);
      this.benchForm.controls['sellrate'].updateValueAndValidity();
      this.benchForm.get('benchpriority').setValidators([Validators.required]);
      this.benchForm.controls['benchpriority'].updateValueAndValidity();
    }
    this.cd.detectChanges();
  }

  getCandidate(CandidateId: number) {
    this._mrktService.GetBenchCandidateForEdit(CandidateId, this.loginUser.Company.Id)
      .subscribe(response => {
        if (response.IsError == false) {
          this.benchCandidates = response.Data;
          this.benchCandidates.Email = this.benchCandidates.CandidateEmail;
          this.benchCandidates.PayRate = this.benchCandidates.PayRate == undefined ? "0" : this.benchCandidates.PayRate.toString();
          
          if (this.benchCandidates.Skillset) {
            this.SelectedKwywods = this.benchCandidates.Skillset.split(",");
          }
          else {
            this.SelectedKwywods = [];
          }

          if (this.benchCandidates.HashTags) {
            this.dbHashTags = this.benchCandidates.HashTags;
            this.selectedHashTagChips = this.dbHashTags.split(',').map(Number);
          }
          else
            this.dbHashTags = null;

          if(this.benchCandidates.AssigneeList.length > 0){
            this.existingAssigness = this.benchCandidates.AssigneeList.map(x=>x.UserId);
          }
          else{
            this.existingAssigness = [];
          } 

          if(this.benchCandidates.AccountMasters && this.benchCandidates.AccountMasters.length>0){
           this.benchCandidates.AccountMasters.forEach(element =>{
            const acntTypeName = this.getAccounttypeName(element.AccountTypeID);
            const prepaedAccount = this.prepareAccount(element.AccountTypeID, element);
            this.cansubVClientAccount = prepaedAccount;
           })
          }
          else{
            this.benchCandidates.AccountMasters = [];
          }
           
          this.candidateForm.markAsPristine();
          this.benchForm.markAsPristine();
          this.IsEmailDisabled = true;
          this.candidateForm.get('email').disable();
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
  
  getResumeSourceByCompany() {
    this._service.getResumeSourceByCompany(this.loginUser.Company.Id)
      .subscribe(
        resumeSource => {
          this.resumeSource = resumeSource;
          this.getCandiateStatusLabels();
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
  
  UpdateCandidate() {
    let currentDate: any = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
    this.loading = true;
    this.benchCandidates.AccountMasters = [];

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

    if (this.SelectedKwywods && this.SelectedKwywods.length > 0)
      this.benchCandidates.Skillset = this.SelectedKwywods.join(",");

    if (this.SelectedAssigness && this.SelectedAssigness.length > 0) {
        
      this.SelectedAssigness.forEach(x => {
        const assign = {
          Id: 0,
          BenchCandidateId: this.benchCandidates.CandidateID,
          AssignId: x.value,
          MappingStatus: x.mapping,
          CreatedDate: new Date,
          UpdatedDate: new Date
        }
        this.candidatesMapping.push(assign);
      });
        
        this.benchCandidates.CandidatesMapping = this.candidatesMapping;
      }  


    if (!isNullOrUndefined(this.benchCandidates.WorkStatusExpiry)) {
        let EndDate: any = moment(this.benchCandidates.WorkStatusExpiry).format("YYYY-MM-DDTHH:mm:ss.ms")
        this.benchCandidates.WorkStatusExpiry = EndDate;
    }
    else{
      this.benchCandidates.WorkStatusExpiry = null;
    }  
    this.benchCandidates.CompanyId = this.loginUser.Company.Id;
    this.benchCandidates.UpdatedBy = this.loginUser.UserId;
    
    this.benchCandidates.ApplicantId = 0;
    this.benchCandidates.IsTransferApplicantNotes=false;
    this.benchCandidates.IsFromInbox=false;
    this.benchCandidates.Module=null;
    this.benchCandidates.BenchCandidate = this.isBenchFormVisible;
    this.benchCandidates.Status = this.isBenchFormVisible ? 10 : 1;
    if(this.inputValues.mode == 'Edit'){
      this.benchCandidates.Email = this.benchCandidates.CandidateEmail;
      this.benchCandidates.UpdatedBy = this.loginUser.UserId;
    }
    else{
      this.benchCandidates.CreatedBy = this.loginUser.UserId;
      if (this.SelectedAssigness && this.SelectedAssigness.length == 0){
        this.benchCandidates.CreatedDate = new Date();
        const assign = {
          Id: 0,
          BenchCandidateId: 0,
          AssignId: this.loginUser.UserId,
          MappingStatus: true,
          CreatedDate: new Date,
          UpdatedDate: new Date
        }
        this.candidatesMapping.push(assign);
        this.benchCandidates.CandidatesMapping = this.candidatesMapping;
      }
      
    }
   
    this._mrktService.SaveCandidate(this.benchCandidates)
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
    this.benchCandidates.StatusName = selectedStatus.StatusName;
    this.benchCandidates.Status = selectedStatus.StatusId;
    this,this.benchCandidates.bgClass = selectedStatus.bgclass;

    var selectedStatus = change.value;
    const Pcandidate = {
      CandidateId: this.benchCandidates.CandidateID,
      CompanyId: this.loginUser.Company.Id,
      CandidateStatus: selectedStatus.StatusId,
      UpdatedBy: this.loginUser.UserId,
      CandidateAction:'CandidateStatus'
    };
    this._canservice.UpdateCandidateStatus(Pcandidate)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );

      if (!this.cd["distroyed"]) {
        this.cd.detectChanges();
      }
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

  GetCandSubVendorData(event) {debugger;
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
    Account.Employer = acunt.Employer;
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

  downloadResume() {
    if (this.benchCandidates.ResumePathKey) {
      const FileInfo = {
        FileName: this.benchCandidates.UploadedFileName,
        FilePathkey: this.benchCandidates.ResumePathKey,
        CompanyId: this.loginUser.Company.Id,
        FilePathBucket: this.benchCandidates.ResumePathBucket
      }
      this._canservice.downloadAttachment(FileInfo)
        .subscribe(response => {
          let filename = this.benchCandidates.UploadedFileName;
          FileSaver.saveAs(response, filename);
        }),
        error => {
          this._alertService.error("Error while downloading the file.");
        }
    }
    else {
      this._alertService.error("Resume is  not available for this candidate.");
    }
  }

  contentLoaded() {
    this.fileUploadLoading=false;
  }

  ShareCandidate() {
    this.dialog.open(CandidateShareComponent, {
      data: { headerText: 'Share Candidate', candidateId: this.benchCandidates.CandidateID, inputsrc: 'candidates' }, width: '60%', height: '65vh',disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
      }
    });
  }

  AssignRecruiter(){
    this.dialog.open(TcCandidateAssignComponent, {
      data: {headerText: 'Assign Recruiter', candidateId: this.benchCandidates.CandidateID, inputsrc: 'candidates',ctrlLabel:'Select Recruiter' }, width: '60%', height: '65vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
      }
    });
  }

  AssignManager(){
    this.dialog.open(CandidateReviewComponent, {
      data: { headerText: 'Send For Review', candidateId: this.benchCandidates.CandidateID, inputsrc: 'candidates' }, maxWidth: '85vw', width: '85vw', height: '80vh', disableClose: true
    }).afterClosed().subscribe(response => {

      if (response) {
      }
    });
  }

  AssignForTechScreen(){
      const message = 'Candidate <b><span class="displayEmail"> ' + this.benchCandidates.FirstName + ' ' + this.benchCandidates.LastName + ' </span></b> status will be changed to Under Tech Screen ?'
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
            CandidateID: this.benchCandidates.CandidateID,
            CompanyId: this.loginUser.Company.Id,
            UpdatedBy: this.loginUser.UserId,
            CandidateStatus: 4, //Tech-screen
            IsUnderTechScreen:true,
            CandidateAction:'TechScreen'
          };
          this.UpdateCandidateStatus(Psubmission);
        }
      });
  }

  AssignForMarketing(){
      const message = 'Candidate <b><span class="displayEmail"> ' + this.benchCandidates.FirstName + ' ' + this.benchCandidates.LastName + ' </span></b> status will be changed to Marketing ?'
      const dialogData = new ConfirmDialogModel("Marketing", message);
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        width: '60%',
        data: dialogData,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.DialogResponse = dialogResult;
        if (this.DialogResponse.Dialogaction == true) {
          const Psubmission = {
            CandidateID: this.benchCandidates.CandidateID,
            CompanyId: this.loginUser.Company.Id,
            UpdatedBy: this.loginUser.UserId,
            IsMarketing:true,
            CandidateStatus: 5, //Marketing
            CandidateAction:'Marketing'
          };
          this.UpdateCandidateStatus(Psubmission);
        }
      });
    
  }

  UpdateCandidateStatus(ResponseStaus:any) {
    this._canservice.UpdateCandidateStatus(ResponseStaus)
      .subscribe(
        response => {
          if (response.IsError == false) {
            this._alertService.success(response.SuccessMessage);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
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

  OnCofirmCandidateDelete(candidate: CandidateMaster) {
    const candidateVM = {
      CandidateId: candidate.CandidateID,
      CompanyId: this.loginUser.Company.Id,
      UpdatedBy: this.loginUser.UserId
    }
    this._mrktService.DeleteCandidate(candidateVM).subscribe(result => {
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
    this.existingAssigness=[];
    this.SelectedKwywods=[];
    this.resetUsersChip=true;
    this.resetHashTags=true;
    this.dbHashTags=null;
    this.selectedHashTagChips=[];
    this.SelectedAssigness=[];
    this.c2creference = new CandidateReferences();
    this.candidateForm.markAsPristine();

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

  GetSelectedSkills(event) {
    this.SelectedKwywods = event;
    this.IsPageDirty=true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  GetSelectedHashTags(event) {
    this.selectedHashTagChips = event;
    this.IsPageDirty = true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  GetSelectedAssignees(event) {
    this.SelectedAssigness = event;
    this.IsPageDirty = true;
    if (!this.cd["distroyed"]) {
      this.cd.detectChanges();
    }
  }

  clearDocument() {
    this.benchCandidates.ViewResumeInnerPath = null;
    this.cd.detectChanges();
  }

  findInvalidControls() {
    console.log('BenchForm-' +this.benchForm.valid);
    console.log('candidateForm-' +this.candidateForm.valid);
    console.log('c2cFormValid-' +this.c2cFormValid);
    console.log('candidateForm dirty-' +this.candidateForm.dirty);
    console.log('BenchForm dirty-' +this.benchForm.dirty);
    console.log('IsPageDirty-' +this.IsPageDirty);
    const invalid = [];
    const controls = this.candidateForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }

    console.log(invalid);
  
    return invalid;
  }

  RemoveBenchConfirmation() {
    const message = 'Candidate  <b><span class="displayEmail"> ' + this.benchCandidates.FirstName + ' ' + this.benchCandidates.LastName + ' </span></b> will be deleted from bench ?'
    const dialogData = new ConfirmDialogModel("Remove Bench", message);
    const dialogRef = this.dialog.open(ConfirmDialogNotesComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.OnRemoveBench(this.benchCandidates,this.DialogResponse.Notes);
      }
    });
  }

  OnRemoveBench(candidate: CandidateMaster,Notes:string) {
    if (this.benchCandidates.CandidateID) {
      const BenchCandidates = {
        CandidateId: candidate.CandidateID,
        Benchpriority: null,
        Assigness: null,
        UpdatedBy: this.loginUser.UserId,
        CompanyId: this.loginUser.Company.Id,
        Notes:Notes,
        StatusId:11
      }
      this._canservice.RemoveFromBench(BenchCandidates).subscribe(result => {
        if (result.IsError == false) {
          this.benchCandidates.BenchCandidate = false;
          this._alertService.success(result.SuccessMessage);
        }
        else {
          this._alertService.error(result.ErrorMessage);
        }

      });
    }
  }

  OnOpenQuickSubmit() {
    if (this.inputValues.candidateId && this.inputValues.candidateId > 0) {
      this.dialog.open(QuickSubmitComponent, {
        data: { candidateId: this.inputValues.candidateId, submissionId: 0, srcmode: 'new' }, width: '80%', disableClose: true
      }).afterClosed().subscribe(response => {

        if (response) {

        }
      });
    }

  }

  AssignSalesRep() {
    this.dialog.open(CandidateAssignBenchComponent, {
      data: { headerText: 'Move to Bench', candidateId: this.benchCandidates.CandidateID, inputsrc: 'candidates', ctrlLabel: 'Select Sales Rep(s)' }, width: '60%', height: '60vh'
    }).afterClosed().subscribe(response => {
      if (response) {

      }
    });
  }

  getCandiateStatusLabels() {
    this._canservice.fetchCandidateStatus(this.loginUser.Company.Id)
      .subscribe(response => {
        this.CandidateStausList = response.Data;
      });
  }

  

}



