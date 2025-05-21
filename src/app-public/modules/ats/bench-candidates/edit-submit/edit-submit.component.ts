import { Component, Inject, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import icClose from '@iconify/icons-ic/twotone-close';
import icPerson from '@iconify/icons-ic/twotone-person';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SubmissionService } from '../../core/http/submissions.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Submissions, Job, SubmissionAccount } from '../../core/models/submission';
import { MaterSubmissionStatus } from '../../core/models/matersubmissionstatus';
import { AccountTypeNameEnum, AccountTypesEnum } from '../../../../../@cv/models/accounttypeenum';
import { AccountMaster } from '../../core/models/accountmaster';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AccountTypes } from '../../../../../static-data/accounttypes';
import { SelectItem } from '../../core/models/selectitem';
import icEdit from '@iconify/icons-ic/twotone-edit';
import { MatSelectChange } from '@angular/material/select';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService, EventEmitterService } from 'src/@shared/services';
import { ValidationService } from 'src/@cv/services/validation.service';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import iclocationon from '@iconify/icons-ic/location-on';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import { GooglePlacesComponent } from '../../google-places/google-places.component';
import { QuickSubmitComponent } from '../quick-submit/quick-submit.component';


@Component({
  selector: 'cv-edit-submit',
  templateUrl: './edit-submit.component.html',
  styleUrls: ['./edit-submit.component.scss'],
  providers: [AccountTypes]
})
export class EditSubmitComponent implements OnInit {
  loginUser: LoginUser;
  icClose = icClose;
  icPerson = icPerson;
  icEdit = icEdit
  icMoreVert = icMoreVert;
  form: FormGroup;
  PrimeVendorForm: FormGroup;
  ReferalVendorForm: FormGroup;
  public enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  public enumAccountTypeName: typeof AccountTypeNameEnum = AccountTypeNameEnum;
  public SelectedSubmission: Submissions = new Submissions();
  public submissionJob: Job = new Job();
  public SelectedType: any;
  public accountMaster: AccountMaster[] = [];
  public SubmissionStatusList: MaterSubmissionStatus[];
  public thirdPartyAddLayer: SubmissionAccount[] = [];
  //directcontractType: boolean = false;
  public thirdTypeList: SelectItem[] = [];
  public status_textClass: any = 'text-amber-contrast';
  public status_bgClass: any = 'bg-amber';
  public ThirdPartyEndClient: any;

  @Output() public CloseEditSubmission: EventEmitter<boolean> = new EventEmitter<boolean>();

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
  
  EndclientFromGroup:FormGroup;
   primeVendorFromGroup: FormGroup;
   mspFromGroup: FormGroup;
   ipFromGroup: FormGroup;
   subFromGroup: FormGroup;
   refFromGroup: FormGroup;
   confirmationFormGroup: FormGroup;


  searchCtrl = new FormControl();
  iclocationon = iclocationon;
  isPrimeVendor: boolean = false;
  isManagedServiceProvider: boolean = false;
  isImplementationPartner: boolean = false;
  isSubPrimeVendor: boolean = false;
  isReffralVendor: boolean = false;
  
  endClientAccount: SubmissionAccount = new SubmissionAccount();
  primeVClientAccount: SubmissionAccount = new SubmissionAccount();
  mspClientAccount: SubmissionAccount = new SubmissionAccount();
  ipClientAccount: SubmissionAccount = new SubmissionAccount();
  subPVClientAccount: SubmissionAccount = new SubmissionAccount();
  refClientAccount: SubmissionAccount = new SubmissionAccount();
  directInternalcontractType: boolean = false;
  contractC2CType: boolean = true;

  public workStatusFields: SelectItem[] = [];
  public EndClient: number;

  //static id = 100;

  public QuickSubmitForm: FormGroup;
  public subinfoForm:FormGroup;
  mode: 'create' | 'update' = 'create';

