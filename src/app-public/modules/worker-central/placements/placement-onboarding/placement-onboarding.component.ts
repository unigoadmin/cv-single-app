import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Inject } from '@angular/core';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { PlacementService } from '../../core/http/placement.service';
import { AccountTypes } from 'src/static-data/accounttypes';
import { AccountMaster } from 'src/@shared/core/ats/models/accountmaster';
import { PlacementAccountMappings, PlacementAcctContactInfo } from '../../core/models/placement';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { AccountTypeNameEnum, AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { ValidationService } from 'src/@cv/services/validation.service';
import { EmployerProfile } from '../../core/models/employerprofile';
import { PlacementOnBoarding } from '../../core/models/placement-onboarding';
import { EmployeeDocuments } from '../../core/models/employeedocuments';
import { PlacementDocuments } from '../../core/models/placementdocuments';
import { InvoiceCycle } from '../../core/models/onboardingEnum';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { FileStoreService } from 'src/@shared/services/file-store.service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocViewerComponent } from '../doc-viewer/doc-viewer.component';
import { EmployeeMaster } from '../../core/models/employeemaster';
import { AssignmentMaster } from '../../core/models/assignmentmaster';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import moment from 'moment';
import { MatSelectChange } from '@angular/material/select';
import { ConfirmDialogModel, ConfirmDialogModelResponse } from 'src/@shared/models/confirmdialogmodel';
import { MatStepper } from '@angular/material/stepper';
import { WorkerExistsComponent } from '../worker-exists/worker-exists.component';
import { PlacementOnBoardingResult } from '../../core/models/placementonbaordingresult';
import { PlcOnboardingConfirmationComponent } from '../plc-onboarding-confirmation/plc-onboarding-confirmation.component';
import { ConsultviteUser } from 'src/@shared/core/admin/models/consultvite-user';
import { UsersEditComponent } from 'src/app-public/modules/admin/users/users-edit/users-edit.component';
import { ConfirmDeleteDialogComponent } from 'src/@shared/components/filter-components/confirm-delete-dialog/confirm-delete-dialog.component';
import { IconService } from 'src/@shared/services/icon.service';
import { EndClientInternalComponent } from 'src/@shared/components/vendor-layers/end-client-internal/end-client-internal.component';
import { WorkStatusService } from 'src/@shared/http/work-status.service';


@Component({
  selector: 'cv-placement-onboarding',
  templateUrl: './placement-onboarding.component.html',
  styleUrls: ['./placement-onboarding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [AccountTypes, PlacementService, InvoiceCycle, FileStoreService]
})
export class PlacementOnboardingComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'type', 'actions'];
  empdisplayedColumns: string[] = ['position', 'name', 'type', 'actions'];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  public confirmationFormGroup: FormGroup;
  public bilingFormGroup: FormGroup;
  form: FormGroup;
  directinternaltType: boolean = false;
  contractC2CType: boolean = true;

  isPrimeVendor: boolean = false;
  isManagedServiceProvider: boolean = false;
  isImplementationPartner: boolean = false;
  isSubPrimeVendor: boolean = false;
  isReffralVendor: boolean = false;

  isbillingEndClient: boolean = false;
  isbillingPrimeVendor: boolean = false;
  isbillingManagedServiceProvider: boolean = false;
  isbillingImplementationPartner: boolean = false;
  isbillingSubPrimeVendor: boolean = false;
  isbillingReffralVendor: boolean = false;
  isPlacementSelected: boolean = true;
  isdocloading: boolean = false;
  isempDocumentType: boolean = true;
  isempdocloading: boolean = false;
  isCandidateSubVendor: boolean = false;
  isCandidateReferalVendor: boolean = false;
  isC2CEmployer: boolean = false;
  isActionCreateConsultant: boolean = false;

  public downlaodablesUploader: FileUploader = new FileUploader({ url: this.fileStoreService.getWebAPIUploadUrl() });
  public Employeedownlaodables: FileUploader = new FileUploader({ url: this.fileStoreService.getWebAPIEmployeeUploadUrl() });

  public enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  public enumAccountTypeName: typeof AccountTypeNameEnum = AccountTypeNameEnum;
  public thirdTypeList: SelectItem[] = [];
  loginUser: LoginUser;
  public manageEmployerProfile: EmployerProfile[] = [];
  public financeEmployerProfile: EmployerProfile[] = [];
  public trainingEmployerProfile: EmployerProfile[] = [];
  placementOnBoarding: PlacementOnBoarding = new PlacementOnBoarding();
  InitialPlaceentOnBoardig: PlacementOnBoarding = new PlacementOnBoarding();
  public placementDocuments: PlacementDocuments[] = [];
  public employeeDocuments: EmployeeDocuments[] = [];
  public selectedplacementDoc: PlacementDocuments = new PlacementDocuments();
  public selectedEmployeeDoc: EmployeeDocuments = new EmployeeDocuments();
  public endClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public primeVClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public mspClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public ipClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public subPVClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public refClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public billingAccountContactInfo: PlacementAccountMappings = new PlacementAccountMappings();
  public immigraAccountContactInfo: PlacementAccountMappings = new PlacementAccountMappings();
  public candSubVendorClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public candReferralClientAccount: PlacementAccountMappings = new PlacementAccountMappings();

  public employerProfile: EmployerProfile[] = [];
  public workStatusFields: SelectItem[] = [];
  public status_bgClass: any = 'bg-amber';
  public accountMaster: AccountMaster[] = [];
  public EndClient: number;
  oldBillrate: string
  public invoiceTermslist: any = [];
  public invoiceCyclelist: any = [];
  //public workStatuFields: SelectItem[] = [];
  public placementDocumentType: number;
  public FileName: string;
  dataSource = new MatTableDataSource(this.placementDocuments)
  empdataSource = new MatTableDataSource(this.employeeDocuments)
  public Url: any;
  DocumentViewUrl: string;
  DocName: any;
  empDocumentType: number;
  EmployeeFileName: string;
  isPageload: boolean = false;
  isLoading: boolean = false;
  public createUserAccount: boolean = false;
  SelectedType: number;
  DialogResponse: ConfirmDialogModelResponse;
  existingEmployee: EmployeeMaster;
  @ViewChild('fieldEmail') fieldEmail: ElementRef;
  InitialEmailId: string = null;
  onboardingResult: PlacementOnBoardingResult;
  isBillRateChanged: boolean = false;
  IsWorkerLocation: boolean = false;
  IsAssLocation: boolean = false;

  endclientFormValid: boolean = true;
  primevendorFormValid: boolean = true;
  mspFormValid: boolean = true;
  ipFormValid: boolean = true;
  subpvFormValid: boolean = true;
  referalFormValid: boolean = true;
  placementLoaded: boolean = false;
  cansubvendorFormValid: boolean = true;
  canreferalvendorFormValid: boolean = true;
  @ViewChild(EndClientInternalComponent) endClientInternalComponent: EndClientInternalComponent;
  constructor(
    public zone: NgZone,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<PlacementOnboardingComponent>,
    private fb: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private accountTypes: AccountTypes,
    private cdRef: ChangeDetectorRef,
    private _service: PlacementService,
    private invoiceCycle: InvoiceCycle,
    private fileStoreService: FileStoreService,
    private _sanitizer: DomSanitizer,
    public iconService: IconService,
    private workStatusService: WorkStatusService
  ) {
    this.firstFormGroup = this.fb.group({
      firstCtrl: [''], title: [null], lastName: [null],
      startdate: [null, [Validators.required]],
      enddate: [null, [Validators.required]],
      pstatus: [null], PlacementType: [null], PlacementCategory: [null],
      Placementpoc: [null],
      pBillRate: [null, [Validators.required, ValidationService.NumberWith2digits]],
      billrateeffective: [],
      pterms: [Validators.required],
      pcycle: [Validators.required],
      pinpocemail: ['', [Validators.required, Validators.email]]
    }, { validator: this.ValidateStartEndDate });
    this.secondFormGroup = this.fb.group({
      EmployeeId: [{ value: '', disabled: true }],
      FirstName: [null, [Validators.required]],
      MiddleName: [null],
      LastName: [null, [Validators.required]],
      Email: [null, [Validators.required]],
      PrimaryPhoneNumber: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      //Address1: [null,[Validators.required]],
      Address2: [null],
      City: [null, [Validators.required]],
      State: [null, [Validators.required]], EmploymentType: [null],
      ZipCode: [null, [Validators.required, ValidationService.zipCodeValidator]],
      Gender: [null, [Validators.required]],
      MaritalStatus: [null, [Validators.required]], Designation: [null],
      WorkStatus: [null, [Validators.required]],
      WorkStatusExpiry: [null, [Validators.required, ValidationService.ValidatWorkPermitExpiryDate]],
      WorkStatusEffective: [null, [Validators.required]],
      EmpStartDate: [null], AssignmentStatus: [null], CreateUserAccount: [null],
      HealthInsuranceEnrolled: [null], HRManager: [null], TrainingManager: [null],
      FinanceManager: [null], ImmigrationManager:[null], DocumentType: [null], Department: [null], empDocumentType: [null],
      EmployeeFileName: [null], I94Number: [null], I94ExpiryDate: [null]
    });
    this.thirdFormGroup = this.fb.group({
      AssignmentId: [{ value: '', disabled: true }], Name: [null], AssignmentType: [null],
      Classification: [null],
      asmStartDate: [null, [Validators.required]],
      asmEndDate: [null, [Validators.required]],
      WLAddress1: [null],
      WLAddress2: [null],
      WLState: [null], WLCity: [null],
      WLZipCode: [null, [Validators.required, ValidationService.zipCodeValidator]],
      TimeSheet: [null], RemoteAssignment: [null], AmendmentRequired: [null],
    }, { validator: this.ValidateAssignmentStartEndDate });


    this.thirdTypeList = [];
    this.thirdTypeList = this.accountTypes.ThirdPartyClient;
    this.invoiceCyclelist = this.invoiceCycle.InvoiceCycle;
    this.invoiceTermslist = this.invoiceCycle.InvoiceTerms;
    this.placementOnBoarding.Employee = new EmployeeMaster();
    this.placementOnBoarding.Assignment = new AssignmentMaster();

  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.isPageload = true;
      this.endClientAccount.PlacementAcctContactInfo.push(this.loadContact());
      this.primeVClientAccount.PlacementAcctContactInfo.push(this.loadContact());
      this.mspClientAccount.PlacementAcctContactInfo.push(this.loadContact());
      this.ipClientAccount.PlacementAcctContactInfo.push(this.loadContact());
      this.subPVClientAccount.PlacementAcctContactInfo.push(this.loadContact());
      this.refClientAccount.PlacementAcctContactInfo.push(this.loadContact());
      
      // Load work status fields directly
      this.loadWorkStatusFields().subscribe({
        next: (workStatusFields) => {debugger;
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

      this.LoadPermissions();
      this.GetAccounts();
    }

    // Setup file upload handlers
    this.setupFileUploadHandlers();
  }

  loadWorkStatusFields() {
    return this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id);
  }

  setupFileUploadHandlers() {
    this.downlaodablesUploader.onAfterAddingFile = (item: FileItem) => {
      this.isdocloading = true;
      let isValid: boolean = false;
      let fileExtension = item.file.name.replace(/^.*\./, '');
      let validExtensions: string[];
      validExtensions = [".pdf"];
      for (let i = 0; i < validExtensions.length; i++) {
        let ext: string = validExtensions[i];
        if (item.file.name.substr(item.file.name.length - ext.length, ext.length).toLowerCase() == ext.toLowerCase()) {
          isValid = true;
          break;
        }
      }
      if (!isValid) {
        this._alertService.error("uploaded file is not in the correct format");
        this.isdocloading = false
        return;
      }
      item.withCredentials = false;
      item.file.name = item.file.name;
      this.downlaodablesUploader.uploadItem(item);
      this.FileName = item.file.name;
    }
    this.downlaodablesUploader.onSuccessItem = (item: FileItem, response: string) => {
      debugger;
      this.isdocloading = false
      let result = JSON.parse(response);
      result.PlacementID = this.Data.Id;
      if (this.placementDocumentType != 0) {
        result.DocumentType = this.placementDocumentType;
      }
      result.PlacementDocumentID = 0
      this.placementDocuments.push(result);
      this.dataSource = new MatTableDataSource(this.placementDocuments)
      this.FileName = null;
      this.placementDocumentType = 0;

      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }
    this.Employeedownlaodables.onAfterAddingFile = (item: FileItem) => {
      this.isempdocloading = true;
      let isValid: boolean = false;
      let fileExtension = item.file.name.replace(/^.*\./, '');
      let validExtensions: string[];
      validExtensions = [".pdf"];
      for (let i = 0; i < validExtensions.length; i++) {
        let ext: string = validExtensions[i];
        if (item.file.name.substr(item.file.name.length - ext.length, ext.length).toLowerCase() == ext.toLowerCase()) {
          isValid = true;
          break;
        }
      }
      if (!isValid) {
        this._alertService.error("uploaded file is not in the correct format");
        this.isempdocloading = false
        return;
      }
      item.withCredentials = false;
      item.file.name = item.file.name;
      this.Employeedownlaodables.uploadItem(item);
      this.EmployeeFileName = item.file.name;
    }
    this.Employeedownlaodables.onSuccessItem = (item: FileItem, response: string) => {
      this.isempdocloading = false
      let result = JSON.parse(response);
      result.PlacementID = this.Data.Id;
      if (this.empDocumentType != 0) {
        result.DocumentType = this.empDocumentType;
      }
      result.EmployeeDocumentID = 0;
      result.EmployeeID = this.placementOnBoarding.Employee.EmployeeID != 0 ? this.placementOnBoarding.Employee.EmployeeID : 0;
      this.employeeDocuments.push(result);
      this.empdataSource = new MatTableDataSource(this.employeeDocuments);
      this.EmployeeFileName = null;
      this.empDocumentType = 0;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }
  }
  GetPlacementByIdForOnBoarding() {
    this._service.GetPlacementByIdForOnBoarding(this.loginUser.Company.Id, this.Data.Id).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        try {
          this.InitialPlaceentOnBoardig = { ...response.Data };
          this.placementOnBoarding = { ...response.Data };
          if (this.placementOnBoarding.Status != 1) {
            this.fieldEmail.nativeElement.disabled = true;
          }
          //this.placementOnBoarding.Employee.WorkStatusExpiry = null;
          //this.placementOnBoarding.Employee.EmpStartDate = null;
          this.oldBillrate = this.placementOnBoarding.BillRate;
          this.InitialEmailId = this.placementOnBoarding.Employee.Email;
          this.placementOnBoarding.Employee.EmployeeType = 'Consultant';
          this.placementOnBoarding.Employee.EmploymentType = this.placementOnBoarding.PlacementType;
          if (this.placementOnBoarding.Assignment) {
            this.placementOnBoarding.Assignment.StartDate = this.placementOnBoarding.StartDate;
            this.placementOnBoarding.Assignment.EndDate = this.placementOnBoarding.EndDate;
            this.placementOnBoarding.Assignment.AssignmentType = this.placementOnBoarding.PlacementType;
          } else {
            this.placementOnBoarding.Assignment = new AssignmentMaster();
          }
          this.SelectedType = Number(this.placementOnBoarding.JobCategory);
          this.OnRequirementChange(Number(this.placementOnBoarding.JobCategory));

          if (this.placementOnBoarding.PlacementType == "C2C") {
            this.isC2CEmployer = true;
            this.onRemoveC2CValidationClick();

          }
          if (this.placementOnBoarding.PlacementAccountMappings.length > 0) {
            debugger;
            this.placementOnBoarding.PlacementAccountMappings.forEach(element => {
              const acntTypeName = this.getAccounttypeName(element.AccountTypeId);
              if (element.AccountLevel == "job") {
                this.PrepareAccounts(element.AccountTypeId, element);
              }
              else {
                this.PrepareCandidateAccount(element.AccountTypeId, element);
              }
              if (element.AccountTypeId != 1) {
                this.EditLayerSelection(acntTypeName, element.AccountLevel);
                if (this.Data.Mode === "Edit") {
                  this.SetBillingAccount(acntTypeName, element.AccountLevel);
                }
              }
            });
          }
          if (this.placementOnBoarding && this.placementOnBoarding.Employee &&
            this.placementOnBoarding.Employee.EmployeeDocuments.length > 0) {
            this.employeeDocuments = this.DeepCopyForObject(this.placementOnBoarding.Employee.EmployeeDocuments);
            this.empdataSource.data = this.employeeDocuments;
            if (!this.cdRef["distroyed"]) {
              this.cdRef.detectChanges();
            }
          }
          if (this.placementOnBoarding && this.placementOnBoarding.PlacementDocuments &&
            this.placementOnBoarding.PlacementDocuments.length > 0) {
            this.placementDocuments = this.DeepCopyForObject(this.placementOnBoarding.PlacementDocuments);
            this.dataSource.data = this.placementDocuments;
            if (!this.cdRef["distroyed"]) {
              this.cdRef.detectChanges();
            }
          }
          if (this.placementOnBoarding.StartDate) {
            this.placementOnBoarding.StartDate = new Date(this.placementOnBoarding.StartDate.toString());
          }

          if (this.placementOnBoarding.EndDate)
            this.placementOnBoarding.EndDate = new Date(this.placementOnBoarding.EndDate.toString())

          if (this.placementOnBoarding.BillRateEffectiveDate)
            this.placementOnBoarding.BillRateEffectiveDate = new Date(this.placementOnBoarding.BillRateEffectiveDate.toString())
          else
            this.placementOnBoarding.BillRateEffectiveDate = new Date(this.placementOnBoarding.StartDate.toString());

          this.placementOnBoarding.Employee.DOB = this.placementOnBoarding.Employee.DOB + "T00:00:00";

          if (!isNullOrUndefined(this.placementOnBoarding.Employee.WebsiteUser)) {
            this.createUserAccount = true;
            this.placementOnBoarding.Employee.CreateUserAccount = true;
          }
          this.placementLoaded = true;
          if (!this.cdRef["distroyed"]) {
            this.cdRef.detectChanges();
          }
        }
        catch (error) {
          console.log(error);
        }
        this.isPageload = false;
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this.isPageload = false;
      this._alertService.error(error);
    })
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
    return Name;
  }
  getUsers() {
    this._service.getAtsSubUsers(this.loginUser.Company.Id).subscribe(response => {
      this.employerProfile = response;
      this.getEmployeeCentralUsers();
    }, error => {
      this.isPageload = false;
      this._alertService.error(error);
    });
  }
  getEmployeeCentralUsers() {
    this._service.getEmloyeeCentralUsers(this.loginUser.Company.Id).subscribe(response => {
      this.manageEmployerProfile = response.Data;
      this.GetPlacementByIdForOnBoarding();
    }, error => {
      this.isPageload = false;
      this._alertService.error(error);
    })
  }
  GetAccounts() {
    this._service.GetAccounts(this.loginUser.Company.Id).subscribe(response => {
      this.accountMaster = response;
      //this.PepareAccountTypeAccountList();
      this.getUsers();
    }, error => {
      this.isPageload = false;
      this._alertService.error(error);

    })
  }
  PrepareAccounts(id, Account: PlacementAccountMappings) {
    debugger;
    if (Account.PlacementAcctContactInfo.length == 0) {
      Account.PlacementAcctContactInfo.push(this.loadContact());
      Account.SalesPOC = this.loadContact();
    }
    switch (id) {
      case 1: debugger;
        this.endClientAccount = Account;
        console.log(this.endClientAccount);
        break;
      case 4:
        this.primeVClientAccount = Account;
        break;
      case 2:
        this.mspClientAccount = Account;
        this.isManagedServiceProvider = true;
        break;
      case 3:
        this.ipClientAccount = Account;
        this.isImplementationPartner = true;
        break;
      case 5:
        this.subPVClientAccount = Account;
        this.isSubPrimeVendor = true;
        break;
      case 8:
        this.refClientAccount = Account;
        this.isReffralVendor = true;
        break;
    }
  }
  PrepareCandidateAccount(id, Account: PlacementAccountMappings) {
    if (Account.PlacementAcctContactInfo.length == 0) {
      Account.PlacementAcctContactInfo.push(this.loadContact());
    }
    switch (id) {
      case 7:
        this.candSubVendorClientAccount = Account;
        this.candSubVendorClientAccount.SalesPOC = Account.PlacementAcctContactInfo[0];
        break;
      case 8:
        this.candReferralClientAccount = Account;
        this.candReferralClientAccount.SalesPOC = Account.PlacementAcctContactInfo[0];
        break;
    }
  }
  //stepper: MatStepper
  async CheckCandidateByEmail() {
    if (!isNullOrUndefined(this.placementOnBoarding.Employee.Email)) {
      let title = null;
      let message = null;
      const CandidateSearchVM = {
        Email: this.placementOnBoarding.Employee.Email.trim(),
        CompanyId: this.loginUser.Company.Id,
        WorkerId: this.placementOnBoarding.Employee.EmployeeID
      }
      this.existingEmployee = new EmployeeMaster();
      let response = await this._service.SyncCheckWorkerByEmail(CandidateSearchVM);
      if (response.IsError == false) {
        this.existingEmployee = response.Data;
        if (this.existingEmployee != null) {
          if (this.existingEmployee.FailType == "Duplicate") {
            title = 'Worker Email Address Changed!';
            message = '<p>Worker email address has been modified. System found a matching worker with the email address <b><span class="displayEmail">' + this.placementOnBoarding.Employee.Email + '</span></b> with the following info.</p>'
          }
          else if (this.existingEmployee.FailType == "Mismatch-New") {
            title = 'Worker Email Address Changed!';
            message = '<p>Worker email address has been modified. Do you want to create a new worker with email <b><span class="displayEmail">' + this.placementOnBoarding.Employee.Email + '</span></b>'
          }

          const dialogRef = this.dialog.open(WorkerExistsComponent, {
            width: '60%',
            data: { title: title, msg: message, dtype: 'worker', failtype: this.existingEmployee.FailType, dmodel: this.existingEmployee },
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe(dialogResult => {
            this.DialogResponse = dialogResult;
            if (this.DialogResponse.Dialogaction === "Existing Candidate") {

              this.placementOnBoarding.Employee = this.existingEmployee;
              if (this.existingEmployee.WebsiteUser != null) {
                this.createUserAccount = true;
                this.placementOnBoarding.Employee.CreateUserAccount = true;
              }

            } else if (this.DialogResponse.Dialogaction === "Update") {
              this.placementOnBoarding.Employee.EmployeeID = this.existingEmployee.EmployeeID;
              this.placementOnBoarding.Employee.ComapnyEmployeeID = this.existingEmployee.ComapnyEmployeeID;
              this.placementOnBoarding.Employee.CompEmployeeID = this.existingEmployee.CompEmployeeID;
              this.placementOnBoarding.Employee.Status = this.existingEmployee.Status;
            }
            else if (this.DialogResponse.Dialogaction === "New") {
              this.placementOnBoarding.Employee.EmployeeID = 0;
              this.placementOnBoarding.Employee.ComapnyEmployeeID = null;
            }
            else if (this.DialogResponse.Dialogaction === "Cancel") {
              this.placementOnBoarding.Employee.Email = this.InitialEmailId;
              this.fieldEmail.nativeElement.focus();
              return true;
            }
            if (!this.cdRef["distroyed"]) {
              this.cdRef.detectChanges();
            }
          });
        }

      }
      else {
        this._alertService.error(response.ErrorMessage);
        return false;
      }
    }
  }

  OnResetStep1() {
    debugger;
    this.placementOnBoarding = { ...this.InitialPlaceentOnBoardig };
    if (this.placementOnBoarding && this.placementOnBoarding.PlacementDocuments &&
      this.placementOnBoarding.PlacementDocuments.length > 0) {
      this.placementDocuments = this.DeepCopyForObject(this.placementOnBoarding.PlacementDocuments);
      this.dataSource.data = this.placementDocuments;
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  saveOnboarding() {
    debugger;
    this.isLoading = true;
    this.PrepareAccountsData();
    this.placementOnBoarding.PlacementDocuments = [];
    this.placementOnBoarding.Employee.EmployeeDocuments = [];
    this.placementOnBoarding.JobCategory = this.placementOnBoarding.JobCategory;
    this.placementOnBoarding.UpdatedBy = this.loginUser.UserId;
    this.placementOnBoarding.PlacementID = this.Data.Id;
    this.placementOnBoarding.UpdatedDate = new Date();
    this.placementOnBoarding.Employee.EmployeeType = "Consultant";
    this.placementOnBoarding.Employee.CreatedBy = this.loginUser.UserId;
    this.placementOnBoarding.Employee.CreatedDate = new Date();
    this.placementOnBoarding.Assignment.CompanyID = this.loginUser.Company.Id;
    this.placementOnBoarding.Assignment.CreatedBy = this.loginUser.UserId;
    this.placementOnBoarding.Assignment.CreatedDate = new Date();
    this.placementOnBoarding.Assignment.AssignmentType = this.placementOnBoarding.Employee.EmploymentType;
    this.placementOnBoarding.Employee.DOB = moment(this.placementOnBoarding.Employee.DOB).format("YYYY-MM-DD");
    this.placementOnBoarding.Employee.CompanyID = this.loginUser.Company.Id;
    this.placementOnBoarding.CompanyID = this.loginUser.Company.Id;
    this.placementOnBoarding.PlacementType = this.placementOnBoarding.Employee.EmploymentType;
    this.placementOnBoarding.Status = 1;
    this.placementOnBoarding.Employee.AssignmentStatus = 1; //OnProject
    if (this.placementDocuments.length > 0) {
      this.placementOnBoarding.PlacementDocuments = this.placementDocuments;
    }
    if (this.employeeDocuments.length > 0) {
      this.placementOnBoarding.Employee.EmployeeDocuments = this.employeeDocuments;
    }

    this._service.OnBoardingPlacement(this.placementOnBoarding).subscribe(reponse => {
      if (reponse.IsError == false) {
        this.onboardingResult = reponse.Data;
        //check ngx permission for Create User
        if (this.isActionCreateConsultant == true && this.onboardingResult.IsCVAccess == false) {
          this.CreateConsultantUser(this.placementOnBoarding.Employee, this.onboardingResult.EmployeeId, reponse.SuccessMessage);
          this.isLoading = false;
          this.dialogRef.close(true);
        }
        else {
          this.isLoading = false;
          this._alertService.success(reponse.SuccessMessage);
          this.dialogRef.close(true);
        }
      }
      else {
        this._alertService.error(reponse.ErrorMessage);
        this.isLoading = false;
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }, error => {
      this._alertService.error(error);
      this.isLoading = false; if
        (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    });

  }


  private PrepareAccountsData() {
    this.placementOnBoarding.PlacementAccountMappings = [];
    if (!isNullOrUndefined(this.endClientAccount.AccountName) && this.endClientAccount.AccountName != "") {
      const end = this.checkAccountName(this.DeepCopyForObject(this.endClientAccount), this.enumAccountTypes.EndClient, 'job');
      this.placementOnBoarding.PlacementAccountMappings.push(end);
    } if (!isNullOrUndefined(this.primeVClientAccount.AccountName) && this.primeVClientAccount.AccountName != "") {
      const prime = this.checkAccountName(this.DeepCopyForObject(this.primeVClientAccount), this.enumAccountTypes.PrimeVendor, 'job');
      this.placementOnBoarding.PlacementAccountMappings.push(prime);
    } if (!isNullOrUndefined(this.mspClientAccount.AccountName) && this.mspClientAccount.AccountName != "") {
      const end = this.checkAccountName(this.DeepCopyForObject(this.mspClientAccount), this.enumAccountTypes.ManagedServiceProvider, 'job');
      this.placementOnBoarding.PlacementAccountMappings.push(end);
    } if (!isNullOrUndefined(this.ipClientAccount.AccountName) && this.ipClientAccount.AccountName != "") {
      const end = this.checkAccountName(this.DeepCopyForObject(this.ipClientAccount), this.enumAccountTypes.ImplementationPartner, 'job');
      this.placementOnBoarding.PlacementAccountMappings.push(end);
    } if (!isNullOrUndefined(this.subPVClientAccount.AccountName) && this.subPVClientAccount.AccountName != "") {
      const end = this.checkAccountName(this.DeepCopyForObject(this.subPVClientAccount), this.enumAccountTypes.SubPrimeVendor, 'job');
      this.placementOnBoarding.PlacementAccountMappings.push(end);
    } if (!isNullOrUndefined(this.refClientAccount.AccountName) && this.refClientAccount.AccountName != "") {
      const end = this.checkAccountName(this.DeepCopyForObject(this.refClientAccount), this.enumAccountTypes.ReferralVendor, 'job');
      this.placementOnBoarding.PlacementAccountMappings.push(end);
    }
    if (!isNullOrUndefined(this.candSubVendorClientAccount.AccountName) && this.candSubVendorClientAccount.AccountName != "") {
      const candsubvendor = this.checkAccountName(this.DeepCopyForObject(this.candSubVendorClientAccount), this.enumAccountTypes.SubVendor, 'candidate');
      this.placementOnBoarding.PlacementAccountMappings.push(candsubvendor);
    }
    if (!isNullOrUndefined(this.candReferralClientAccount.AccountName) && this.candReferralClientAccount.AccountName != "") {
      const candrefvendor = this.checkAccountName(this.DeepCopyForObject(this.candReferralClientAccount), this.enumAccountTypes.ReferralVendor, 'candidate');
      this.placementOnBoarding.PlacementAccountMappings.push(candrefvendor);
    }
  }
  private checkAccountName(accountLayer: PlacementAccountMappings, accTypeId: number, ácclevel: string) {
    if (this.accountMaster.findIndex(x => x.AccountName.toLocaleLowerCase() === accountLayer.AccountName.toLocaleLowerCase()) === -1) {
      accountLayer.AccountID = 0;
      accountLayer.PlacementID = this.Data.Id;
      accountLayer.CreatedDate = new Date();
      accountLayer.AccountTypeId = accTypeId;
      accountLayer.AccountLevel = ácclevel;
    }
    return accountLayer;
  }


  GetAccountandContact(account) {
    let ClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
    ClientAccount.AccountLevel = "job"
    ClientAccount.AccountName = account.AccountName;
    ClientAccount.AccountID = account.AccountID;
    ClientAccount.Employer = false;
    ClientAccount.PlacementID = this.Data.Id;
    ClientAccount.AccountTypeId = account.AccountTypeID;
    //ClientAccount.AccountTypeName = account.AccountTypeName;
    ClientAccount.CreatedDate = account.CreatedDate;
    if (account.AccountContacts.length > 0) {
      const contact = account.AccountContacts[0];
      ClientAccount.PlacementAcctContactInfo.push(this.DeepCopyForObject(contact));
    } else {
      const contact = {
        PlacementContactID: 0,
        AccountID: 0,
        FirstName: null,
        MiddleName: null,
        LastName: null,
        Email: null,
        Phonenumber: null,
        ContactType: 0,
        CreatedBy: this.loginUser.UserId,
        CreatedDate: new Date(),
        UpdatedBy: null,
        UpdatedDate: new Date(),
        PlacementAccountMappingID: 0,
        ContactID: 0,
      }
      ClientAccount.PlacementAcctContactInfo.push(contact);
    }
    return ClientAccount;
  }
  OnRequirementChange(type) {
    this.placementOnBoarding.JobCategory = type;
    if (type === 2) {
      this.directinternaltType = true;
      this.contractC2CType = false;
      this.onRemoveClick('prime');
    } else if (type === 3) {
      this.directinternaltType = false;
      this.contractC2CType = true;
      this.onRemoveClick('EndClient');
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  onRemoveClick(type) {
    switch (type) {
      case "MSP":
        this.mspClientAccount = new PlacementAccountMappings();
        this.isManagedServiceProvider = false;
        break;
      case "IP":
        this.ipClientAccount = new PlacementAccountMappings();
        this.isImplementationPartner = false;
        break;
      case "Sub Prime Vendor":
        this.subPVClientAccount = new PlacementAccountMappings();
        this.isSubPrimeVendor = false;
        break;
      case "Referral Vendor":
        this.refClientAccount = new PlacementAccountMappings();
        this.isReffralVendor = false;
        break;
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }

  }
  SetBillingAccount(type, accountLevel: string) {
    if (accountLevel == "job") {
      switch (type) {
        case "End Client":
          this.setValidation('end');
          this.isbillingEndClient = true;
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = false;
          break;
        case "Prime Vendor":
          this.setValidation('Prime');
          this.isbillingEndClient = false;
          this.isbillingPrimeVendor = true;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = false;
          break;
        case "Managed Service Provider (MSP)":
          this.isbillingEndClient = false;
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = true;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = false;
          this.setValidation('MSP');
          break;
        case "Implementation Partner (IP)":
          this.isbillingEndClient = false;
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = true;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = false;
          this.setValidation('IP');
          break;
        case "Sub Prime Vendor":
          this.isbillingEndClient = false;
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = true;
          this.isbillingReffralVendor = false;
          this.setValidation('Sub');
          break;
        case "Referral Vendor":
          this.isbillingEndClient = false;
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = true;
          this.setValidation('Ref');
          break;
      }
    }
  }


  SelectBillingAccount(type) {
    switch (type) {
      case "end":
        this.isbillingEndClient = true;
        this.isbillingPrimeVendor = false;
        this.isbillingManagedServiceProvider = false;
        this.isbillingImplementationPartner = false;
        this.isbillingSubPrimeVendor = false;
        this.isbillingReffralVendor = false;
        this.setValidation('end');
        this.GetExistingMSADocument(this.endClientAccount.AccountID);
        let endbill = this.endClientAccount.AccountName;
        this.placementOnBoarding.Assignment.AssignmentName = endbill;
        this.placementOnBoarding.InvoicingEmail = this.endClientAccount.BillingPOC.Email;
        break;
      case "Prime Vendor":
        this.isbillingPrimeVendor = true;
        this.isbillingManagedServiceProvider = false;
        this.isbillingImplementationPartner = false;
        this.isbillingSubPrimeVendor = false;
        this.isbillingReffralVendor = false;
        this.setValidation('Prime');
        this.GetExistingMSADocument(this.primeVClientAccount.AccountID);
        let bill = this.primeVClientAccount.AccountName;
        this.placementOnBoarding.InvoicingEmail = this.primeVClientAccount.BillingPOC.Email;
        if (!isNullOrUndefined(this.endClientAccount.AccountName) && this.endClientAccount.AccountName !== "") {
          this.placementOnBoarding.Assignment.AssignmentName = this.endClientAccount.AccountName + " / " + bill;
        } else {
          this.placementOnBoarding.Assignment.AssignmentName = bill;
        }
        break;
      case "MSP":
        this.isbillingPrimeVendor = false;
        this.isbillingManagedServiceProvider = true;
        this.isbillingImplementationPartner = false;
        this.isbillingSubPrimeVendor = false;
        this.isbillingReffralVendor = false;
        this.setValidation('MSP');
        this.GetExistingMSADocument(this.mspClientAccount.AccountID);
        let mbill = this.mspClientAccount.AccountName;
        this.placementOnBoarding.InvoicingEmail = this.mspClientAccount.BillingPOC.Email;
        if (!isNullOrUndefined(this.endClientAccount.AccountName) && this.endClientAccount.AccountName !== "") {
          this.placementOnBoarding.Assignment.AssignmentName = this.endClientAccount.AccountName + " / " + mbill;
        } else {
          this.placementOnBoarding.Assignment.AssignmentName = mbill;
        }
        break;
      case "IP":
        this.isbillingPrimeVendor = false;
        this.isbillingManagedServiceProvider = false;
        this.isbillingImplementationPartner = true;
        this.isbillingSubPrimeVendor = false;
        this.isbillingReffralVendor = false;
        this.setValidation('IP');
        this.GetExistingMSADocument(this.ipClientAccount.AccountID);
        let ipbill = this.ipClientAccount.AccountName;
        this.placementOnBoarding.InvoicingEmail = this.ipClientAccount.BillingPOC.Email;
        if (!isNullOrUndefined(this.endClientAccount.AccountName) && this.endClientAccount.AccountName !== "") {
          this.placementOnBoarding.Assignment.AssignmentName = this.endClientAccount.AccountName + " / " + ipbill;
        } else {
          this.placementOnBoarding.Assignment.AssignmentName = ipbill;
        }
        break;
      case "Sub Prime Vendor":
        this.isbillingPrimeVendor = false;
        this.isbillingManagedServiceProvider = false;
        this.isbillingImplementationPartner = false;
        this.isbillingSubPrimeVendor = true;
        this.isbillingReffralVendor = false;
        this.setValidation('Sub');
        this.GetExistingMSADocument(this.subPVClientAccount.AccountID);
        let spbill = this.primeVClientAccount.AccountName;
        this.placementOnBoarding.InvoicingEmail = this.subPVClientAccount.BillingPOC.Email;
        if (!isNullOrUndefined(this.endClientAccount.AccountName) && this.endClientAccount.AccountName !== "") {
          this.placementOnBoarding.Assignment.AssignmentName = this.endClientAccount.AccountName + " / " + spbill;
        } else {
          this.placementOnBoarding.Assignment.AssignmentName = spbill;
        }
        break;
      case "Referral Vendor":
        this.isbillingPrimeVendor = false;
        this.isbillingManagedServiceProvider = false;
        this.isbillingImplementationPartner = false;
        this.isbillingSubPrimeVendor = false;
        this.isbillingReffralVendor = true;
        this.setValidation('Ref');
        this.GetExistingMSADocument(this.refClientAccount.AccountID);
        let rfbill = this.primeVClientAccount.AccountName;
        this.placementOnBoarding.InvoicingEmail = this.refClientAccount.BillingPOC.Email;
        if (!isNullOrUndefined(this.endClientAccount.AccountName) && this.endClientAccount.AccountName !== "") {
          this.placementOnBoarding.Assignment.AssignmentName = this.endClientAccount.AccountName + " / " + rfbill;
        } else {
          this.placementOnBoarding.Assignment.AssignmentName = rfbill;
        }
        break;
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }



  EditLayerSelection(type, accountLevel: string) {
    if (accountLevel == "job") {
      switch (type) {
        case "Managed Service Provider (MSP)":

          this.isManagedServiceProvider = true;
          break;
        case "Implementation Partner (IP)":

          this.isImplementationPartner = true;
          break;
        case "Sub Prime Vendor":

          this.isSubPrimeVendor = true;
          break;
        case "Referral Vendor":

          this.isReffralVendor = true;
          break;
      }
    }
    else {
      switch (type) {
        case "Sub Vendor":
          this.isCandidateSubVendor = true;
          break;
        case "Referral Vendor":
          this.isCandidateReferalVendor = true;
          break;
      }
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
    //this.DynamicValidation(type);
  }
  addLayerSelection(type) {
    switch (type.label) {
      case "Managed Service Provider (MSP)":

        this.isManagedServiceProvider = true;
        break;
      case "Implementation Partner (IP)":

        this.isImplementationPartner = true;
        break;
      case "Sub Prime Vendor":

        this.isSubPrimeVendor = true;
        break;
      case "Referral Vendor":

        this.isReffralVendor = true;
        break;
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
    //this.DynamicValidation(type);
  }
  setValidation(type) {
    switch (type) {
      case "end":

        break;
      case "Prime":

        break;
      case "MSP":


        this.isManagedServiceProvider = true;
        break;
      case "IP":


        this.isImplementationPartner = true;
        break;
      case "Sub":



        this.isSubPrimeVendor = true;
        break;
      case "Ref":


        this.isReffralVendor = true;
        break;
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
    // this.updateDynamicValidation(type);
  }
  // RemoveValidations(type) {
  //   switch (type) {
  //     case "EndClient":
  //       this.endClientAccount = new PlacementAccountMappings();

  //       break;
  //     case "Prime":


  //       break;
  //     case "MSP":


  //       break;
  //     case "IP":


  //       break;
  //     case "Sub":


  //       break;
  //     case "Ref":


  //       break;
  //   }
  //   this.updateDynamicValidation(type);
  // }
  // updateDynamicValidation(type) {
  //   switch (type) {
  //     case "EndClient":

  //       break;
  //     case "Prime":


  //       break;
  //     case "MSP":


  //       this.isManagedServiceProvider = true;
  //       break;
  //     case "IP":


  //       this.isImplementationPartner = true;
  //       break;
  //     case "Sub":



  //       this.isSubPrimeVendor = true;
  //       break;
  //     case "Ref":


  //       this.isReffralVendor = true;
  //       break;
  //   }
  //   if (!this.cdRef["distroyed"]) {
  //     this.cdRef.detectChanges();
  //   }
  // }


  PhonenumberFormate(type) {
    switch (type) {
      case 'end':
        this.endClientAccount.PlacementAcctContactInfo[0].Phonenumber = this.PhoneValid(this.endClientAccount.PlacementAcctContactInfo[0].Phonenumber);
        break;
      case 'prime':
        this.primeVClientAccount.PlacementAcctContactInfo[0].Phonenumber = this.PhoneValid(this.primeVClientAccount.PlacementAcctContactInfo[0].Phonenumber);
        break;
      case 'msp':
        this.mspClientAccount.PlacementAcctContactInfo[0].Phonenumber = this.PhoneValid(this.mspClientAccount.PlacementAcctContactInfo[0].Phonenumber);
        break;
      case 'ip':
        this.ipClientAccount.PlacementAcctContactInfo[0].Phonenumber = this.PhoneValid(this.ipClientAccount.PlacementAcctContactInfo[0].Phonenumber);
        break;
      case 'sub':
        this.subPVClientAccount.PlacementAcctContactInfo[0].Phonenumber = this.PhoneValid(this.subPVClientAccount.PlacementAcctContactInfo[0].Phonenumber);
        break;
      case 'ref':
        this.refClientAccount.PlacementAcctContactInfo[0].Phonenumber = this.PhoneValid(this.refClientAccount.PlacementAcctContactInfo[0].Phonenumber);
        break;
      case 'cand':
        this.placementOnBoarding.Employee.PrimaryPhoneNumber = this.PhoneValid(this.placementOnBoarding.Employee.PrimaryPhoneNumber);
        break;
      case 'pbilling':
        this.primeVClientAccount.BillingPOC.Phonenumber = this.PhoneValid(this.primeVClientAccount.BillingPOC.Phonenumber);
        break;
      case 'ibilling':
        this.primeVClientAccount.ImmigrationPOC.Phonenumber = this.PhoneValid(this.primeVClientAccount.ImmigrationPOC.Phonenumber);
        break;
      case 'mspinbilling':
        this.mspClientAccount.BillingPOC.Phonenumber = this.PhoneValid(this.mspClientAccount.BillingPOC.Phonenumber);
        break;
      case 'imspbilling':
        this.mspClientAccount.ImmigrationPOC.Phonenumber = this.PhoneValid(this.mspClientAccount.ImmigrationPOC.Phonenumber);
        break;
      case 'ipinbilling':
        this.ipClientAccount.BillingPOC.Phonenumber = this.PhoneValid(this.ipClientAccount.BillingPOC.Phonenumber);
        break;
      case 'iipbilling':
        this.ipClientAccount.ImmigrationPOC.Phonenumber = this.PhoneValid(this.ipClientAccount.ImmigrationPOC.Phonenumber);
        break;
      case 'subinbilling':
        this.subPVClientAccount.BillingPOC.Phonenumber = this.PhoneValid(this.subPVClientAccount.BillingPOC.Phonenumber);
        break;
      case 'subimbilling':
        this.subPVClientAccount.ImmigrationPOC.Phonenumber = this.PhoneValid(this.subPVClientAccount.ImmigrationPOC.Phonenumber);
        break;
      case 'refinbilling':
        this.refClientAccount.BillingPOC.Phonenumber = this.PhoneValid(this.refClientAccount.BillingPOC.Phonenumber);
        break;
      case 'refimbilling':
        this.refClientAccount.ImmigrationPOC.Phonenumber = this.PhoneValid(this.refClientAccount.ImmigrationPOC.Phonenumber);
        break;
      case 'emp':
        this.placementOnBoarding.Employee.PrimaryPhoneNumber = this.PhoneValid(this.placementOnBoarding.Employee.PrimaryPhoneNumber);
        break;
      case 'endbilling':
        this.endClientAccount.BillingPOC.Phonenumber = this.PhoneValid(this.endClientAccount.BillingPOC.Phonenumber);
        break;
      case 'endibilling':
        this.endClientAccount.ImmigrationPOC.Phonenumber = this.PhoneValid(this.endClientAccount.ImmigrationPOC.Phonenumber);
        break;

    }

  }
  CopyDetails(event, type) {

    switch (type) {
      case 'end':
        if (event.checked) {
          this.endClientAccount.BillingPOC = this.endClientAccount.PlacementAcctContactInfo[0];
          this.endClientAccount.ImmigrationPOC = this.endClientAccount.PlacementAcctContactInfo[0];
          this.placementOnBoarding.InvoicingEmail = this.endClientAccount.BillingPOC.Email;
        } else {
          this.endClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
        }
        break;
      case 'prime':
        if (event.checked) {

          this.primeVClientAccount.BillingPOC = this.primeVClientAccount.PlacementAcctContactInfo[0];
          this.primeVClientAccount.ImmigrationPOC = this.primeVClientAccount.PlacementAcctContactInfo[0];
          this.placementOnBoarding.InvoicingEmail = this.primeVClientAccount.BillingPOC.Email;
        } else {
          this.primeVClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
        }
        break;
      case 'msp':
        if (event.checked) {
          this.mspClientAccount.BillingPOC = this.primeVClientAccount.PlacementAcctContactInfo[0];
          this.mspClientAccount.ImmigrationPOC = this.mspClientAccount.PlacementAcctContactInfo[0];
          this.placementOnBoarding.InvoicingEmail = this.mspClientAccount.BillingPOC.Email;
        } else {
          this.mspClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
        }
        break;
      case 'ip':
        if (event.checked) {
          this.ipClientAccount.BillingPOC = this.primeVClientAccount.PlacementAcctContactInfo[0];
          this.ipClientAccount.ImmigrationPOC = this.ipClientAccount.PlacementAcctContactInfo[0];
          this.placementOnBoarding.InvoicingEmail = this.ipClientAccount.BillingPOC.Email;
        } else {
          this.ipClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
        }
        break;
      case 'subp':
        if (event.checked) {
          this.subPVClientAccount.BillingPOC = this.primeVClientAccount.PlacementAcctContactInfo[0];
          this.subPVClientAccount.ImmigrationPOC = this.subPVClientAccount.PlacementAcctContactInfo[0];
          this.placementOnBoarding.InvoicingEmail = this.subPVClientAccount.BillingPOC.Email;
        } else {
          this.subPVClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
        }
        break;
      case 'ref':
        if (event.checked) {
          this.refClientAccount.BillingPOC = this.primeVClientAccount.PlacementAcctContactInfo[0];
          this.refClientAccount.ImmigrationPOC = this.refClientAccount.PlacementAcctContactInfo[0];
          this.placementOnBoarding.InvoicingEmail = this.refClientAccount.BillingPOC.Email;
        } else {
          this.refClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
        }
        break;
    }
  }
  BillingrateChange(event) {
    debugger;
    if (this.placementOnBoarding.Status === 2 && this.oldBillrate !== this.placementOnBoarding.BillRate) {
      this.isBillRateChanged = true;
      //this.placementOnBoarding.BillRateEffectiveDate = new Date();
    }
    else {
      this.isBillRateChanged = false;
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  onFileClick(event) {
    if (this.placementDocumentType === 0) {
      this.isPlacementSelected = true;
      this._alertService.error("Please select document type");
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
      return;
    } else {
      this.isPlacementSelected = false;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
      return;
    }
  }
  placementDocumentTypechange(event) {
    if (event.value !== 0) {
      this.placementDocumentType = event.value;
      this.isPlacementSelected = false;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
      return;
    } else {
      this.isPlacementSelected = true;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
      return;
    }
  }
  onEmpFileClick(ada) {
    if (this.empDocumentType === 0) {
      this.isempDocumentType = true;
      this._alertService.error("Please select document type");
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
      return;
    } else {
      this.isempDocumentType = false;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
      return;
    }
  }
  onDownlaodablesPlacementClear() {
    this.FileName = null;
    this.selectedplacementDoc = new PlacementDocuments()
  }
  onDownlaodablesemployeeClear() {
    this.EmployeeFileName = null;
    this.isempdocloading = false;
    this.selectedEmployeeDoc = new EmployeeDocuments();
  }

  DeletePlacementDocument(item, i) {
    const message = 'Are you sure you want to delete  <b><span class="displayEmail">' + item.DownloadableFileName + ' </span></b> ?'
    const dialogData = new ConfirmDialogModel("Delete Placement Document", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.ConfirmDeletedPlcDoc(item, i);
      }
    });
  }

  ConfirmDeletedPlcDoc(item, i) {
    debugger;
    this.placementDocuments[i].isDeleted = true;
    this.placementDocuments = this.placementDocuments.filter(x => x.isDeleted === false);
    this.dataSource = new MatTableDataSource(this.placementDocuments);
    this._alertService.success('Document Deleted successfully');
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }



  DeleteEmployeeDocument(item, i) {
    const message = 'Are you sure you want to delete <b><span class="displayEmail">' + item.DownloadableFileName + ' </span></b> ?'
    const dialogData = new ConfirmDialogModel("Delete Worker Document", message);
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '60%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.ConfirmDeletedEmpDoc(item, i);
      }
    });
  }

  ConfirmDeletedEmpDoc(item, i) {
    this.employeeDocuments[i].isDeleted = true;
    this.employeeDocuments = this.employeeDocuments.filter(x => x.isDeleted === false);
    this.empdataSource = new MatTableDataSource(this.employeeDocuments);
    this._alertService.success('Document Deleted successfully');
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }


  ViewDocViewer(doc, type) {
    this.Url = null;
    this.DocumentViewUrl = 'https://prod-consultvite.s3.amazonaws.com/' + doc.s3location + '/' + doc.Download_Path_Key;
    this.Url = this._sanitizer.bypassSecurityTrustResourceUrl(this.DocumentViewUrl);
    this.DocName = type;
    this.dialog.open(DocViewerComponent,
      { width: '60%', panelClass: "dialog-class", data: { Url: this.Url, Name: this.DocName } }
    ).afterClosed().subscribe((confirmation) => {

    });
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  empDocumentTypechange(event) {
    if (event.value !== 0) {
      this.empDocumentType = event.value;
      this.isempDocumentType = false;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
      return;
    } else {
      this.isempDocumentType = true;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
      return;
    }

  }
  Workstatuchange(event) {
    if (event.value === "USC") {
      this.placementOnBoarding.Employee.WorkStatusExpiry = new Date("12/31/9999");
    }
  }
  changestartDate(event) {
    let StartDate: any = moment(event.value).format("YYYY-MM-DDTHH:mm:ss.ms");
    this.placementOnBoarding.StartDate = StartDate;
    this.placementOnBoarding.Assignment.StartDate = StartDate;
    this.placementOnBoarding.BillRateEffectiveDate = StartDate;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  changeendDate(event) {
    let EndDate: any = moment(event.value).format("YYYY-MM-DDTHH:mm:ss.ms");
    this.placementOnBoarding.EndDate = EndDate;
    this.placementOnBoarding.Assignment.EndDate = EndDate;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  changeAssignstartDate(event) {
    let AssStartDate: any = moment(event.value).format("YYYY-MM-DDTHH:mm:ss.ms");
    this.placementOnBoarding.Assignment.StartDate = AssStartDate;
    this.placementOnBoarding.StartDate = AssStartDate;
    this.placementOnBoarding.BillRateEffectiveDate = AssStartDate;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  changeAssignendEndDate(event) {
    let AssEndDate: any = moment(event.value).format("YYYY-MM-DDTHH:mm:ss.ms");
    this.placementOnBoarding.EndDate = AssEndDate;
    this.placementOnBoarding.Assignment.EndDate = AssEndDate;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
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
  public onInputKeyPress(event): void {
    const pattern = /[0-9\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.code !== 'Backspace' && event.code !== 'Tab' &&
      event.code !== 'ArrowLeft' && event.code !== 'ArrowRight') {
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }
  public onNamesInputKeyPress(event): void {

    const pattern = /[a-z\A-Z\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.code !== 'Backspace' && event.code !== 'Tab' &&
      event.code !== 'ArrowLeft' && event.code !== 'ArrowRight') {
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }
  getAddress(event) {
    let data = event.address_components;
    this.placementOnBoarding.Employee.Address2 = null;
    this.placementOnBoarding.Employee.Address1 = null;
    this.placementOnBoarding.Employee.City = null;
    this.placementOnBoarding.Employee.Country = null;
    this.placementOnBoarding.Employee.ZipCode = null;

    if (data && data.length > 0) {
      for (let address of data) {
        if (address.types.includes("street_number")) {
          this.placementOnBoarding.Employee.Address1 = address.long_name;
        }
        else if (address.types.includes("route")) {
          this.placementOnBoarding.Employee.Address1 = isNullOrUndefined(this.placementOnBoarding.Employee.Address1) ? address.long_name : this.placementOnBoarding.Employee.Address1 + " " + address.long_name;
          this.IsWorkerLocation = true;
        } else if (address.types.includes("locality") || address.types.includes("sublocality")) {
          this.placementOnBoarding.Employee.City = address.long_name;
        } else if (address.types.includes("administrative_area_level_1")) {
          this.placementOnBoarding.Employee.State = address.long_name;
        } else if (address.types.includes("country")) {
          this.placementOnBoarding.Employee.Country = address.long_name;
        } else if (address.types.includes("postal_code")) {
          this.placementOnBoarding.Employee.ZipCode = address.long_name;
        }
      }
    }
    else {
      event.target.value = null;
      this.IsWorkerLocation = false;
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  inputEmployeeAddress(event) {
    this.getAddress(event);
  }

  getAssignAddress(event) {
    let data = event.address_components;
    this.placementOnBoarding.Assignment.WLAddress2 = null;
    this.placementOnBoarding.Assignment.WLAddress1 = null;
    this.placementOnBoarding.Assignment.WLCity = null;
    this.placementOnBoarding.Assignment.WLState = null;
    this.placementOnBoarding.Assignment.WLCountry = null;
    this.placementOnBoarding.Assignment.WLZipCode = null;

    if (data && data.length > 0) {
      for (let address of data) {
        if (address.types.includes("street_number")) {
          this.placementOnBoarding.Assignment.WLAddress1 = address.long_name;
        }
        else if (address.types.includes("route")) {
          this.placementOnBoarding.Assignment.WLAddress1 = isNullOrUndefined(this.placementOnBoarding.Assignment.WLAddress1) ? address.long_name : this.placementOnBoarding.Assignment.WLAddress1 + " " + address.long_name;
          this.IsAssLocation = true;
        }
        else if (address.types.includes("locality") || address.types.includes("sublocality") || address.types.includes("administrative_area_level_2")) {
          this.placementOnBoarding.Assignment.WLCity = address.long_name;
        }
        else if (address.types.includes("administrative_area_level_1")) {
          this.placementOnBoarding.Assignment.WLState = address.short_name;
        } else if (address.types.includes("country")) {
          this.placementOnBoarding.Assignment.WLCountry = address.short_name;
        } else if (address.types.includes("postal_code")) {
          this.placementOnBoarding.Assignment.WLZipCode = address.long_name;
        }
      }
    }
    else {
      event.target.value = null;
      this.IsAssLocation = false;
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  inputAssignEmployeeAddress(event) {
    this.getAssignAddress(event);
  }
  loadContact() {
    const contact = {
      PlacementContactID: 0,
      AccountID: 0,
      FirstName: null,
      MiddleName: null,
      LastName: null,
      Email: null,
      Phonenumber: null,
      ContactType: 0,
      CreatedBy: this.loginUser.UserId,
      CreatedDate: new Date(),
      UpdatedBy: null,
      UpdatedDate: new Date(),
      PlacementAccountMappingID: 0,
      ContactID: 0,
    }
    return contact;
  }
  private DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }

  GetExistingMSADocument(AccountID) {
    this._service.GetExistingMSADocument(AccountID, this.loginUser.Company.Id).subscribe(response => {
      if (response.Data != null) {
        if (!isNullOrUndefined(response.Data.DownloadableFileName)) {
          this.placementDocuments.push(response.Data)
          this.dataSource.data = this.placementDocuments;
          if (!this.cdRef["distroyed"]) {
            this.cdRef.detectChanges();
          }
        }
      }

    }, error => {
      this._alertService.error(error);
    })
  }
  RemoveExistingMSADocuments() {
    if (this.placementDocuments.length > 0) {
      this.placementDocuments = [];
      this.dataSource.data = this.placementDocuments;
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    }
  }

  GetCandSubVendorData(event: PlacementAccountMappings) {
    this.candSubVendorClientAccount = event;
    this.candSubVendorClientAccount.PlacementAcctContactInfo.push(event.SalesPOC);
  }

  GetCandRefVendorData(event: PlacementAccountMappings) {
    this.candReferralClientAccount = event;
    this.candReferralClientAccount.PlacementAcctContactInfo.push(event.SalesPOC);
  }


  onSetC2CValidation() {
    this.secondFormGroup.controls["HRManager"].setValidators(Validators.required);
    this.secondFormGroup.controls["HRManager"].updateValueAndValidity();
    this.secondFormGroup.controls["EmpStartDate"].setValidators(Validators.required);
    this.secondFormGroup.controls["EmpStartDate"].updateValueAndValidity();
    this.secondFormGroup.controls["Designation"].setValidators(Validators.required);
    this.secondFormGroup.controls["Designation"].updateValueAndValidity();
  }

  onRemoveC2CValidationClick() {
    this.secondFormGroup.controls["HRManager"].clearValidators();
    this.secondFormGroup.controls["HRManager"].updateValueAndValidity();
    this.secondFormGroup.controls["EmpStartDate"].clearValidators();
    this.secondFormGroup.controls["EmpStartDate"].updateValueAndValidity();
    this.secondFormGroup.controls["Designation"].clearValidators();
    this.secondFormGroup.controls["Designation"].updateValueAndValidity();
  }

  onEmployeeTypeChange(change: MatSelectChange) {
    var selectedType = change.value;
    if (selectedType == "W2") {
      this.isC2CEmployer = false;
      this.onSetC2CValidation();
      this.cansubvendorFormValid = true;
      this.canreferalvendorFormValid = true;
    }
    else if (selectedType == "C2C") {
      this.isC2CEmployer = true;
      this.onRemoveC2CValidationClick();
    }
  }

  MoveFirstTab(stepper: MatStepper) {
    stepper.next();
    this.fieldEmail.nativeElement.focus();
  }
  OnDateChange(event, modelType: string) {
    let FormattedDate: any = moment(event.value).format("YYYY-MM-DDTHH:mm:ss.ms");
    if (modelType == 'I94ExpiryDate')
      this.placementOnBoarding.Employee.I94ExpiryDate = FormattedDate;
    else if (modelType == 'WorkStatusEffective')
      this.placementOnBoarding.Employee.WorkStatusEffective = FormattedDate;
    else if (modelType == 'EmpStartDate')
      this.placementOnBoarding.Employee.EmpStartDate = FormattedDate;
    else if (modelType == 'WorkStatusExpiry')
      this.placementOnBoarding.Employee.WorkStatusExpiry = FormattedDate;

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  LoadPermissions() {
    let perm = [];
    let WCModule = this.loginUser.ModulesList.find(i => i.ModuleId == "D1F78D81-5F25-4F43-BF71-86BE16823816");
    if (WCModule) {
      perm = WCModule.RoleAssociatedActions?.split(',');
      if (perm.some(x => x === "ACTION_CREATE_CONSULTANT") == true) {
        this.isActionCreateConsultant = true;
      }
    }

  }

  CreateConsultantUser(EmployeeData: EmployeeMaster, EmpId: number, successmsg: string) {
    EmployeeData.EmployeeID = EmpId;
    const dialogData = {
      successmsg: successmsg,
      Email: EmployeeData.Email
    }
    const dialogRef = this.dialog.open(PlcOnboardingConfirmationComponent, {
      width: '40%',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.DialogResponse = dialogResult;
      if (this.DialogResponse.Dialogaction == true) {
        this.addconsultantUser(EmployeeData);
      }
    });
  }

  addconsultantUser(Employee: EmployeeMaster) {
    let user = <ConsultviteUser>{};
    user.UserType = 0; //consultantuser
    user.FirstName = Employee.FirstName;
    user.LastName = Employee.LastName;
    user.Email = Employee.Email;
    user.PhoneNo = Employee.PrimaryPhoneNumber.replace(/\D+/g, "");
    this.dialog.open(UsersEditComponent, {
      width: '60%',
      panelClass: "dialog-class",
      data: user,
      disableClose: true
    }).afterClosed().subscribe((employee) => {
      if (employee) {
      }
    });
  }

  changebillrateeffective(event) {
    let EffectiveDate: any = moment(event.value).format("YYYY-MM-DDTHH:mm:ss.ms");
    this.placementOnBoarding.BillRateEffectiveDate = EffectiveDate;
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  ValidateStartEndDate(group: FormGroup) {
    const start = group.controls.startdate;
    const end = group.controls.enddate;
    let StartDate: any; let EndDate: any
    if (start.value !== null) {
      StartDate = moment(start.value).format("YYYY-MM-DDTHH:mm:ss.ms")
    }
    if (end.value !== null) {
      EndDate = moment(end.value).format("YYYY-MM-DDTHH:mm:ss.ms")
    }

    if (!StartDate || !EndDate) {
      return null;
    }
    if (StartDate >= EndDate) {
      return { greaterThan: true };
    }
    return null;
  }

  ValidateAssignmentStartEndDate(group: FormGroup) {
    const start = group.controls.asmStartDate;
    const end = group.controls.asmEndDate;
    let StartDate: any; let EndDate: any
    if (start.value !== null) {
      StartDate = moment(start.value).format("YYYY-MM-DDTHH:mm:ss.ms")
    }
    if (end.value !== null) {
      EndDate = moment(end.value).format("YYYY-MM-DDTHH:mm:ss.ms")
    }

    if (!StartDate || !EndDate) {
      return null;
    }
    if (StartDate >= EndDate) {
      return { greaterThan: true };
    }
    return null;
  }

  GetEndClientInternalData(event) {
    debugger;
    this.endClientAccount = this.DeepCopyForObject(event);
    console.log(this.endClientAccount);
    if (this.endClientAccount.Isbilling == true) {
      this.SelectBillingAccount('end');
    }
  }

  OnEndClientInternalFormValidity(validity: boolean) {
    this.endclientFormValid = validity;
    console.log(this.endclientFormValid);
  }

  GetPrimeVendorData(event) {
    this.primeVClientAccount = event;
    if (this.primeVClientAccount.Isbilling == true) {
      this.SelectBillingAccount('Prime Vendor');
    }
  }

  OnPrimeVendorFormValidity(validity: boolean) {
    if (Number(this.placementOnBoarding.JobCategory) == 2)
      this.primevendorFormValid = true;
    else
      this.primevendorFormValid = validity;
  }

  GetMSPVendorData(event) {
    this.mspClientAccount = event;
    if (this.mspClientAccount.Isbilling == true) {
      this.SelectBillingAccount('MSP');
    }
  }

  OnMSPFormValidity(validity: boolean) {
    this.mspFormValid = validity;
  }

  GetIPVendorData(event) {
    this.ipClientAccount = event;
    if (this.ipClientAccount.Isbilling == true) {
      this.SelectBillingAccount('IP');
    }
  }

  OnIPFormValidity(validity: boolean) {
    this.ipFormValid = validity;
  }

  GetSubpvVendorData(event) {
    this.subPVClientAccount = event;
    if (this.subPVClientAccount.Isbilling == true) {
      this.SelectBillingAccount('Sub Prime Vendor');
    }
  }

  OnSubpvFormValidity(validity: boolean) {
    this.subpvFormValid = validity;
  }

  GetRefVendorData(event) {
    this.refClientAccount = event;
    if (this.refClientAccount.Isbilling == true) {
      this.SelectBillingAccount('Referral Vendor');
    }
  }

  OnRefFormValidity(validity: boolean) {
    this.referalFormValid = validity;
  }

  OnCanSubVendorFormValidity(validity: boolean) {
    this.cansubvendorFormValid = validity;
  }

  OnCanRefVendorFormValidity(validity: boolean) {
    this.canreferalvendorFormValid = validity;
  }

}
