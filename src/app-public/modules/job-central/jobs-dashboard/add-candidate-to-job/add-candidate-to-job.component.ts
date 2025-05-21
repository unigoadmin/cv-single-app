import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginUser } from 'src/@shared/models';
import { AuthenticationService, AlertService, TimeZoneService } from 'src/@shared/services';
import icClose from '@iconify/icons-ic/twotone-close';
import icSearch from '@iconify/icons-ic/twotone-search';
import iclocationon from '@iconify/icons-ic/location-on';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CandidateService } from 'src/@shared/core/ats/http/candidates.service';
import { BenchCandidateSearch } from 'src/@shared/core/ats/models/benchcandidatesearch';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TableColumn } from 'src/@cv/interfaces/table-column.interface';
import { MatStepper } from '@angular/material/stepper';
import { ProcessMenuService } from 'src/@cv/services/processmenu.service';
import { EmployerProfile } from '../../core/model/employerprofile';
import { JobCentralService } from '../../core/http/job-central.service';
import { JobMapping } from '../../core/model/jobmapping';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { JobboardResponses } from '../../core/model/jobboardresponses';
import { HashTag } from 'src/@shared/models/hashtags';
import { RequisitionService } from '../../core/http/requisitions.service';
import { ValidationService } from 'src/@cv/services/validation.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { Observable, ReplaySubject } from 'rxjs';
import { CandidateAccount } from 'src/@shared/core/ats/models/candidateaccount';
import { ApplicantReferences } from '../../core/model/applicantrefences';
import { AccountTypesEnum, UserModules } from 'src/@cv/models/accounttypeenum';
import { AccountTypes } from 'src/static-data/accounttypes';
import { isNullOrUndefined } from 'src/@shared/services/helpers';

