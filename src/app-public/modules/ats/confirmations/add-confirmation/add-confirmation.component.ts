import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import icClose from '@iconify/icons-ic/twotone-close';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { AbstractControl, Form, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { Router } from '@angular/router';
import icBack from '@iconify/icons-ic/twotone-arrow-back';
import { SelectItem } from 'src/@shared/models/SelectItem';    
import { AccountTypes } from 'src/static-data/accounttypes';
import icPerson from '@iconify/icons-ic/twotone-person';
import { Placement, PlacementCandidate, PlacementJob, ConfirmationAccountMappings } from '../../core/models/confirmations';
import { AccountMaster } from  '../../core/models/accountmaster';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { ConfirmationService } from '../../core/http/confirmations.service';
import { LoginUser } from 'src/@shared/models';
import { ValidationService } from 'src/@cv/services/validation.service';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import moment from 'moment';
import { CandidateMaster } from 'src/@shared/models/candidatemaster';  //'src/app-wc/worker-central/core/models/candidatemaster';
import { ConfirmationCandidateExistsComponent } from '../confirmation-candidate-exists/confirmation-candidate-exists.component';
import { SubmissionService } from '../../core/http/submissions.service';
import { MarketingDashboardService } from '../../core/http/marketingdashboard.service';
import { SubUsers } from  '../../core/models/subusers'; 
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { WorkStatusService } from 'src/@shared/http/work-status.service';

@Component({
  selector: 'cv-add-confirmation',
  templateUrl: './add-confirmation.component.html',
  styleUrls: ['./add-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [AccountTypes,ConfirmationService]
})
export class AddConfirmationComponent implements OnInit {

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

  POCClientControl: FormControl = new FormControl();
  POCClientOptions: Observable<any[]>;

   EndclientFromGroup:FormGroup;
   primeVendorFromGroup: FormGroup;
   mspFromGroup: FormGroup;
   ipFromGroup: FormGroup;
   subFromGroup: FormGroup;
   refFromGroup: FormGroup;
   confirmationFormGroup: FormGroup;


  public enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  searchCtrl = new FormControl();
  loginUser: LoginUser;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icBack = icBack
  icClose = icClose;
  icPerson = icPerson
  public thirdTypeList: SelectItem[] = [];
  isPrimeVendor: boolean = false;
  isManagedServiceProvider: boolean = false;
  isImplementationPartner: boolean = false;
  isSubPrimeVendor: boolean = false;
  isReffralVendor: boolean = false;
  public confirmation: Placement = new Placement();
  public confirmationJob: PlacementJob = new PlacementJob();
  public confirmationCandidate: PlacementCandidate = new PlacementCandidate();
  public endClientAccount: ConfirmationAccountMappings = new ConfirmationAccountMappings();
  public primeVClientAccount: ConfirmationAccountMappings = new ConfirmationAccountMappings();
  public mspClientAccount: ConfirmationAccountMappings = new ConfirmationAccountMappings();
  public ipClientAccount: ConfirmationAccountMappings = new ConfirmationAccountMappings();
  public subPVClientAccount: ConfirmationAccountMappings = new ConfirmationAccountMappings();
  public refClientAccount: ConfirmationAccountMappings = new ConfirmationAccountMappings();
  directinternaltType: boolean = false;
  contractC2CType: boolean = true;
  SelectedType: Number = 3;
  public workStatusFields: SelectItem[] = [];
  public status_bgClass: any = 'bg-amber';
  public accountMaster: AccountMaster[] = [];
  public EndClient: number;
  existingCandidate:CandidateMaster = new CandidateMaster();
  isLoading: boolean = false;
  InitialEmailId:string=null;
  IsLocation:boolean=false;
  title:string="Add Confirmaton";
  salesTeam: SubUsers[];
  AssigneName:string;
  SelectedPOC:string=null;
  IsEmailDisabled:boolean=false;
  @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;
  constructor(
    @Inject(MAT_DIALOG_DATA) public def_Input: any,
    private dialogRef: MatDialogRef<AddConfirmationComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private accountTypes: AccountTypes,
    private _service: ConfirmationService,
    private _submissionService:SubmissionService,
    private _mrktservice: MarketingDashboardService,
    private workStatusService: WorkStatusService
  ) {
    this.salesTeam=[];
    this.thirdTypeList = [];
    this.thirdTypeList = this.accountTypes.ThirdPartyClient;
    this.confirmationFormGroup = this.fb.group({
      JobTitle: [null, [Validators.required]],
      DurationInMonths: [null,[Validators.required,ValidationService.numberWithDecimalValidator]],
      description: [null],
      wpstexpiration: [null, [Validators.required]],
      wpenexpiration: [null],
      canfname: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      canlname: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      ExperienceYears: [null, [Validators.required,ValidationService.numberWithDecimalValidator]],
      PrimaryPhoneNumber: [null, [Validators.required]],
      Email: [null, [Validators.required, Validators.email]],
      wpexpiration: [null, [Validators.required,ValidationService.ValidatWorkPermitExpiryDate]],
      WorkStatus: [null, [Validators.required]],
      rate: [null,[ValidationService.NumberWith2digits]],
      PocName:[null,[Validators.required]]
    }, {validator: this.ValidateStartEndDate})
    this.EndclientFromGroup = this.fb.group({
      EndclientName:[null],
      fEndclientName: [null],
      lEndclientName: [null],
      EEndclientmail: [null],
      Endclientphone: [null],
    });
    this.primeVendorFromGroup = this.fb.group({
      PEndclientName:[null],
      fName: [null],
      lName: [null],
      Email: [null],
      Phone: [null],
    });
    this.mspFromGroup = this.fb.group({
      mEndclientName:[null],
      fmspName: [null],
      lmspName: [null],
      mspEmail: [null],
      mspPhone: [null],
    });
    this.ipFromGroup = this.fb.group({
      iEndclientName:[null],
      fipName: [null],
      lipName: [null],
      ipEmail: [null],
      ipPhone: [null],
    });
    this.subFromGroup = this.fb.group({
      subEndclientName:[null],
      fsubName: [null],
      lsubName: [null],
      subEmail: [null],
      subPhone: [null],
    });
    this.refFromGroup = this.fb.group({
      refEndclientName:[null],
      frefName: [null],
      lrefName: [null],
      refEmail: [null],
      refPhone: [null],
    });

  }


  ngOnInit(): void {debugger;
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.endClientAccount.SalesPOC=this.loadContact();
      this.primeVClientAccount.SalesPOC=this.loadContact();
      this.mspClientAccount.SalesPOC=this.loadContact();
      this.ipClientAccount.SalesPOC=this.loadContact();
      this.subPVClientAccount.SalesPOC=this.loadContact();
      this.refClientAccount.SalesPOC=this.loadContact();
      this.getBenchSubUsers();
      this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id).subscribe(data => {
        this.workStatusFields = data;
      });
    }
  }
  loadContact() {
    const contact = {
        ConfirmationContactID:0,
        AccountID:0,
        FirstName:null,
        MiddleName:null,
        LastName:null,
        Email:null,
        Phonenumber:null,
        ContactType:0,
        CreatedBy:null,
        CreatedDate:new Date(),
        UpdatedBy:null,
        UpdatedDate :new Date(),
        ConfirmationAccountMappingID:0,
        ContactID :0,
    }
    return contact;
  }
  GetAccounts() {
    this._service.GetAccounts(this.loginUser.Company.Id).subscribe(response => {
      this.accountMaster = response;
      this.PepareAccountTypeAccountList();
      if(this.def_Input.SubmissionId!=0 && this.def_Input.src=='submission'){
        this.IsEmailDisabled=true;
        this.BindSubmissionToConfiramtion();
      }
      else if(this.def_Input.ConfirmationId!=0 && this.def_Input.src=='editconfirmation'){
        this.title="Edit Confirmaton";
        this.IsEmailDisabled=true;
        this.GetConfirmation();
      }
      else
      {
        this.SelectedType=3;
        this.confirmation.JobCategory = 3;
        this.OnRequirementChange(3);
      }
    })
  }
  OnRequirementChange(type) {
    this.confirmation.JobCategory = type;
    if (type == 2) {
      this.EndclientFromGroup.get('EndclientName').setValidators([Validators.required]);
      this.EndclientFromGroup.get('fEndclientName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
      this.EndclientFromGroup.get('lEndclientName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
      this.EndclientFromGroup.get('EEndclientmail').setValidators([Validators.required,Validators.email]);
      this.EndclientFromGroup.get('Endclientphone').setValidators([Validators.required]);
      this.primeVendorFromGroup.get('PEndclientName').clearValidators();
      this.primeVendorFromGroup.get('fName').clearValidators();
      this.primeVendorFromGroup.get('lName').clearValidators();
      this.primeVendorFromGroup.get('Email').clearValidators();
      this.primeVendorFromGroup.get('Phone').clearValidators();
      this.directinternaltType = true;
      this.contractC2CType = false;
      this.DynamicValidation('prime');
      this.DynamicValidation('end');
    } else if (type == 3) {
      this.primeVendorFromGroup.get('PEndclientName').setValidators([Validators.required]);
      this.primeVendorFromGroup.get('fName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
      this.primeVendorFromGroup.get('lName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
      this.primeVendorFromGroup.get('Email').setValidators([Validators.required,Validators.email]);
      this.primeVendorFromGroup.get('Phone').setValidators([Validators.required]);
      this.EndclientFromGroup.get('EndclientName').clearValidators();
      this.EndclientFromGroup.get('fEndclientName').clearValidators();
      this.EndclientFromGroup.get('lEndclientName').clearValidators();
      this.EndclientFromGroup.get('EEndclientmail').clearValidators();
      this.EndclientFromGroup.get('Endclientphone').clearValidators();

      this.directinternaltType = false;
      this.contractC2CType = true;
      this.DynamicValidation('end');
      this.DynamicValidation('prime');
    }
    
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  addLayerSelection(type) {
    switch (type.label) {
      case "Managed Service Provider (MSP)":
        this.mspFromGroup.get('mEndclientName').setValidators([Validators.required]);
        this.mspFromGroup.get('fmspName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
        this.mspFromGroup.get('lmspName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
        this.mspFromGroup.get('mspEmail').setValidators([Validators.required,Validators.email]);
        this.mspFromGroup.get('mspPhone').setValidators([Validators.required]);
        this.isManagedServiceProvider = true;
        break;
      case "Implementation Partner (IP)":
        this.ipFromGroup.get('iEndclientName').setValidators([Validators.required]);
        this.ipFromGroup.get('fipName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
        this.ipFromGroup.get('lipName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
        this.ipFromGroup.get('ipEmail').setValidators([Validators.required,Validators.email]);
        this.ipFromGroup.get('ipPhone').setValidators([Validators.required]);
        this.isImplementationPartner = true;
        break;
      case "Sub Prime Vendor":
        this.subFromGroup.get('subEndclientName').setValidators([Validators.required]);
        this.subFromGroup.get('fsubName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
        this.subFromGroup.get('lsubName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
        this.subFromGroup.get('subEmail').setValidators([Validators.required,Validators.email]);
        this.subFromGroup.get('subPhone').setValidators([Validators.required]);
        this.isSubPrimeVendor = true;
        break;
      case "Referral Vendor":
        this.refFromGroup.get('refEndclientName').setValidators([Validators.required]);
        this.refFromGroup.get('frefName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
        this.refFromGroup.get('lrefName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
        this.refFromGroup.get('refEmail').setValidators([Validators.required,Validators.email]);
        this.refFromGroup.get('refPhone').setValidators([Validators.required]);
        this.isReffralVendor = true;
        break;
    }
    this.DynamicValidation(type);
  }
  onRemoveClick(type) {
    switch (type) {
      case "MSP":
        this.mspClientAccount = new ConfirmationAccountMappings();
        this.mspFromGroup.get('mEndclientName').clearValidators();
        this.mspFromGroup.get('fmspName').clearValidators();
        this.mspFromGroup.get('lmspName').clearValidators();
        this.mspFromGroup.get('mspEmail').clearValidators();
        this.mspFromGroup.get('mspPhone').clearValidators();
        this.isManagedServiceProvider = false;
        break;
      case "IP":
        this.ipClientAccount = new ConfirmationAccountMappings();
        this.ipFromGroup.get('iEndclientName').clearValidators();
        this.ipFromGroup.get('fipName').clearValidators();
        this.ipFromGroup.get('lipName').clearValidators();
        this.ipFromGroup.get('ipEmail').clearValidators();
        this.ipFromGroup.get('ipPhone').clearValidators();
        this.isImplementationPartner = false;
        break;
      case "Sub Prime Vendor":
        this.subPVClientAccount = new ConfirmationAccountMappings();
        this.subFromGroup.get('subEndclientName').clearValidators();
        this.subFromGroup.get('fsubName').clearValidators();
        this.subFromGroup.get('lsubName').clearValidators();
        this.subFromGroup.get('subEmail').clearValidators();
        this.subFromGroup.get('subPhone').clearValidators();
        this.isSubPrimeVendor = false;
        break;
      case "Referral Vendor":
        this.refClientAccount = new ConfirmationAccountMappings();
        this.refFromGroup.get('refEndclientName').clearValidators();
        this.refFromGroup.get('frefName').clearValidators();
        this.refFromGroup.get('lrefName').clearValidators();
        this.refFromGroup.get('refEmail').clearValidators();
        this.refFromGroup.get('refPhone').clearValidators();
        this.isReffralVendor = false;
        break;
    }
    this.DynamicValidation(type);
  }
  DynamicValidation(type) {
    switch (type) {
      case "end":
        this.EndclientFromGroup.controls['EndclientName'].updateValueAndValidity();
        this.EndclientFromGroup.controls['fEndclientName'].updateValueAndValidity();
        this.EndclientFromGroup.controls['lEndclientName'].updateValueAndValidity();
        this.EndclientFromGroup.controls['EEndclientmail'].updateValueAndValidity();
        this.EndclientFromGroup.controls['Endclientphone'].updateValueAndValidity();
        break;
      case "prime":
        this.primeVendorFromGroup.controls['PEndclientName'].updateValueAndValidity();
        this.primeVendorFromGroup.controls['fName'].updateValueAndValidity();
        this.primeVendorFromGroup.controls['lName'].updateValueAndValidity();
        this.primeVendorFromGroup.controls['Email'].updateValueAndValidity();
        this.primeVendorFromGroup.controls['Phone'].updateValueAndValidity();
        break;
      case "MSP":
        this.mspFromGroup.controls['mEndclientName'].updateValueAndValidity();
        this.mspFromGroup.controls['fmspName'].updateValueAndValidity();
        this.mspFromGroup.controls['lmspName'].updateValueAndValidity();
        this.mspFromGroup.controls['mspEmail'].updateValueAndValidity();
        this.mspFromGroup.controls['mspPhone'].updateValueAndValidity();
        break;
      case "IP":
        this.ipFromGroup.controls['iEndclientName'].updateValueAndValidity();
        this.ipFromGroup.controls['fipName'].updateValueAndValidity();
        this.ipFromGroup.controls['lipName'].updateValueAndValidity();
        this.ipFromGroup.controls['ipEmail'].updateValueAndValidity();
        this.ipFromGroup.controls['ipPhone'].updateValueAndValidity();
        break;
      case "Sub Prime Vendor":
        this.subFromGroup.controls['subEndclientName'].updateValueAndValidity();
        this.subFromGroup.controls['fsubName'].updateValueAndValidity();
        this.subFromGroup.controls['lsubName'].updateValueAndValidity();
        this.subFromGroup.controls['subEmail'].updateValueAndValidity();
        this.subFromGroup.controls['subPhone'].updateValueAndValidity();
        break;
      case "Referral Vendor":
        this.refFromGroup.controls['refEndclientName'].updateValueAndValidity();
        this.refFromGroup.controls['frefName'].updateValueAndValidity();
        this.refFromGroup.controls['lrefName'].updateValueAndValidity();
        this.refFromGroup.controls['refEmail'].updateValueAndValidity();
        this.refFromGroup.controls['refPhone'].updateValueAndValidity();
        break;
    }
  }
  SeelectedAccount(event, type) {debugger;
      switch (type) {
        case 'end':
          const end = this.EndClientList.find(x => x.AccountID == event.option.id);
          if(this.endClientAccount.ConfirmationAccountMappingID!=0)
          this.endClientAccount = this.UpdateAccountandContact(end,this.endClientAccount);
          else
          this.endClientAccount = this.GetAccountandContact(end);
          break;
        case 'prime':
          const prime = this.primeClientList.find(x => x.AccountID == event.option.id);
          if(this.primeVClientAccount.ConfirmationAccountMappingID!=0)
          this.primeVClientAccount = this.UpdateAccountandContact(prime,this.primeVClientAccount);
          else
          this.primeVClientAccount = this.GetAccountandContact(prime);
          break;
        case 'msp':
          const msp = this.MSPList.find(x => x.AccountID == event.option.id);
          if(this.mspClientAccount.ConfirmationAccountMappingID!=0)
          this.mspClientAccount = this.UpdateAccountandContact(msp,this.mspClientAccount);
          else
          this.mspClientAccount = this.GetAccountandContact(msp);
          break;
        case 'ip':
          const ip = this.IPList.find(x => x.AccountID == event.option.id);
          if(this.ipClientAccount.ConfirmationAccountMappingID!=0)
          this.ipClientAccount = this.UpdateAccountandContact(ip,this.ipClientAccount);
          else
          this.ipClientAccount = this.GetAccountandContact(ip);
          break;
        case 'sub':
          const subPrime = this.subPrimeVendorList.find(x => x.AccountID == event.option.id);
          if(this.subPVClientAccount.ConfirmationAccountMappingID!=0)
          this.subPVClientAccount = this.UpdateAccountandContact(subPrime,this.subPVClientAccount);
          else
          this.subPVClientAccount = this.GetAccountandContact(subPrime);
          break;
        case 'ref':
          const Ref = this.RefList.find(x => x.AccountID == event.option.id);
          if(this.refClientAccount.ConfirmationAccountMappingID!=0)
          this.refClientAccount = this.UpdateAccountandContact(Ref,this.refClientAccount);
          else
          this.refClientAccount = this.GetAccountandContact(Ref);
          break;
      }
  }
  submitConfirmation() {
    this.isLoading=true;
    this.confirmation.ConfirmationAccountMappings = [];
    this.confirmation.CompanyID = this.loginUser.Company.Id;
    this.confirmation.CreatedBy = this.loginUser.UserId;
    this.confirmation.ConfirmationType="W2";
    this.confirmation.BillRateType=1;
    this.confirmation.CreatedDate = new Date();
    this.confirmation.IsPlacement=false;
    this.confirmation.Status=1;
    this.confirmation.ConfirmationPOC = this.SelectedPOC;//this.loginUser.UserId;
    this.confirmationCandidate.CompanyID = this.loginUser.Company.Id;
    this.confirmationCandidate.CreatedBy = this.loginUser.UserId;
    this.confirmationCandidate.CreatedDate = new Date();
    this.confirmation.Candidate = this.confirmationCandidate;
    this.confirmationJob.CompanyID = this.loginUser.Company.Id;
    this.confirmationJob.CreatedBy = this.loginUser.UserId;
    this.confirmationJob.CreatedDate = new Date();
    this.confirmationJob.JobTypeID=3;
    this.confirmation.Job = this.confirmationJob;
    let StartDate: any = moment(this.confirmation.StartDate).format("YYYY-MM-DDTHH:mm:ss.ms")
    this.confirmation.StartDate = StartDate;
    if (!isNullOrUndefined(this.confirmation.EndDate)) {
      let EndDate: any = moment(this.confirmation.EndDate).format("YYYY-MM-DDTHH:mm:ss.ms")
      this.confirmation.EndDate = EndDate;
    }
    this.confirmation.JobCategory=this.confirmation.JobCategory;
    if (this.confirmation.JobCategory === 3) {

      if (this.endClientAccount.AccountID > 0) {
        this.endClientAccount.MappingStatus=true;
        const account = this.DeepCopyForObject(this.endClientAccount);
        this.confirmation.ConfirmationAccountMappings.push(account)
      } else if (this.endClientAccount.AccountID == 0 && !isNullOrUndefined(this.endClientAccount.AccountName) && this.endClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.EndClient, this.endClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.confirmation.ConfirmationAccountMappings.push(account)
      }
      if (this.mspClientAccount.AccountID > 0) {
        this.mspClientAccount.MappingStatus=true;
        const account = this.DeepCopyForObject(this.mspClientAccount);
        this.confirmation.ConfirmationAccountMappings.push(account)
      } else if (this.mspClientAccount.AccountID == 0 && !isNullOrUndefined(this.mspClientAccount.AccountName) && this.mspClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.ManagedServiceProvider, this.mspClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.confirmation.ConfirmationAccountMappings.push(account)
      }
      if (this.ipClientAccount.AccountID > 0) {
        this.ipClientAccount.MappingStatus=true;
        const account = this.DeepCopyForObject(this.ipClientAccount);
        this.confirmation.ConfirmationAccountMappings.push(account)
      } else if (this.ipClientAccount.AccountID == 0 && !isNullOrUndefined(this.ipClientAccount.AccountName) && this.ipClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.ImplementationPartner, this.ipClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.confirmation.ConfirmationAccountMappings.push(account);
      }
      if (this.subPVClientAccount.AccountID > 0) {
        this.subPVClientAccount.MappingStatus=true;
        const account = this.DeepCopyForObject(this.subPVClientAccount);
        this.confirmation.ConfirmationAccountMappings.push(account)
      } else if (this.subPVClientAccount.AccountID == 0 && !isNullOrUndefined(this.subPVClientAccount.AccountName) && this.subPVClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.SubPrimeVendor, this.subPVClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.confirmation.ConfirmationAccountMappings.push(account);
      }
      if (this.primeVClientAccount.AccountID > 0) {
        this.primeVClientAccount.MappingStatus=true;
        const account = this.DeepCopyForObject(this.primeVClientAccount);
        this.confirmation.ConfirmationAccountMappings.push(account)
      } else if (this.primeVClientAccount.AccountID == 0 && !isNullOrUndefined(this.primeVClientAccount.AccountName) && this.primeVClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.PrimeVendor, this.primeVClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.confirmation.ConfirmationAccountMappings.push(account);
      }
      if (this.refClientAccount.AccountID > 0) {
        this.refClientAccount.MappingStatus=true;
        const account = this.DeepCopyForObject(this.refClientAccount);
        this.confirmation.ConfirmationAccountMappings.push(account)
      } else if (this.refClientAccount.AccountID == 0 && !isNullOrUndefined(this.refClientAccount.AccountName) && this.refClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.ReferralVendor, this.refClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.confirmation.ConfirmationAccountMappings.push(account);
      }
      this.confirmation.ConfirmationAccountMappings=this.checkAccountName(this.confirmation.ConfirmationAccountMappings);
    }
    else{
      if (this.endClientAccount.AccountID > 0) {
        this.endClientAccount.MappingStatus=true;
        const account = this.DeepCopyForObject(this.endClientAccount);
        this.confirmation.ConfirmationAccountMappings.push(account)
      } else if (this.endClientAccount.AccountID == 0 && !isNullOrUndefined(this.endClientAccount.AccountName) && this.endClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.EndClient, this.endClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.confirmation.ConfirmationAccountMappings.push(account)
      }

      this.confirmation.ConfirmationAccountMappings=this.checkAccountName(this.confirmation.ConfirmationAccountMappings);
    }

    if(this.def_Input.SubmissionId!=0 && this.def_Input.src=='submission'){
      this.saveConfirmation();
    }
    else if(this.def_Input.ConfirmationId!=0 && this.def_Input.src=='editconfirmation'){
      this.EditConfirmation();
    }
    else if(this.def_Input.ConfirmationId==0 && this.def_Input.SubmissionId==0 && this.def_Input.src=='Addconfirmation'){
      this.saveConfirmation();
    }
  }
  saveConfirmation() {
    this._service.SaveConfirmation(this.confirmation).subscribe(response => {
      if(response.IsError == false){
        this._alertService.success(response.SuccessMessage);
        this.isLoading=false;
        this.confirmationFormGroup.reset();
        this.primeVendorFromGroup.reset();
        this.mspFromGroup.reset();
        this.ipFromGroup.reset();
        this.subFromGroup.reset();
        this.refFromGroup.reset();
        this.dialogRef.close(true);
      }
      else{
        this._alertService.error(response.ErrorMessage);
        this.isLoading = false;
      }
      
    }, error => {
      this._alertService.error(error);
      this.isLoading=false;
    })
  }
  EditConfirmation() {
    this.confirmation.UpdatedBy = this.loginUser.UserId;
    this._service.EditConfirmation(this.confirmation).subscribe(response => {
      if (response.IsError == false) {
        this._alertService.success(response.SuccessMessage);
        this.isLoading = false;
        this.confirmationFormGroup.reset();
        this.primeVendorFromGroup.reset();
        this.mspFromGroup.reset();
        this.ipFromGroup.reset();
        this.subFromGroup.reset();
        this.refFromGroup.reset();
        this.dialogRef.close(true);
      }
      else {
        this._alertService.error(response.ErrorMessage);
        this.isLoading = false;
      }
    }, error => {
      this._alertService.error(error);
      this.isLoading = false;
    })
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
  inputAssignAddress(event) {
    this.getAssignAddress(event);
  }
  getAssignAddress(event) {
    let data = event.address_components
    this.confirmationJob.Location = "";
    this.confirmationJob.City = "";
    this.confirmationJob.State = "";
    this.confirmationJob.Country = "";
    this.confirmationJob.ZipCode = "";
    if (data && data.length > 0) {
      for (let address of data) {
         if ((address.types.includes("sublocality") || (address.types.includes("locality")))) {
          this.confirmationJob.City = address.long_name;
        } else if (address.types.includes("administrative_area_level_1")) {
          this.confirmationJob.State = address.short_name;
        } else if (address.types.includes("country")) {
          this.confirmationJob.Country = address.short_name;
        } else if (address.types.includes("postal_code")) {
          this.confirmationJob.ZipCode = address.long_name;
        }
      }
      this.confirmationJob.Location = this.confirmationJob.City + ', ' + this.confirmationJob.State;
      this.IsLocation=true;
    }
    else{
      event.target.value=null;
      this.confirmationJob.Location=null;
      this.IsLocation=false;
    }
   
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  UpdateAccountandContact(account,ExistingAccountMapping:ConfirmationAccountMappings) {debugger;
    //let ClientAccount: ConfirmationAccountMappings = new ConfirmationAccountMappings();
    ExistingAccountMapping.AccountLevel = "job"
    ExistingAccountMapping.AccountName = account.AccountName;
    ExistingAccountMapping.AccountID = account.AccountID;
    ExistingAccountMapping.Employer = false;
    ExistingAccountMapping.AccountTypeId = account.AccountTypeID;
    ExistingAccountMapping.CreatedDate = account.CreatedDate;
    //ClientAccount.ConfirmationAccountMappingID = account.ConfirmationAccountMappingID;
    ExistingAccountMapping.MappingStatus = account.MappingStatus;
    //ExistingAccountMapping.ConfirmationID = account.ConfirmationID;
    if(account.AccountContacts.length > 0 ){
      ExistingAccountMapping.SalesPOC = account.AccountContacts[0];
    } 
    else {
      const contact = {
        ConfirmationContactID:0,
        AccountID:0,
        FirstName:null,
        MiddleName:null,
        LastName:null,
        Email:null,
        Phonenumber:null,
        ContactType:0,
        CreatedBy:this.loginUser.UserId,
        CreatedDate:new Date(),
        UpdatedBy:null,
        UpdatedDate :new Date(),
        ConfirmationAccountMappingID:0,
        ContactID :0,
      }
      ExistingAccountMapping.SalesPOC=contact;
    }
    return ExistingAccountMapping;
  }


  GetAccountandContact(account) {
    let ClientAccount: ConfirmationAccountMappings = new ConfirmationAccountMappings();
    ClientAccount.AccountLevel = "job"
    ClientAccount.AccountName = account.AccountName;
    ClientAccount.AccountID = account.AccountID;
    ClientAccount.Employer = false;
    ClientAccount.AccountTypeId = account.AccountTypeID;
    ClientAccount.CreatedBy = account.CreatedBy;
    ClientAccount.CreatedDate = account.CreatedDate;
    if (account.AccountContacts.length > 0) {
      ClientAccount.SalesPOC=account.AccountContacts[0];
    } else {
      const contact = {
        ConfirmationContactID:0,
        AccountID:0,
        FirstName:null,
        MiddleName:null,
        LastName:null,
        Email:null,
        Phonenumber:null,
        ContactType:0,
        CreatedBy:this.loginUser.UserId,
        CreatedDate:new Date(),
        UpdatedBy:null,
        UpdatedDate :new Date(),
        ConfirmationAccountMappingID:0,
        ContactID :0,
      }
      ClientAccount.SalesPOC=contact;
    }
    return ClientAccount;
  }
  prepareAccount(AccountType, acunt: ConfirmationAccountMappings) {
    let Account: ConfirmationAccountMappings = new ConfirmationAccountMappings();
    Account = acunt;
    Account.CreatedDate = new Date();
    Account.CreatedBy = this.loginUser.UserId;
    Account.AccountTypeId = AccountType;
    Account.Employer = false;
    Account.AccountLevel = "job";
    Account.MappingStatus=true;
      let contact = {
        ConfirmationContactID:0,
        AccountID:0,
        FirstName:acunt.SalesPOC.FirstName,
        MiddleName:null,
        LastName:acunt.SalesPOC.LastName,
        Email:acunt.SalesPOC.Email,
        Phonenumber:acunt.SalesPOC.Phonenumber,
        ContactType:0,
        CreatedBy:this.loginUser.UserId,
        CreatedDate:new Date(),
        UpdatedBy:this.loginUser.UserId,
        UpdatedDate :new Date(),
        ConfirmationAccountMappingID:0,
        ContactID :0,
      }
      Account.SalesPOC=contact
    
    return Account;
  }
  PhonenumberFormate(type) {
    switch (type) {
      case 'prime':
        this.primeVClientAccount.SalesPOC.Phonenumber = this.PhoneValid(this.primeVClientAccount.SalesPOC.Phonenumber);
        break;
      case 'msp':
        this.mspClientAccount.SalesPOC.Phonenumber = this.PhoneValid(this.mspClientAccount.SalesPOC.Phonenumber);
        break;
      case 'ip':
        this.ipClientAccount.SalesPOC.Phonenumber = this.PhoneValid(this.ipClientAccount.SalesPOC.Phonenumber);
        break;
      case 'sub':
        this.subPVClientAccount.SalesPOC.Phonenumber = this.PhoneValid(this.subPVClientAccount.SalesPOC.Phonenumber);
        break;
      case 'ref':
        this.refClientAccount.SalesPOC.Phonenumber = this.PhoneValid(this.refClientAccount.SalesPOC.Phonenumber);
        break;
      case 'cand':
        this.confirmationCandidate.PrimaryPhoneNumber = this.PhoneValid(this.confirmationCandidate.PrimaryPhoneNumber);
        break;
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
  private DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }
  private checkAccountName(accountLayer) {
    accountLayer.forEach(element => {
      if (this.accountMaster.findIndex(x => x.AccountName.toLocaleLowerCase() === element.AccountName.toLocaleLowerCase()) === -1) {
        element.AccountID = 0;
        element.CreatedDate = new Date();
        element.CreatedBy = this.loginUser.UserId;
      }
    })
    return accountLayer;
  }

  async CheckCandidateByEmail() {
    if (!isNullOrUndefined(this.confirmationCandidate.Email)){
    
    const CandidateSearchVM = {
      Email: this.confirmationCandidate.Email.trim(),
      CompanyId: this.loginUser.Company.Id
    }
    this.existingCandidate =new CandidateMaster();
    let response = await this._service.SyncCheckCandidateByEmail(CandidateSearchVM);
    if(response.IsError==false){
      this.existingCandidate = response.Data;
      if(this.existingCandidate.CandidateID > 0){
        this.dialog.open(ConfirmationCandidateExistsComponent, { width: '60%', panelClass: "dialog-class",disableClose:true,data:this.existingCandidate }).afterClosed().subscribe((confirmation) => {
          if (confirmation) {
            if(confirmation==="Existing Candidate"){
              this.confirmationCandidate.CandidateID=this.existingCandidate.CandidateID;
              this.confirmationCandidate.FirstName=this.existingCandidate.FirstName;
              this.confirmationCandidate.LastName=this.existingCandidate.LastName;
              this.confirmationCandidate.Email=this.existingCandidate.Email;
              this.confirmationCandidate.PrimaryPhoneNumber=this.existingCandidate.PrimaryPhoneNumber;
              this.confirmationCandidate.WorkStatus=this.existingCandidate.WorkStatus;
              this.confirmationCandidate.WorkStatusExpiry=this.existingCandidate.WorkStatusExpiry;
              this.confirmationCandidate.ExperienceYears=this.existingCandidate.ExperienceYears;
              
            }else if(confirmation==="Update"){
              this.confirmationCandidate.CandidateID=this.existingCandidate.CandidateID;
              
            }else if(confirmation==="Cancel"){
              this.confirmationCandidate.Email="";
              return true;
            }
          }
          if (!this.cdRef["distroyed"]) {
            this.cdRef.detectChanges();
          }
        });
      }
    }
    else{
      this._alertService.error(response.ErrorMessage);
      return false;
    }
  }
}

ValidateStartEndDate(group: FormGroup) {
  const start = group.controls.wpstexpiration;
  const end = group.controls.wpenexpiration;
  let StartDate:any; let EndDate:any
  if(start.value !== null){
    StartDate = moment(start.value).format("YYYY-MM-DDTHH:mm:ss.ms")
  }
  if(end.value!==null){
    EndDate = moment(end.value).format("YYYY-MM-DDTHH:mm:ss.ms")
  }
  
  if (!StartDate || !EndDate) {
    return null;
  }
  if (StartDate >= EndDate) {
    return { greaterThan: true };
  }
  return null;

  // return StartDate !== null && EndDate !== null && StartDate < EndDate
  //   ? null : { dateValid: true };
}

public findInvalidControls() {debugger;
  const invalid = [];
  const controls = this.EndclientFromGroup.controls;
  for (const name in controls) {
      if (controls[name].invalid) {
          invalid.push(name);
      }
  }


  const control1 = this.confirmationFormGroup.controls;
  for (const name in control1) {
      if (control1[name].invalid) {
          invalid.push(name);
      }
  }

  const control2 = this.primeVendorFromGroup.controls;
  for (const name in control2) {
      if (control2[name].invalid) {
          invalid.push(name);
      }
  }
  console.log(invalid);

  return invalid;
}

  BindSubmissionToConfiramtion() {
    this._submissionService.MigrateToConfirmation(this.def_Input.SubmissionId).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.confirmation = response.Data; debugger;
        this.SelectedPOC = this.confirmation.ConfirmationPOC;
        let selectedUser = this.salesTeam.find(x => x.UserId == this.confirmation.ConfirmationPOC);
        if (selectedUser != null) {
          this.AssigneName = selectedUser.FullName;
        }
        this.confirmationJob = this.confirmation.Job;
        if (!isNullOrUndefined(this.confirmationJob.City) && !isNullOrUndefined(this.confirmationJob.State)) {
          this.confirmationJob.Location = this.confirmationJob.City + ", " + this.confirmationJob.State;
          this.IsLocation=true;
        }
        this.confirmationCandidate = this.confirmation.Candidate;
        this.InitialEmailId = this.confirmation.Candidate.Email;
        let StartDate: any = moment(this.confirmation.StartDate).format("YYYY-MM-DDTHH:mm:ss.ms")
        this.confirmation.StartDate = StartDate;
        if (!isNullOrUndefined(this.confirmation.EndDate)) {
          let EndDate: any = moment(this.confirmation.EndDate).format("YYYY-MM-DDTHH:mm:ss.ms")
          this.confirmation.EndDate = EndDate;
        }
        this.SelectedType = Number(this.confirmation.JobCategory);
        this.OnRequirementChange(this.confirmation.JobCategory);
        this.confirmation.ConfirmationAccountMappings.forEach(account => {
          this.EditAccount(account, account.AccountTypeId);
            let type = {
              label: this.accountTypes.ThirdPartyClientList.find(x => x.value == account.AccountTypeId).label
            }
            this.addLayerSelection(type);
        });
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this._alertService.error(error);
    })
  }

  displayFn(user?: SubUsers): string | undefined {
    return user ? user.UserId : undefined;
  }

  GetConfirmation() {
    this._service.GetConfirmation(this.loginUser.Company.Id, this.def_Input.ConfirmationId).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {debugger;
        this.confirmation = response.Data;
        this.InitialEmailId = this.confirmation.Candidate.Email;
        this.SelectedPOC = this.confirmation.ConfirmationPOC;
        this.SelectedType = Number(this.confirmation.JobCategory);
        this.OnRequirementChange(this.confirmation.JobCategory);
        this.confirmationJob = this.confirmation.Job;
        if (!isNullOrUndefined(this.confirmationJob.City) && !isNullOrUndefined(this.confirmationJob.State)) {
          this.confirmationJob.Location = this.confirmationJob.City + ", " + this.confirmationJob.State;
          this.IsLocation = true;
        }
        this.confirmationCandidate = this.confirmation.Candidate;
        let StartDate: any = moment(this.confirmation.StartDate).format("YYYY-MM-DDTHH:mm:ss.ms")
        this.confirmation.StartDate = StartDate;
        if (!isNullOrUndefined(this.confirmation.EndDate)) {
          let EndDate: any = moment(this.confirmation.EndDate).format("YYYY-MM-DDTHH:mm:ss.ms")
          this.confirmation.EndDate = EndDate;
        }

        let selectedUser = this.salesTeam.find(x => x.UserId == this.confirmation.ConfirmationPOC);
        if (selectedUser != null) {
          this.AssigneName = selectedUser.FullName;
        }

        this.confirmation.ConfirmationAccountMappings.forEach(account => {
          this.EditAccount(account, account.AccountTypeId);
          let type = {
            label: this.accountTypes.ThirdPartyClientList.find(x => x.value == account.AccountTypeId).label
          }
          this.addLayerSelection(type);
        });

        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this._alertService.error(error);
    })
  }

  EditAccount(account, type) {debugger;
    switch (type) {
      case 1:
        this.endClientAccount = this.EditAccountandContact(account);
        break;
      case 2:
        this.mspClientAccount = this.EditAccountandContact(account);
        break;
      case 3:
        this.ipClientAccount = this.EditAccountandContact(account);
        break;
      case 4:
        this.primeVClientAccount = this.EditAccountandContact(account);
        break;
      case 5:
        this.subPVClientAccount = this.EditAccountandContact(account);
        break;
      case 8:
        this.refClientAccount = this.EditAccountandContact(account);
        break;
    }
  }

  EditAccountandContact(account:ConfirmationAccountMappings) {debugger;
    let ClientAccount: ConfirmationAccountMappings = new ConfirmationAccountMappings();
    ClientAccount.AccountLevel = "job"
    ClientAccount.AccountName = account.AccountName;
    ClientAccount.AccountID = account.AccountID;
    ClientAccount.Employer = false;
    ClientAccount.AccountTypeId = account.AccountTypeId;
    ClientAccount.CreatedDate = account.CreatedDate;
    ClientAccount.ConfirmationAccountMappingID = account.ConfirmationAccountMappingID;
    ClientAccount.MappingStatus = account.MappingStatus;
    ClientAccount.ConfirmationID = account.ConfirmationID;
    if(account.SalesPOC!=null && account.SalesPOC.ContactID >0 ){
      ClientAccount.SalesPOC = account.SalesPOC;
    } 
    else {
      const contact = {
        ConfirmationContactID:0,
        AccountID:0,
        FirstName:null,
        MiddleName:null,
        LastName:null,
        Email:null,
        Phonenumber:null,
        ContactType:0,
        CreatedBy:this.loginUser.UserId,
        CreatedDate:new Date(),
        UpdatedBy:null,
        UpdatedDate :new Date(),
        ConfirmationAccountMappingID:0,
        ContactID :0,
      }
      ClientAccount.SalesPOC=contact;
    }
    return ClientAccount;
  }

  getBenchSubUsers() {
    this._mrktservice.getBenchSubUsers(this.loginUser.Company.Id)
      .subscribe(
        response => {debugger;
          this.salesTeam = response;
          this.GetAccounts();

          this.POCClientControl = new FormControl(null, [
            Validators.required,
            forbiddenNamesValidator(this.salesTeam)
          ]); 

          this.POCClientOptions = this.POCClientControl.valueChanges.pipe(
            map((item: string | null) => item ? this._POCfilter(item) : this.salesTeam.slice()));

        },
        error => {
          this._alertService.error(error);
        });

        
  }

  private _POCfilter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.salesTeam.filter(option => option.FullName.toLowerCase().indexOf(filterValue) === 0);

  }

  onSelFunc(option: any) {
    this.SelectedPOC = option.UserId;
  }

  changeMyControl(){
    if (this.SelectedPOC==null){
      this.confirmationFormGroup.get('PocName').setErrors({'incorrect': true});
    }
  }

 

}

export function forbiddenNamesValidator(Services: SubUsers[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {debugger;
    const index = Services.findIndex(Service => {
      return new RegExp("^" + Service.FullName + "$").test(control.value);
    });
    return index < 0 ? { forbiddenNames: { value: control.value } } : null;
  };
}