  public submission: Submissions = new Submissions();
  internalcontractType: boolean = false;
  isView: boolean = true;
  isEdit: boolean = false;
  IsLoading:boolean=false;
  @ViewChild('fred') fred!:GooglePlacesComponent;
  IsLocation:boolean=false;
 
  
  constructor(@Inject(MAT_DIALOG_DATA) public def_submission: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EditSubmitComponent>,
    private _service: SubmissionService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private accountTypes: AccountTypes,
    private _authService: AuthenticationService,
    private _alertService: AlertService,
    private _eventemtterservice: EventEmitterService) {

    this.SubmissionStatusList = [];
    this.accountMaster = [];
    this.submissionJob = new Job();
    this.thirdTypeList = [];
    this.thirdTypeList = this.accountTypes.ThirdPartyClient;
    this.QuickSubmitForm = this.fb.group({
      SubmissionType: [''],
      JobTitle: [null, [Validators.required]],
      JobDurtionMonths:[null,[Validators.required,ValidationService.numberValidator]],
      JobDescription: [null,[Validators.required]],
      SubmissionRate:[null, [Validators.required,ValidationService.numberValidator]],
      AvailabilityToStart:['',Validators.required]
    });
    this.EndclientFromGroup = this.fb.group({
      fEndclientName: [null],
      lEndclientName: [null],
      EEndclientmail: [null],
      Endclientphone: [null],
    });
    this.primeVendorFromGroup = this.fb.group({
      fName: [null],
      lName: [null],
      Email: [null],
      Phone: [null],
    });
    this.mspFromGroup = this.fb.group({
      fmspName: [null],
      lmspName: [null],
      mspEmail: [null],
      mspPhone: [null],
    });
    this.ipFromGroup = this.fb.group({
      fipName: [null],
      lipName: [null],
      ipEmail: [null],
      ipPhone: [null],
    });
    this.subFromGroup = this.fb.group({
      fsubName: [null],
      lsubName: [null],
      subEmail: [null],
      subPhone: [null],
    });
    this.refFromGroup = this.fb.group({
      frefName: [null],
      lrefName: [null],
      refEmail: [null],
      refPhone: [null],
    });
    this.subinfoForm = this.fb.group({
      SubmissionRate:[null, [Validators.required,ValidationService.numberValidator]],
      AvailabilityTo:['',Validators.required]
    })

  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetAccounts();
      this.getSubmissionStatusList(this.loginUser.Company.Id);
    }

  }
  GetAccounts() {
    this._service.GetAccounts(this.loginUser.Company.Id).subscribe(response => {
      this.accountMaster = response.Data;
      this.PepareAccountTypeAccountList();
      if (this.def_submission.SubmissionId && this.def_submission.SubmissionId > 0) {
        if(this.def_submission.Mode=="Edit"){
          this.isView=false;
          this.isEdit=true;
        }
        this.GetSubmissionDetails(this.def_submission.SubmissionId);
      }
    })
  }

  GetSubmissionDetails(SubmissionId: number) {
    this._service.GetSubmissonsBySubmissionId(this.loginUser.Company.Id, SubmissionId)
      .subscribe(response => {
        if (response.IsError == false) {
          this.SelectedSubmission = response.Data;
          this.SelectedSubmission.StatusName = this.SelectedSubmission.StatusName;
          this.SelectedType = this.SelectedSubmission.SubmissionType;
          this.OnRequirementChange(this.SelectedType);
          this.submissionJob = this.SelectedSubmission.Job;
          this.submissionJob.Location = this.submissionJob.City + ", " + this.submissionJob.State;
          if(this.submissionJob.Location){
            this.IsLocation=true;
          }
          else{
            this.IsLocation=false;
          }
          if (this.SelectedSubmission.SubmissionType === 3) {
            this.contractC2CType = true;
            this.SelectedSubmission.AccountMasters.forEach(account => {
              this.EditAccount(account, account.AccountTypeID);
              if (account.AccountTypeID != 1) {
                let type = {
                  label: account.AccountTypeName
                }
                this.addLayerSelection(type);
                if (account.AccountTypeID === 4) {
                  this.OnRequirementChange(this.SelectedSubmission.SubmissionType);
                }
              }
            });
          }
          else {
            this.directInternalcontractType = true;
            this.SelectedSubmission.AccountMasters.forEach(account => {
              this.EditAccount(account, account.AccountTypeID);
              if (account.AccountTypeID != 1) {
                let type = {
                  label: account.AccountTypeName
                }
                this.addLayerSelection(type);
                if (account.AccountTypeID === 4) {
                  this.OnRequirementChange(this.SelectedSubmission.SubmissionType);
                }
              }
            });
          }

        }


      }, error => {
        this._alertService.error(error);
      });
  }

  EditAccount(account, type) {
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

  EditAccountandContact(account) {
    let ClientAccount: SubmissionAccount = new SubmissionAccount();
    ClientAccount.AccountLevel = "job"
    ClientAccount.AccountName = account.AccountName;
    ClientAccount.AccountID = account.AccountID;
    ClientAccount.Employer = false;
    ClientAccount.AccountTypeID = account.AccountTypeID;
    ClientAccount.AccountTypeName = account.AccountTypeName;
    ClientAccount.CompanyID = account.CompanyID;
    ClientAccount.CreatedBy = account.CreatedBy;
    ClientAccount.CreatedDate = account.CreatedDate;
    if (account.AccountContacts != null && account.AccountContacts.ContactID > 0) {
      ClientAccount.AccountContacts = account.AccountContacts;
    } else {
      const contact = {
        ContactID: 0,
        AccountID: 0,
        FirstName: null,
        MiddleName: null,
        LastName: null,
        Email: null,
        Phonenumber: null,
        PhoneExt: null,
        CreatedBy: this.loginUser.UserId,
        CreatedDate: new Date(),
        UpdatedBy: null,
        UpdatedDate: null,
      }
      ClientAccount.AccountContacts = contact;
    }
    return ClientAccount;
  }


  getSubmissionStatusList(CompanyId: number) {
    this._service.GetSubmissionStatusList(CompanyId)
      .subscribe(response => {
        this.SubmissionStatusList = response.Data;
      },
        error => {
          this._alertService.error(error);
        }
      );
  }

  prepareEdit(element, data) {
    data.AccountID = element.AccountID;
    data.AccountTypeID = element.AccountTypeID;
    data.AccountTypeName = element.AccountTypeName;
    data.AccountLevel = element.AccountLevel;
    data.AccountName = element.AccountName;
    data.CompanyID = element.CompanyID;
    data.CreatedBy = element.CreatedBy;
    data.CreatedDate = element.CreatedDate;
    data.Employer = element.Employer;
    data.UpdatedBy = this.loginUser.UserId;
    data.UpdatedDate = new Date();
    data.NewLayer = null;
    if (element.AccountContacts && element.AccountContacts.ContactID > 0) {
      data.AccountContacts = element.AccountContacts;
    } else {
      const contact = {
        ContactID: 0,
        AccountID: 0,
        FirstName: null,
        MiddleName: null,
        LastName: null,
        Email: null,
        Phonenumber: null,
        CreatedBy: this.loginUser.UserId,
        CreatedDate: new Date(),
        UpdatedBy: null,
        UpdatedDate: new Date(),
      }
      data.AccountContacts = contact;
    }

    return data;
  }

  getContact() {
    const contact = {
      ContactID: 0,
      AccountID: 0,
      FirstName: null,
      MiddleName: null,
      LastName: null,
      Email: null,
      Phonenumber: null,
      CreatedBy: this.loginUser.UserId,
      CreatedDate: new Date(),
      UpdatedBy: null,
      UpdatedDate: new Date(),
      PhoneExt: null,
    }
    return contact;
  }

  PepareAccountTypeAccountList() {
    this.EndClientList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.EndClient);
    this.EndClientOptions = this.EndClientControl.valueChanges.pipe(startWith(''), map(val => this.thirdecfilter(val)));

    this.MSPList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.ManagedServiceProvider);
    this.MSPOptions = this.MSPControl.valueChanges.pipe(startWith(''), map(val => this.mspfilter(val)));

    this.IPList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.ImplementationPartner);
    this.IPOptions = this.IPControl.valueChanges.pipe(startWith(''), map(val => this.ipfilter(val)));

    this.subPrimeVendorList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.SubPrimeVendor);
    this.subPrimeVendorOptions = this.subPrimeVendorControl.valueChanges.pipe(startWith(''), map(val => this.subpvfilter(val)));

    this.primeClientList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.PrimeVendor);
    this.primeClientOptions = this.primeClientControl.valueChanges.pipe(startWith(''), map(val => this.primefilter(val)));

    this.RefList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.ReferralVendor);
    this.RefOptions = this.RefControl.valueChanges.pipe(startWith(''), map(val => this.refpfilter(val)));

  }
  thirdecfilter(val: string) {
    return this.EndClientList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  mspfilter(val: string) {
    return this.MSPList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  ipfilter(val: string) {
    return this.IPList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  subpvfilter(val: string) {
    return this.subPrimeVendorList.filter(option =>
      option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  primefilter(val: string) {
    return this.primeClientList.filter(option =>
      option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  refpfilter(val: string) {
    return this.RefList.filter(option =>
      option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
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
    let ClientAccount: SubmissionAccount = new SubmissionAccount();
    ClientAccount.AccountLevel = "job"
    ClientAccount.AccountName = account.AccountName;
    ClientAccount.AccountID = account.AccountID;
    ClientAccount.Employer = false;
    ClientAccount.AccountTypeID = account.AccountTypeID;
    ClientAccount.AccountTypeName = account.AccountTypeName;
    ClientAccount.CompanyID = account.CompanyID;
    ClientAccount.CreatedBy = account.CreatedBy;
    ClientAccount.CreatedDate = account.CreatedDate;
    if (account.AccountContacts.length > 0) {
      ClientAccount.AccountContacts = account.AccountContacts[0];
    } else {
      const contact = {
        ContactID: 0,
        AccountID: 0,
        FirstName: null,
        MiddleName: null,
        LastName: null,
        Email: null,
        Phonenumber: null,
        PhoneExt: null,
        CreatedBy: this.loginUser.UserId,
        CreatedDate: new Date(),
        UpdatedBy: null,
        UpdatedDate: null,
      }
      ClientAccount.AccountContacts = contact;
    }
    return ClientAccount;
  }

  addLayerSelection(type) {
    switch (type.label) {
      case "Managed Service Provider (MSP)":
        this.mspFromGroup.get('fmspName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
        this.mspFromGroup.get('lmspName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
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
    this.DynamicValidation(type);
  }
  onRemoveClick(type) {
    switch (type) {
      case "MSP":
        this.mspClientAccount = new SubmissionAccount();
        this.mspFromGroup.get('fmspName').clearValidators();
        this.mspFromGroup.get('lmspName').clearValidators();
        this.mspFromGroup.get('mspEmail').clearValidators();
        this.mspFromGroup.get('mspPhone').clearValidators();
        this.isManagedServiceProvider = false;
        break;
      case "IP":
        this.ipClientAccount = new SubmissionAccount();
        this.ipFromGroup.get('fipName').clearValidators();
        this.ipFromGroup.get('lipName').clearValidators();
        this.ipFromGroup.get('ipEmail').clearValidators();
        this.ipFromGroup.get('ipPhone').clearValidators();
        this.isImplementationPartner = false;
        break;
      case "Sub Prime Vendor":
        this.subPVClientAccount = new SubmissionAccount();
        this.subFromGroup.get('fsubName').clearValidators();
        this.subFromGroup.get('lsubName').clearValidators();
        this.subFromGroup.get('subEmail').clearValidators();
        this.subFromGroup.get('subPhone').clearValidators();
        this.isSubPrimeVendor = false;
        break;
      case "Referral Vendor":
        this.refClientAccount = new SubmissionAccount();
        this.refFromGroup.get('frefName').clearValidators();
        this.refFromGroup.get('lrefName').clearValidators();
        this.refFromGroup.get('refEmail').clearValidators();
        this.refFromGroup.get('refPhone').clearValidators();
        this.isReffralVendor = false;
        break;
    }
    this.DynamicValidation(type);
  }

  save() {
    this.IsLoading=true;
    this.submission.AccountMasters = [];
    if (!isNullOrUndefined(this.SelectedType) && this.SelectedType != 0)
      this.submission.SubmissionType = this.SelectedType;
    if (this.directInternalcontractType) {
      this.submission.SubmissionType = 2;
    } else if (this.contractC2CType) {
      this.submission.SubmissionType = 3;
    }
    this.submission.SubmissionID = this.SelectedSubmission.SubmissionID;
    this.submission.Job = this.submissionJob;
    this.submission.SubmittedRate = Number(this.SelectedSubmission.SubmittedRate)
    this.submission.CandidateID = Number(this.SelectedSubmission.CandidateID);
    this.submission.CompanyID = this.loginUser.Company.Id;
    this.submission.SubmissionDate = new Date();
    this.submission.Job.UpdatedBy = this.loginUser.UserId;
    this.submission.Job.CreatedDate = new Date();
    this.submission.Job.WorkStatus = "";
    this.submission.Job.DurationInMonths = Number(this.submission.Job.DurationInMonths);
    this.submission.Status = this.SelectedSubmission.Status;
    this.submission.UpdatedBy = this.loginUser.UserId;
    this.submission.AvailabilityToStart = this.SelectedSubmission.AvailabilityToStart;
    if (this.submission.SubmissionType === 3) {

      if (this.endClientAccount.AccountID > 0) { //end client
        this.endClientAccount.MappingStatus = true;
        const account = this.DeepCopyForObject(this.endClientAccount);
        this.submission.AccountMasters.push(account)
      } else if (this.endClientAccount.AccountID == 0 && !isNullOrUndefined(this.endClientAccount.AccountName) && this.endClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.EndClient, this.endClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.submission.AccountMasters.push(account)
      }
      if (this.mspClientAccount.AccountID > 0) {
        this.mspClientAccount.MappingStatus = true;
        const account = this.DeepCopyForObject(this.mspClientAccount);
        this.submission.AccountMasters.push(account)
      } else if (this.mspClientAccount.AccountID == 0 && !isNullOrUndefined(this.mspClientAccount.AccountName) && this.mspClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.ManagedServiceProvider, this.mspClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.submission.AccountMasters.push(account)
      }
      if (this.ipClientAccount.AccountID > 0) {
        this.ipClientAccount.MappingStatus = true;
        const account = this.DeepCopyForObject(this.ipClientAccount);
        this.submission.AccountMasters.push(account)
      } else if (this.ipClientAccount.AccountID == 0 && !isNullOrUndefined(this.ipClientAccount.AccountName) && this.ipClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.ImplementationPartner, this.ipClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.submission.AccountMasters.push(account);
      }
      if (this.subPVClientAccount.AccountID > 0) {
        this.subPVClientAccount.MappingStatus = true;
        const account = this.DeepCopyForObject(this.subPVClientAccount);
        this.submission.AccountMasters.push(account)
      } else if (this.subPVClientAccount.AccountID == 0 && !isNullOrUndefined(this.subPVClientAccount.AccountName) && this.subPVClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.SubPrimeVendor, this.subPVClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.submission.AccountMasters.push(account);
      }
      if (this.primeVClientAccount.AccountID > 0) {
        this.primeVClientAccount.MappingStatus = true;
        const account = this.DeepCopyForObject(this.primeVClientAccount);
        this.submission.AccountMasters.push(account)
      } else if (this.primeVClientAccount.AccountID == 0 && !isNullOrUndefined(this.primeVClientAccount.AccountName) && this.primeVClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.PrimeVendor, this.primeVClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.submission.AccountMasters.push(account);
      }
      if (this.refClientAccount.AccountID > 0) {
        this.refClientAccount.MappingStatus = true;
        const account = this.DeepCopyForObject(this.refClientAccount);
        this.submission.AccountMasters.push(account)
      } else if (this.refClientAccount.AccountID == 0 && !isNullOrUndefined(this.refClientAccount.AccountName) && this.refClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.ReferralVendor, this.refClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.submission.AccountMasters.push(account);
      }
      this.submission.AccountMasters = this.checkAccountName(this.submission.AccountMasters);
    }
    else{
      if (this.endClientAccount.AccountID > 0) { //end client
        this.endClientAccount.MappingStatus = true;
        const account = this.DeepCopyForObject(this.endClientAccount);
        this.submission.AccountMasters.push(account)
      } else if (this.endClientAccount.AccountID == 0 && !isNullOrUndefined(this.endClientAccount.AccountName) && this.endClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.EndClient, this.endClientAccount)
        let account = this.DeepCopyForObject(prearedacnt);
        this.submission.AccountMasters.push(account)
      }
      this.submission.AccountMasters = this.checkAccountName(this.submission.AccountMasters);
    }
    this._service.EditSubmission(this.submission).subscribe(response => {
      if (response.IsError == false) {
        this._alertService.success(response.SuccessMessage);
        this.dialogRef.close(true);
        this.IsLoading=false;
        this._eventemtterservice.submissionUpdateEvent.emit();
      }
      else {
        this._alertService.error(response.ErrorMessage);
        this.IsLoading=false;
      }

    }, error => {
      this._alertService.error(error);
      this.IsLoading=false;
    })
  }

  prepareAccount(AccountType, acunt: SubmissionAccount) {
    let Account: SubmissionAccount = new SubmissionAccount();
    Account = acunt;
    Account.CreatedBy = this.loginUser.UserId;
    Account.CreatedDate = new Date();
    Account.AccountTypeID = AccountType;
    Account.Employer = false;
    Account.AccountLevel = "job";
    Account.MappingStatus = true;
    //Account.AccountTypeName = this.accountTypes.ThirdPartyClientList.find(x => x.value == AccountType).label;
    
    Account.AccountContacts.CreatedBy = this.loginUser.UserId;
    Account.AccountContacts.CreatedDate = new Date();
    Account.AccountContacts.FirstName = acunt.AccountContacts.FirstName;
    Account.AccountContacts.LastName = acunt.AccountContacts.LastName;
    Account.AccountContacts.Email = acunt.AccountContacts.Email;
    Account.AccountContacts.Phonenumber = acunt.AccountContacts.Phonenumber;
    
    return Account;
  }

  PhonenumberFormate(type) {
    switch (type) {
      case 'prime':
        this.primeVClientAccount.AccountContacts.Phonenumber = this.PhoneValid(this.primeVClientAccount.AccountContacts.Phonenumber);
        break;
      case 'msp':
        this.mspClientAccount.AccountContacts.Phonenumber = this.PhoneValid(this.mspClientAccount.AccountContacts.Phonenumber);
        break;
      case 'ip':
        this.ipClientAccount.AccountContacts.Phonenumber = this.PhoneValid(this.ipClientAccount.AccountContacts.Phonenumber);
        break;
      case 'sub':
        this.subPVClientAccount.AccountContacts.Phonenumber = this.PhoneValid(this.subPVClientAccount.AccountContacts.Phonenumber);
        break;
      case 'ref':
        this.refClientAccount.AccountContacts.Phonenumber = this.PhoneValid(this.refClientAccount.AccountContacts.Phonenumber);
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
      }
    })
    return accountLayer;
  }

  inputAssignAddress(event) {
    this.getAssignAddress(event);
  }
  getAssignAddress(event) {
    let data = event.address_components
    this.submissionJob.Location = "";
    this.submissionJob.City = "";
    this.submissionJob.State = "";
    this.submissionJob.Country = "";
    this.submissionJob.ZipCode = "";
    if (data && data.length > 0) {
      for (let address of data) {
        if ((address.types.includes("sublocality") || (address.types.includes("locality")))) {
          this.submissionJob.City = address.long_name;
        } else if (address.types.includes("administrative_area_level_1")) {
          this.submissionJob.State = address.short_name;
        } else if (address.types.includes("country")) {
          this.submissionJob.Country = address.short_name;
        } else if (address.types.includes("postal_code")) {
          this.submissionJob.ZipCode = address.long_name;
        }
      }
      this.submissionJob.Location = this.submissionJob.City +', ' +this.submissionJob.State;
      this.IsLocation=true;
    }
    else{
      event.target.value=null;
      this.submissionJob.Location = null;
      this.IsLocation=false;
    }
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }


  OnCloseEditSubmit() {
    this.CloseEditSubmission.emit(true);
  }


  onLabelChange(change: MatSelectChange) {
    var selectedStatus = change.value;
    this.SelectedSubmission.StatusName = selectedStatus.StatusName;
    this.SelectedSubmission.Status = selectedStatus.StatusId;
  }

  OnRequirementChange(value) {
    this.SelectedSubmission.SubmissionType = Number(value);
    this.SelectedType = value;
    if (value == "3") {
      this.primeVendorFromGroup.get('fName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
      this.primeVendorFromGroup.get('lName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
      this.primeVendorFromGroup.get('Email').setValidators([Validators.required, ValidationService.emailValidator]);
      this.primeVendorFromGroup.get('Phone').setValidators([Validators.required]);
      this.DynamicValidation('prime');
      this.endClientAccount=new SubmissionAccount();
      this.EndclientFromGroup.get('fEndclientName').clearValidators();
      this.EndclientFromGroup.get('lEndclientName').clearValidators();
      this.EndclientFromGroup.get('EEndclientmail').clearValidators();
      this.EndclientFromGroup.get('Endclientphone').clearValidators();
      this.DynamicValidation('end');
      
      this.directInternalcontractType = false;
      this.contractC2CType = true;
    }
    else if (value == "2") {
    this.EndclientFromGroup.get('fEndclientName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
    this.EndclientFromGroup.get('lEndclientName').setValidators([Validators.required,ValidationService.onlyAlphabetsValidator]);
    this.EndclientFromGroup.get('EEndclientmail').setValidators([Validators.required,ValidationService.emailValidator]);
    this.EndclientFromGroup.get('Endclientphone').setValidators([Validators.required]);
    this.DynamicValidation('end');
     
      this.primeVendorFromGroup.get('fName').clearValidators();
      this.primeVendorFromGroup.get('lName').clearValidators();
      this.primeVendorFromGroup.get('Email').clearValidators();
      this.primeVendorFromGroup.get('Phone').clearValidators();
      this.DynamicValidation('prime');
      this.directInternalcontractType = true;
      this.contractC2CType = false;
    }
    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  }

  DynamicValidation(type) {
    switch (type) {
      case "end":
        this.EndclientFromGroup.controls['fEndclientName'].updateValueAndValidity();
        this.EndclientFromGroup.controls['lEndclientName'].updateValueAndValidity();
        this.EndclientFromGroup.controls['EEndclientmail'].updateValueAndValidity();
        this.EndclientFromGroup.controls['Endclientphone'].updateValueAndValidity();
        break;
      case "prime":
        this.primeVendorFromGroup.controls['fName'].updateValueAndValidity();
        this.primeVendorFromGroup.controls['lName'].updateValueAndValidity();
        this.primeVendorFromGroup.controls['Email'].updateValueAndValidity();
        this.primeVendorFromGroup.controls['Phone'].updateValueAndValidity();
        break;
      case "MSP":
        this.mspFromGroup.controls['fmspName'].updateValueAndValidity();
        this.mspFromGroup.controls['lmspName'].updateValueAndValidity();
        this.mspFromGroup.controls['mspEmail'].updateValueAndValidity();
        this.mspFromGroup.controls['mspPhone'].updateValueAndValidity();
        break;
      case "IP":
        this.ipFromGroup.controls['fipName'].updateValueAndValidity();
        this.ipFromGroup.controls['lipName'].updateValueAndValidity();
        this.ipFromGroup.controls['ipEmail'].updateValueAndValidity();
        this.ipFromGroup.controls['ipPhone'].updateValueAndValidity();
        break;
      case "Sub Prime Vendor":
        this.subFromGroup.controls['fsubName'].updateValueAndValidity();
        this.subFromGroup.controls['lsubName'].updateValueAndValidity();
        this.subFromGroup.controls['subEmail'].updateValueAndValidity();
        this.subFromGroup.controls['subPhone'].updateValueAndValidity();
        break;
      case "Referral Vendor":
        this.refFromGroup.controls['frefName'].updateValueAndValidity();
        this.refFromGroup.controls['lrefName'].updateValueAndValidity();
        this.refFromGroup.controls['refEmail'].updateValueAndValidity();
        this.refFromGroup.controls['refPhone'].updateValueAndValidity();
        break;
    }
  }
  editClick() {debugger;
    this.isView = false;
    //this.isEdit = true;
   this.dialogRef.close();

    this.dialog.open(QuickSubmitComponent, {
      data:{candidateId:0,submissionId:this.def_submission.SubmissionId,srcmode:'edit'},width: '80%',disableClose: true
    }).afterClosed().subscribe(response => {
      if (response) {
       
      }
    });

    if (!this.cdr["distroyed"]) {
      this.cdr.detectChanges();
    }
  
  }

  OnValidate(){
    //console.log(this.fred.ATSGoogePlacesForm.valid)
  }

  
}
