import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import icClose from '@iconify/icons-ic/twotone-close';
import { Inject } from '@angular/core';
import icfileupload from '@iconify/icons-ic/file-upload';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import icPictureAsPdf from '@iconify/icons-ic/twotone-picture-as-pdf';
import iclocationon from '@iconify/icons-ic/location-on';
import icdelete from '@iconify/icons-ic/delete';
import icvieweye from '@iconify/icons-ic/remove-red-eye';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { PlacementService } from '../../core/http/placement.service';
import { AccountTypes } from 'src/static-data/accounttypes';
import { AccountMaster } from 'src/@shared/core/ats/models/accountmaster';
import { Observable } from 'rxjs';
import { PlacementAccountMappings, PlacementAcctContactInfo } from '../../core/models/placement';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { AccountTypeNameEnum, AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { ValidationService } from 'src/@cv/services/validation.service';
import { map, startWith } from 'rxjs/operators';
import icPerson from '@iconify/icons-ic/twotone-person';
import { EmployerProfile } from '../../core/models/employerprofile';
import { PlacementOnBoarding } from '../../core/models/placement-onboarding';
import { EmployeeDocuments } from '../../core/models/employeedocuments';
import { PlacementDocuments } from '../../core/models/placementdocuments';
import { InvoiceCycle,InvoiceCycleEnum,InvoiceTermsEnum } from '../../core/models/onboardingEnum';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { FileStoreService } from 'src/@shared/services/file-store.service';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocViewerComponent } from '../doc-viewer/doc-viewer.component';
import { EmployeeMaster } from '../../core/models/employeemaster';
import { AssignmentMaster } from '../../core/models/assignmentmaster';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icRemove_Red_Eye from '@iconify/icons-ic/twotone-remove-red-eye';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icInput from '@iconify/icons-ic/input';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';