@Component({
  selector: 'cv-add-candidate-to-job',
  templateUrl: './add-candidate-to-job.component.html',
  styleUrls: ['./add-candidate-to-job.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AccountTypes,AuthenticationService, CandidateService, TimeZoneService, ProcessMenuService, JobCentralService]
})
export class AddCandidateToJobComponent implements OnInit {
  icClose = icClose;
  icSearch = icSearch;
  iclocationon = iclocationon;
  loginUser: LoginUser;
  searchtext: FormControl = new FormControl('');
  public TerminateEmployeeFormGroup: FormGroup;
  searchCtrl = new FormControl();
  displayedColumns: string[] = ['Source', 'JobTitle', 'FirstName', 'LastName', 'ApplicantLocation', 'WorkPermit'];
  employeeSearch: string;
  isLoading: boolean = false;
  candidates: JobboardResponses[] = [];
  selectedCandidates: JobboardResponses = new JobboardResponses();
  subject$: ReplaySubject<JobboardResponses[]> = new ReplaySubject<JobboardResponses[]>(1);
  data$: Observable<JobboardResponses[]> = this.subject$.asObservable();
  selection = new SelectionModel<JobboardResponses>(true, []);
  public candidateFilters: BenchCandidateSearch = new BenchCandidateSearch();
  Assignies: string[] = [];
  public employerProfile: EmployerProfile[] = [];
  jobmapping: JobMapping = new JobMapping();
  hashtags: HashTag[];
  AllHashTags: string[] = [];
  selectedHashTagChips: any[] = [];
  SelectedHashTags: any;
  inputsrc: string;
  SubmittedRate: number;
  SelectedKwywods: string[] = [];
  cansubVClientAccount: CandidateAccount = new CandidateAccount();
  c2creference: ApplicantReferences = new ApplicantReferences();
  applicantsRefrences: ApplicantReferences[] = [];
  enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  subinfoForm: FormGroup;
  c2cFormValid: boolean = true;
  IsPageDirty:boolean=false;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource = new MatTableDataSource(this.candidates);
  @ViewChild(MatSort) sort: MatSort;
  paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }


  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<AddCandidateToJobComponent>,
    private fb: FormBuilder,
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private _alertService: AlertService,
    private service: CandidateService,
    private processmenu: ProcessMenuService,
    private jobService: JobCentralService,
    private reqService: RequisitionService,
    private accountTypes: AccountTypes,
  ) {
    this.subinfoForm = this.fb.group({
      SubmissionRate: [null, [Validators.required, ValidationService.numberWithDecimalValidator]]
    })
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      if (this.Data.jobID == 0 && this.Data.RequisitionId != 0) {
        this.inputsrc = "Requsition";
      }
      else if (this.Data.jobID != 0 && this.Data.RequisitionId == 0) {
        this.inputsrc = "Job";
      }
      this.getUsers();
      this.GetHashtags();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  GetHashtags() {
    this.jobService.getCRMHashTag(this.loginUser.Company.Id, 'ATS', 2)
      .subscribe(
        hashtags => {
          this.hashtags = hashtags;
          this.hashtags.forEach(item => {
            this.AllHashTags.push(item.HashTagText);
          });
        },
        error => this._alertService.error(error));
  }
  getUsers() {
    let ModuleId = UserModules['JobCentral'];
    this.processmenu.getInternalUsersByModuleId(this.loginUser.Company.Id,ModuleId).subscribe(response => {
      this.employerProfile = response;
    }, error => {
      this._alertService.error(error);
    });
  }
  GetSearchedApplicants() {
    if (this.searchCtrl.value != null && this.searchCtrl.value != "") {
      const appFilter = {
        companyId: this.loginUser.Company.Id,
        SearchText: this.searchCtrl.value
      }
      this.isLoading = true;
      
      this.jobService.SearchForApplicants(appFilter).subscribe(response => {
        if (response.IsError) {
          this._alertService.error(response.ErrorMessage);
        } else {
          if (response.Data && response.Data.length > 0) {
            this.candidates = response.Data;
            this.dataSource.data = this.candidates;
          }
        }
        this.isLoading = false;
        if (!this.cdr["destryoed"]) {
          this.cdr.detectChanges();
        }
      }, error => {
        this._alertService.error(error);
        this.isLoading = false;
        if (!this.cdr["destryoed"]) {
          this.cdr.detectChanges();
        }
      })
    }
  }
  onResetClick() {
    this.candidates = [];
    this.dataSource = new MatTableDataSource(this.candidates)
    this.searchCtrl.reset();
    if (!this.cdr["destryoed"]) {
      this.cdr.detectChanges();
    }
  }
  ApplicantJobMaping() {
    const JobAPPMapping = {
      ApplicantId: this.selectedCandidates.ResponseId,
      JobId: this.Data.jobID,
      MappingStatus: true,
      CreatedBy: this.loginUser.UserId,
      CompanyId: this.loginUser.Company.Id
    }

    this.jobService.ApplicantJobMaping(JobAPPMapping).subscribe(response => {
      if (!response.IsError) {
        this._alertService.success("Applicat mapped to job successfully");
        this.dialogRef.close(true);
      }

    }, error => {
      this._alertService.error(error);
    })
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }
  NextClick(stepper: MatStepper, selectedcandidate) {
    this.selectedCandidates = this.deepCopy(selectedcandidate);
    this.GetApplicantDetails(this.selectedCandidates.CompanyId, this.selectedCandidates.ResponseId);
    
    stepper.next();
  }
  private deepCopy(data) {
    return JSON.parse(JSON.stringify(data))
  }

  GetApplicantDetails(companyId: number, applicantId: number) {
    this.jobService.ViewResponseDetails(companyId, applicantId).subscribe(result => {
      if (result.IsError) {
        this._alertService.error(result.ErrorMessage);
      } else {
        this.selectedCandidates = result.Data;

        if (this.selectedCandidates.HashTags) {
          let ids: string[] = this.selectedCandidates.HashTags.split(',');
          ids.forEach(element => {
            let hastagitem = this.hashtags.find(x => x.HashTagId == Number(element));
            hastagitem.state = true;
            this.selectedHashTagChips.push(hastagitem.HashTagText);
          });
        }
        else
          this.selectedHashTagChips = [];

        if (this.selectedCandidates.Skillset) {
          this.SelectedKwywods = this.selectedCandidates.Skillset.split(",");
        }
        else {
          this.SelectedKwywods = [];
        }

        if (this.selectedCandidates.EmploymentType == "W2") {
          this.c2cFormValid = true;
        }

        if (this.selectedCandidates.ApplicantRefereces.length > 0) {
          this.selectedCandidates.ApplicantRefereces.forEach(item => {
            if (item.RefType == "C2C") {
              this.cansubVClientAccount = this.PrepareAccountFromRefrence(item);
              this.c2creference = item;
            }
          })
        }
      }
      if (!this.cdr["distroyed"]) {
        this.cdr.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
    });
  }

  ViewClose() {
    this.dialogRef.close(false);
  }

  SubmitApplicant() {
    //clear the list before proceeding..
    this.applicantsRefrences = [];
    if (this.selectedCandidates.EmploymentType == "C2C") {
      if (this.cansubVClientAccount.AccountID > 0) {
        this.cansubVClientAccount.MappingStatus = true;
        this.cansubVClientAccount.CompanyID = this.loginUser.Company.Id;
        const account = this.DeepCopyForObject(this.cansubVClientAccount);
        const c2creference = this.DeepCopyForObject(this.c2creference);
        c2creference.ApplicantId = this.selectedCandidates.ResponseId;
        c2creference.RefType = "C2C";
        c2creference.Company = account.AccountName;
        c2creference.FirstName = account.SalesPOC.FirstName;
        c2creference.LastName = account.SalesPOC.LastName;
        c2creference.Email = account.SalesPOC.Email;
        c2creference.PhoneNumber = account.SalesPOC.Phonenumber;
        c2creference.AccountId = account.AccountID;
        c2creference.ContactId = account.SalesPOC.ContactID;
        this.applicantsRefrences.push(c2creference);

      } else if (this.cansubVClientAccount.AccountID == 0 && !isNullOrUndefined(this.cansubVClientAccount.AccountName) && this.cansubVClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.SubVendor, this.cansubVClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        const c2creference = this.DeepCopyForObject(this.c2creference);
        c2creference.ApplicantId = this.selectedCandidates.ResponseId;
        c2creference.RefType = "C2C";
        c2creference.Company = account.AccountName;
        c2creference.FirstName = account.SalesPOC.FirstName;
        c2creference.LastName = account.SalesPOC.LastName;
        c2creference.Email = account.SalesPOC.Email;
        c2creference.PhoneNumber = account.SalesPOC.Phonenumber;
        c2creference.AccountId = account.AccountID;
        c2creference.ContactId = account.SalesPOC.ContactID;
        this.applicantsRefrences.push(c2creference);

      }
    }
    const Submission = {
      ApplicantId: this.selectedCandidates.ResponseId,
      RequsitionId: this.Data.RequisitionId,
      MappingStatus: true,
      BillRate: this.SubmittedRate,
      SubmissionStatus: 1,
      SubmittedBy: this.loginUser.UserId,
      CompanyId: this.loginUser.Company.Id,
      ApplicantRefereces:this.applicantsRefrences
    }

    this.reqService.ApplicantSubmission(Submission).subscribe(response => {
      if (!response.IsError) {
        this._alertService.success(response.SuccessMessage);
        this.dialogRef.close(true);
      }

    }, error => {
      this._alertService.error(error);
    })
  }

  GetCandSubVendorData(event) {
    this.cansubVClientAccount = event;
    this.IsPageDirty = true;
  }

  onChildFormValidityChanged(validity: boolean) {
    this.c2cFormValid = validity;
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
    Account.SalesPOC.ContactID = c2cref.ContactId;
    return Account;
  }

  DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }

}