@Component({
  selector: 'cv-view-onboarding-placement',
  templateUrl: './view-onboarding-placement.component.html',
  styleUrls: ['./view-onboarding-placement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [AccountTypes, PlacementService, InvoiceCycle, FileStoreService]
})
export class ViewOnboardingPlacementComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'type', 'actions'];
  empdisplayedColumns: string[] = ['position', 'name', 'type', 'actions'];

  EndClientControl: FormControl = new FormControl();
  EndClientOptions: Observable<AccountMaster[]>;
  EndClientList: AccountMaster[] = [];

  primeClientControl: FormControl = new FormControl();
  primeClientOptions: Observable<AccountMaster[]>;
  primeClientList: AccountMaster[] = [];

  MSPControl: FormControl = new FormControl();
  MSPOptions: Observable<AccountMaster[]>;
  MSPList: AccountMaster[] = [];

  IPControl: FormControl = new FormControl();
  IPOptions: Observable<AccountMaster[]>;
  IPList: AccountMaster[] = [];

  subPrimeVendorControl: FormControl = new FormControl();
  subPrimeVendorOptions: Observable<AccountMaster[]>;
  subPrimeVendorList: AccountMaster[] = [];

  RefControl: FormControl = new FormControl();
  RefOptions: Observable<AccountMaster[]>;
  RefList: AccountMaster[] = [];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  public primeVendorFromGroup: FormGroup;
  public mspFromGroup: FormGroup;
  public ipFromGroup: FormGroup;
  public subFromGroup: FormGroup;
  public refFromGroup: FormGroup;
  public confirmationFormGroup: FormGroup;

  form: FormGroup;
  icDoneAll = icDoneAll;
  icClose = icClose;
  icFileUpload = icfileupload;
  icPictureAsPdf = icPictureAsPdf;
  iclocationon = iclocationon;
  icPerson = icPerson;
  icdelete = icdelete;
  icvieweye = icvieweye
  icEdit = icEdit;
  icRemove_Red_Eye = icRemove_Red_Eye;
  icMoreVert=icMoreVert;
  icInput=icInput;
  icArrowDropDown=icArrowDropDown;
  directinternaltType: boolean = false;
  contractC2CType: boolean = true;
  isC2CEmployer:boolean = false;
  isPrimeVendor: boolean = false;
  isManagedServiceProvider: boolean = false;
  isImplementationPartner: boolean = false;
  isSubPrimeVendor: boolean = false;
  isReffralVendor: boolean = false;
  isCandidateSubVendor:boolean = false;
  isCandidateReferalVendor:boolean = false;

  isbillingPrimeVendor: boolean = false;
  isbillingManagedServiceProvider: boolean = false;
  isbillingImplementationPartner: boolean = false;
  isbillingSubPrimeVendor: boolean = false;
  isbillingReffralVendor: boolean = false;
  isPlacementSelected: boolean = true;
  isdocloading: boolean = false;
  isempDocumentType: boolean = true;
  isempdocloading: boolean = false;

 
  public Employeedownlaodables: FileUploader = new FileUploader({ url: this.fileStoreService.getWebAPIEmployeeUploadUrl() });

  public enumAccountTypeName: typeof AccountTypeNameEnum = AccountTypeNameEnum;
  public enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  public thirdTypeList: SelectItem[] = [];
  loginUser: LoginUser;
  public manageEmployerProfile: EmployerProfile[] = [];
  public financeEmployerProfile: EmployerProfile[] = [];
  public trainingEmployerProfile: EmployerProfile[] = [];
  public placementOnBoarding: PlacementOnBoarding = new PlacementOnBoarding();
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
  public candSubVendorClientAccount:PlacementAccountMappings = new PlacementAccountMappings();
  public candRefVendorClientAccount:PlacementAccountMappings = new PlacementAccountMappings();

  public employerProfile: EmployerProfile[] = [];
  public workStatusFields: SelectItem[] = [];
  public accountMaster: AccountMaster[] = [];
  public EndClient: number;
  public oldBillrate: string
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
  isPageload: boolean=false;
  //status_textClass:any='text-amber-contrast';
  //status_bgClass:any='bg-amber';
  public enumInvoiceCycle: typeof InvoiceCycleEnum = InvoiceCycleEnum;
  public enumInvoiceTerms : typeof InvoiceTermsEnum = InvoiceTermsEnum;
  public createUserAccount:boolean=false;
  formattedAddress:string;
  formattedAssignemntAddress:string;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<ViewOnboardingPlacementComponent>,
    private fb: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private accountTypes: AccountTypes,
    private cdRef: ChangeDetectorRef,
    private _service: PlacementService,
    private invoiceCycle: InvoiceCycle,
    private fileStoreService: FileStoreService,
    private _sanitizer: DomSanitizer,
  ) {
    this.firstFormGroup = this.fb.group({
      title: [{value:null,disabled:true}], lastName: [{value:null,disabled:true}], startdate: [{value:null,disabled:true}],
      enddate: [{value:null,disabled:true}], pstatus: [{value:null,disabled:true}], PlacementType: [{value:null,disabled:true}], PlacementCategory: [{value:null,disabled:true}],
      Placementpoc: [{value:null,disabled:true}]
    });
    this.secondFormGroup = this.fb.group({
      EmployeeId: [{value:null,disabled:true}], EmployeeType: [{value:null,disabled:true}], FirstName: [{value:null,disabled:true}],
      MiddleName: [{value:null,disabled:true}], LastName: [{value:null,disabled:true}], Email: [{value:null,disabled:true}],
      PrimaryPhoneNumber: [{value:null,disabled:true}], dob: [{value:null,disabled:true}], Address1: [{value:null,disabled:true}],
      Address2: [{value:null,disabled:true}], City: [{value:null,disabled:true}], 
      State: [{value:null,disabled:true}], EmploymentType: [{value:null,disabled:true}],
      ZipCode: [{value:null,disabled:true}], Gender: [{value:null,disabled:true}], 
      MaritalStatus: [{value:null,disabled:true}], Designation: [{value:null,disabled:true}],
      WorkStatus: [{value:null,disabled:true}], WorkStatusExpiry: [{value:null,disabled:true}], WorkStatusEffective: [{value:null,disabled:true}],
      EmpStartDate: [{value:null,disabled:true}], AssignmentStatus: [{value:null,disabled:true}], CreateUserAccount: [{value:null,disabled:true}],
      HealthInsuranceEnrolled: [{value:null,disabled:true}], HRManager: [{value:null,disabled:true}], TrainingManager: [{value:null,disabled:true}],
      FinanceManager: [{value:null,disabled:true}], DocumentType: [{value:null,disabled:true}], Department: [{value:null,disabled:true}], 
      empDocumentType: [{value:null,disabled:true}], EmployeeFileName: [{value:null,disabled:true}]
    });
    this.thirdFormGroup = this.fb.group({
      AssignmentId: [{value:null,disabled:true}], Name: [{value:null,disabled:true}], 
      AssignmentType: [{value:null,disabled:true}],
      Classification: [{value:null,disabled:true}], asmStartDate: [{value:null,disabled:true}],
      asmEndDate: [{value:null,disabled:true}], WLAddress1: [{value:null,disabled:true}],
       WLAddress2: [{value:null,disabled:true}],WLState: [{value:null,disabled:true}], 
       WLCity: [{value:null,disabled:true}], WLZipCode: [{value:null,disabled:true}],
      TimeSheet: [{value:null,disabled:true}], RemoteAssignment: [{value:null,disabled:true}], 
      AmendmentRequired: [{value:null,disabled:true}],
    });
    this.primeVendorFromGroup = this.fb.group({
      AccountName:[{value:null,disabled:true}],
      pfName: [{value:null,disabled:true}], plName: [{value:null,disabled:true}], pEmail: [{value:null,disabled:true}],
      pPhone: [{value:null,disabled:true}], pvbilling: [{value:null,disabled:true}], pcycle: [{value:null,disabled:true}],
      pterms: [{value:null,disabled:true}], pinpocemail: [{value:null,disabled:true}], ppofcname: [{value:null,disabled:true}],
      poclname: [{value:null,disabled:true}], ppocemail: [{value:null,disabled:true}], ppocphone: [{value:null,disabled:true}],
      pBillRate: [{value:null,disabled:true}], pimpofcname: [{value:null,disabled:true}], impoclname: [{value:null,disabled:true}],
      imppocemail: [{value:null,disabled:true}], imppocphone: [{value:null,disabled:true}], pvdetails: [{value:null,disabled:true}]
    });
    this.mspFromGroup = this.fb.group({
      AccountName:[{value:null,disabled:true}],
      mspfName: [{value:null,disabled:true}], msplName: [{value:null,disabled:true}], mspEmail: [{value:null,disabled:true}],
      mspPhone: [{value:null,disabled:true}], mspbilling: [{value:null,disabled:true}], mspcycle: [{value:null,disabled:true}],
      mspterms: [{value:null,disabled:true}], mspinpocemail: [{value:null,disabled:true}], msppofcname: [{value:null,disabled:true}],
      mspoclname: [{value:null,disabled:true}], msppocemail: [{value:null,disabled:true}], msppocphone: [{value:null,disabled:true}],
      mspBillRate: [{value:null,disabled:true}], mspimpofcname: [{value:null,disabled:true}], mspimoclname: [{value:null,disabled:true}],
      mspimpocemail: [{value:null,disabled:true}], mspimppocphone: [{value:null,disabled:true}], mspdetails: [{value:null,disabled:true}]
    });
    this.ipFromGroup = this.fb.group({
      AccountName:[{value:null,disabled:true}],
      fipName: [{value:null,disabled:true}], lipName: [{value:null,disabled:true}], 
      ipEmail: [{value:null,disabled:true}], ipPhone: [{value:null,disabled:true}],
      ipbilling: [{value:null,disabled:true}], ipcycle: [{value:null,disabled:true}], 
      ipterms: [{value:null,disabled:true}], ipinpocemail: [{value:null,disabled:true}],
      ippofcname: [{value:null,disabled:true}], ipoclname: [{value:null,disabled:true}], 
      ippocemail: [{value:null,disabled:true}], ippocphone: [{value:null,disabled:true}],
      ipBillRate: [{value:null,disabled:true}], ipimpofcname: [{value:null,disabled:true}], 
      ipimoclname: [{value:null,disabled:true}], ipimpocemail: [{value:null,disabled:true}],
      ipimppocphone: [{value:null,disabled:true}], ipdetails: [{value:null,disabled:true}]
    });
    this.subFromGroup = this.fb.group({
      AccountName:[{value:null,disabled:true}],
      fsubName: [{value:null,disabled:true}], lsubName: [{value:null,disabled:true}], 
      subEmail: [{value:null,disabled:true}], subPhone: [{value:null,disabled:true}],
      subbilling: [{value:null,disabled:true}], subcycle: [{value:null,disabled:true}], 
      subterms: [{value:null,disabled:true}], subinpocemail: [{value:null,disabled:true}],
      subpofcname: [{value:null,disabled:true}], suboclname: [{value:null,disabled:true}], 
      subpocemail: [{value:null,disabled:true}], subpocphone: [{value:null,disabled:true}],
      subBillRate: [{value:null,disabled:true}], subimpofcname: [{value:null,disabled:true}], 
      subimoclname: [{value:null,disabled:true}], subimpocemail: [{value:null,disabled:true}],
      subimppocphone: [{value:null,disabled:true}], subdetails: [{value:null,disabled:true}]
    });
    this.refFromGroup = this.fb.group({
      AccountName:[{value:null,disabled:true}],
      frefName: [{value:null,disabled:true}], lrefName: [{value:null,disabled:true}], 
      refEmail: [{value:null,disabled:true}], refPhone: [{value:null,disabled:true}],
      refbilling: [{value:null,disabled:true}], refcycle: [{value:null,disabled:true}], 
      refterms: [{value:null,disabled:true}], refinpocemail: [{value:null,disabled:true}],
      refpofcname: [{value:null,disabled:true}], refoclname: [{value:null,disabled:true}], 
      refpocemail: [{value:null,disabled:true}], refpocphone: [{value:null,disabled:true}],
      refBillRate: [{value:null,disabled:true}], refimpofcname: [{value:null,disabled:true}], 
      refimoclname: [{value:null,disabled:true}], refimpocemail: [{value:null,disabled:true}],
      refimppocphone: [{value:null,disabled:true}], refdetails: [{value:null,disabled:true}]
    });
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
      this.isPageload=true;
      this.endClientAccount.PlacementAcctContactInfo.push(this.loadContact());
      this.primeVClientAccount.PlacementAcctContactInfo.push(this.loadContact());
      this.mspClientAccount.PlacementAcctContactInfo.push(this.loadContact());
      this.ipClientAccount.PlacementAcctContactInfo.push(this.loadContact());
      this.subPVClientAccount.PlacementAcctContactInfo.push(this.loadContact());
      this.refClientAccount.PlacementAcctContactInfo.push(this.loadContact());
      this.GetAccounts();
      this.getUsers();
      this.getEmployeeCentralUsers();
      this.GetPlacementByIdForOnBoarding();
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
      result.PlacementID = this.Data;
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
          this.placementOnBoarding = response.Data;
          const WAddoutput = [this.placementOnBoarding.Employee.Address1, this.placementOnBoarding.Employee.Address2,this.placementOnBoarding.Employee.City, this.placementOnBoarding.Employee.State,this.placementOnBoarding.Employee.ZipCode].filter(Boolean).join(", ");
          this.formattedAddress = WAddoutput;
          const AAddoutput=[this.placementOnBoarding.Assignment.WLAddress1, this.placementOnBoarding.Assignment.WLAddress2,this.placementOnBoarding.Assignment.WLCity, this.placementOnBoarding.Assignment.WLState,this.placementOnBoarding.Assignment.WLZipCode].filter(Boolean).join(", ");
          this.formattedAssignemntAddress = AAddoutput;
          //this.placementOnBoarding.Employee.WorkStatusExpiry = null;
          //this.placementOnBoarding.Employee.EmpStartDate = null;
          this.placementOnBoarding.Employee.EmployeeType = 'Consultant';
          this.placementOnBoarding.Employee.EmploymentType = this.placementOnBoarding.PlacementType;
          if (this.placementOnBoarding.Assignment) {
            this.placementOnBoarding.Assignment.StartDate = this.placementOnBoarding.StartDate;
            this.placementOnBoarding.Assignment.EndDate = this.placementOnBoarding.EndDate;
            this.placementOnBoarding.Assignment.AssignmentType = this.placementOnBoarding.PlacementType;
          } else {
            this.placementOnBoarding.Assignment = new AssignmentMaster();
          }

          this.OnRequirementChange(Number(this.placementOnBoarding.JobCategory));
          // if (this.placementOnBoarding.JobCategory == "3") {
          // }
          if(this.placementOnBoarding.PlacementType=="C2C"){
            this.isC2CEmployer = true;
          }
          if (this.placementOnBoarding.PlacementAccountMappings.length > 0) {debugger;
            this.placementOnBoarding.PlacementAccountMappings.forEach(element => {
              const acntTypeName = this.getAccounttypeName(element.AccountTypeId);
              if(element.AccountLevel=="job"){
                this.PrepareAccounts(element.AccountTypeId, element);
              }
              else
              {
                this.PrepareCandidateAccounts(element.AccountTypeId, element);
              }
             
              if (element.AccountTypeId != 1) {
                this.EditLayerSelection(acntTypeName,element.AccountLevel);
                if (this.Data.Mode === "Edit") {
                  this.SetBillingAccount(acntTypeName);
                }
              }
            });
          }
          if (this.placementOnBoarding && this.placementOnBoarding.Employee &&
            this.placementOnBoarding.Employee.EmployeeDocuments.length > 0) {debugger;
            this.employeeDocuments = this.DeepCopyForObject(this.placementOnBoarding.Employee.EmployeeDocuments);
            this.empdataSource.data = this.employeeDocuments;
            if (!this.cdRef["distroyed"]) {
              this.cdRef.detectChanges();
            }
          }
          if (this.placementOnBoarding && this.placementOnBoarding.PlacementDocuments &&
            this.placementOnBoarding.PlacementDocuments.length > 0) {debugger;
            this.placementDocuments = this.DeepCopyForObject(this.placementOnBoarding.PlacementDocuments);
            this.dataSource.data = this.placementDocuments;
            if (!this.cdRef["distroyed"]) {
              this.cdRef.detectChanges();
            }
          }
          if (this.placementOnBoarding.StartDate)
            this.placementOnBoarding.StartDate = new Date(this.placementOnBoarding.StartDate.toString())
          if (this.placementOnBoarding.EndDate)
            this.placementOnBoarding.EndDate = new Date(this.placementOnBoarding.EndDate.toString())

          if (this.placementOnBoarding.BillRateEffectiveDate)
            this.placementOnBoarding.BillRateEffectiveDate = new Date(this.placementOnBoarding.BillRateEffectiveDate.toString())

          // if (this.placementOnBoarding.PlacementDocuments.length > 0) {
          //   this.placementDocuments = this.DeepCopyForObject(this.placementOnBoarding.PlacementDocuments);
          //   if (!this.cdRef["distroyed"]) {
          //     this.cdRef.detectChanges();
          //   }
          // }

            this.placementOnBoarding.Employee.DOB = this.placementOnBoarding.Employee.DOB + "T00:00:00";
            if (!isNullOrUndefined(this.placementOnBoarding.Employee.WebsiteUser)) {
              this.createUserAccount = true;
              this.placementOnBoarding.Employee.CreateUserAccount = true;
            }
          
          
        } catch (error) {
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
  EditLayerSelection(type,accountLevel:string) {
    if(accountLevel=="job"){
      switch (type) {
        case "Prime Vendor":
          this.mspFromGroup.get('mspfName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
          this.mspFromGroup.get('msplName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
          this.mspFromGroup.get('mspEmail').setValidators([Validators.required, ValidationService.emailValidator]);
          this.mspFromGroup.get('mspPhone').setValidators([Validators.required]);
          this.isPrimeVendor = true;
          break;
        case "Managed Service Provider (MSP)":
          this.mspFromGroup.get('mspfName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
          this.mspFromGroup.get('msplName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
          this.mspFromGroup.get('mspEmail').setValidators([Validators.required, ValidationService.emailValidator]);
          this.mspFromGroup.get('mspPhone').setValidators([Validators.required]);
          this.isManagedServiceProvider = true;
          break;
        case "Implementation Partner (IP)":
          this.ipFromGroup.get('fipName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
          this.ipFromGroup.get('lipName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
          this.ipFromGroup.get('ipEmail').setValidators([Validators.required, ValidationService.emailValidator]);
          this.ipFromGroup.get('ipPhone').setValidators([Validators.required]);
          this.isImplementationPartner = true;
          break;
        case "Sub Prime Vendor":
          this.subFromGroup.get('fsubName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
          this.subFromGroup.get('lsubName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
          this.subFromGroup.get('subEmail').setValidators([Validators.required, ValidationService.emailValidator]);
          this.subFromGroup.get('subPhone').setValidators([Validators.required]);
          this.isSubPrimeVendor = true;
          break;
        case "Referral Vendor":
          this.refFromGroup.get('frefName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
          this.refFromGroup.get('lrefName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
          this.refFromGroup.get('refEmail').setValidators([Validators.required, ValidationService.emailValidator]);
          this.refFromGroup.get('refPhone').setValidators([Validators.required]);
          this.isReffralVendor = true;
          break;
      }
    }
    else{
      switch (type){
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
  }
  SetBillingAccount(type) {
    switch (type) {
      case "Prime Vendor":
        this.setValidation('Prime');
        this.isbillingPrimeVendor = true;
        this.isbillingManagedServiceProvider = false;
        this.isbillingImplementationPartner = false;
        this.isbillingSubPrimeVendor = false;
        this.isbillingReffralVendor = false;
        break;
      case "Managed Service Provider (MSP)":
        this.isbillingPrimeVendor = false;
        this.isbillingManagedServiceProvider = true;
        this.isbillingImplementationPartner = false;
        this.isbillingSubPrimeVendor = false;
        this.isbillingReffralVendor = false;
        this.setValidation('MSP');
        break;
      case "Implementation Partner (IP)":
        this.isbillingPrimeVendor = false;
        this.isbillingManagedServiceProvider = false;
        this.isbillingImplementationPartner = true;
        this.isbillingSubPrimeVendor = false;
        this.isbillingReffralVendor = false;
        this.setValidation('IP');
        break;
      case "Sub Prime Vendor":
        this.isbillingPrimeVendor = false;
        this.isbillingManagedServiceProvider = false;
        this.isbillingImplementationPartner = false;
        this.isbillingSubPrimeVendor = true;
        this.isbillingReffralVendor = false;
        this.setValidation('Sub');
        break;
      case "Referral Vendor":
        this.isbillingPrimeVendor = false;
        this.isbillingManagedServiceProvider = false;
        this.isbillingImplementationPartner = false;
        this.isbillingSubPrimeVendor = false;
        this.isbillingReffralVendor = true;
        this.setValidation('Ref');
        break;
    }
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
  getUsers() {
    this._service.getAtsSubUsers(this.loginUser.Company.Id).subscribe(response => {
      this.employerProfile = response;
    }, error => {
      this.isPageload=false;
      this._alertService.error(error);
    });
  }
  getEmployeeCentralUsers() {
    this._service.getEmloyeeCentralUsers(this.loginUser.Company.Id).subscribe(response => {
      this.manageEmployerProfile = response.Data.filter(item => item.UserRole == "HR Manager");
      this.financeEmployerProfile = response.Data.filter(item => item.UserRole == "Finance Manager");
      this.trainingEmployerProfile = response.Data.filter(item => item.UserRole == "Training Manager");
    }, error => {
      this.isPageload=false;
      this._alertService.error(error);
    })
  }
  GetAccounts() {
    this._service.GetAccounts(this.loginUser.Company.Id).subscribe(response => {
      this.accountMaster = response;
      this.PepareAccountTypeAccountList();
    }, error => {
      this.isPageload=false;
      this._alertService.error(error);

    })
  }
  PrepareAccounts(id, Account: PlacementAccountMappings) {
    if (Account.PlacementAcctContactInfo.length == 0) {
      Account.PlacementAcctContactInfo.push(this.loadContact());
    }
    switch (id) {
      case 1:
        this.endClientAccount = Account;
        break;
      case 4:
        this.primeVClientAccount = Account;
        break;
      case 2:
        this.mspClientAccount = Account;
        break;
      case 3:
        this.ipClientAccount = Account;
        break;
      case 5:
        this.subPVClientAccount = Account;
        break;
      case 8:
        this.refClientAccount = Account;
        break;
    }
  }

  PrepareCandidateAccounts(id, Account: PlacementAccountMappings){debugger;
    if (Account.PlacementAcctContactInfo.length == 0) {
      Account.PlacementAcctContactInfo.push(this.loadContact());
    }
    switch(id){
      case 7:
        this.candSubVendorClientAccount = Account;
        break;
      case 8:
        this.candRefVendorClientAccount = Account;
        break;  
    }
  }

  SeelectedAccount(event, type) {
    switch (type) {
      case 'end':
        const end = this.EndClientList.find(x => x.AccountID == event.option.id);
        this.endClientAccount = this.GetAccountandContact(end);
        break;
      case 'prime':
        const prime = this.primeClientList.find(x => x.AccountID == event.option.id);
        this.primeVClientAccount = this.GetAccountandContact(prime);
        break;
      case 'msp':
        const msp = this.MSPList.find(x => x.AccountID == event.option.id);
        this.mspClientAccount = this.GetAccountandContact(msp);
        break;
      case 'ip':
        const ip = this.IPList.find(x => x.AccountID == event.option.id);
        this.ipClientAccount = this.GetAccountandContact(ip);
        break;
      case 'sub':
        const subPrime = this.subPrimeVendorList.find(x => x.AccountID == event.option.id);
        this.subPVClientAccount = this.GetAccountandContact(subPrime);
        break;
      case 'ref':
        const Ref = this.RefList.find(x => x.AccountID == event.option.id);
        this.refClientAccount = this.GetAccountandContact(Ref);
        break;
    }
  }

  GetAccountandContact(account) {
    let ClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
    ClientAccount.AccountLevel = "job"
    ClientAccount.AccountName = account.AccountName;
    ClientAccount.AccountID = account.AccountID;
    ClientAccount.Employer = false;
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
  OnRequirementChange(type) {debugger;
    this.placementOnBoarding.JobCategory = type;
    if (type === 2) {
      this.directinternaltType = true;
      this.contractC2CType = false;
    } else if (type === 3) {
      this.directinternaltType = false;
      this.contractC2CType = true;
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  SelectBillingAccount(event, type) {
    if (event.checked) {
      switch (type) {
        case "Prime Vendor":
          this.primeVClientAccount.BillingPOC = new PlacementAcctContactInfo();
          this.primeVClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
          this.isbillingPrimeVendor = true;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = false;
          this.setValidation('Prime');
          break;
        case "MSP":
          this.mspClientAccount.BillingPOC = new PlacementAcctContactInfo();
          this.mspClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = true;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = false;
          this.setValidation('MSP');
          break;
        case "IP":
          this.ipClientAccount.BillingPOC = new PlacementAcctContactInfo();
          this.ipClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = true;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = false;
          this.setValidation('IP');
          break;
        case "Sub Prime Vendor":
          this.subPVClientAccount.BillingPOC = new PlacementAcctContactInfo();
          this.subPVClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = true;
          this.isbillingReffralVendor = false;
          this.setValidation('Sub');
          break;
        case "Referral Vendor":
          this.refClientAccount.BillingPOC = new PlacementAcctContactInfo();
          this.refClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = true;
          this.setValidation('Ref');
          break;
      }
    } else {
      switch (type) {
        case "Prime Vendor":
          this.primeVClientAccount.BillingPOC = new PlacementAcctContactInfo();
          this.primeVClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = false;
          break;
        case "MSP":
          this.mspClientAccount.BillingPOC = new PlacementAcctContactInfo();
          this.mspClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = false;
          break;
        case "IP":
          this.ipClientAccount.BillingPOC = new PlacementAcctContactInfo();
          this.ipClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = false;
          break;
        case "Sub Prime Vendor":
          this.subPVClientAccount.BillingPOC = new PlacementAcctContactInfo();
          this.subPVClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = false;
          break;
        case "Referral Vendor":
          this.refClientAccount.BillingPOC = new PlacementAcctContactInfo();
          this.refClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
          this.isbillingPrimeVendor = false;
          this.isbillingManagedServiceProvider = false;
          this.isbillingImplementationPartner = false;
          this.isbillingSubPrimeVendor = false;
          this.isbillingReffralVendor = false;
          break;
      }
    }
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
  }
  setValidation(type) {
    switch (type) {
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
  }
  PepareAccountTypeAccountList() {
    this.EndClientList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.EndClient);
    this.EndClientOptions = this.EndClientControl.valueChanges.pipe(startWith(''), map(val => this.ecfilter(val)));

    this.primeClientList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.PrimeVendor);
    this.primeClientOptions = this.primeClientControl.valueChanges.pipe(startWith(''), map(val => this.primefilter(val)));

    this.MSPList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.ManagedServiceProvider);
    this.MSPOptions = this.MSPControl.valueChanges.pipe(startWith(''), map(val => this.mspfilter(val)));

    this.IPList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.ImplementationPartner);
    this.IPOptions = this.IPControl.valueChanges.pipe(startWith(''), map(val => this.ipfilter(val)));

    this.subPrimeVendorList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.SubPrimeVendor);
    this.subPrimeVendorOptions = this.subPrimeVendorControl.valueChanges.pipe(startWith(''), map(val => this.subpvfilter(val)));

    this.RefList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.ReferralVendor);
    this.RefOptions = this.RefControl.valueChanges.pipe(startWith(''), map(val => this.reffilter(val)));
  }
  ecfilter(val: string) {
    return this.EndClientList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  primefilter(val: string) {
    return this.primeClientList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  mspfilter(val: string) {
    return this.MSPList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  ipfilter(val: string) {
    return this.IPList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  subpvfilter(val: string) {
    return this.subPrimeVendorList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  reffilter(val: string) {
    return this.RefList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
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

}
