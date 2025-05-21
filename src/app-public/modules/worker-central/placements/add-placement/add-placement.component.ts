import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { AccountTypes } from 'src/static-data/accounttypes';
import { Placement, PlacementCandidate, PlacementJob, PlacementAccountMappings } from '../../core/models/placement';
import { AccountMaster } from 'src/@shared/core/ats/models/accountmaster';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { PlacementService } from '../../core/http/placement.service';
import { LoginUser } from 'src/@shared/models';
import { ValidationService } from 'src/@cv/services/validation.service';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import moment from 'moment';
import { CandidateMaster } from '../../core/models/candidatemaster';
import { CandidateExistsComponent } from '../candidate-exists/candidate-exists.component';
import { SearchCandidateComponent } from '../search-candidate/search-candidate.component';
import { IconService } from 'src/@shared/services/icon.service';
import { SubUsers } from 'src/@shared/models/common/subusers';
import { WorkStatusService } from 'src/@shared/http/work-status.service';

@Component({
  selector: 'cv-add-placement',
  templateUrl: './add-placement.component.html',
  styleUrls: ['./add-placement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [AccountTypes, PlacementService]
})
export class AddPlacementComponent implements OnInit {

  public confirmationFormGroup: FormGroup;
  public candidateSubVendorFormGroup: FormGroup;
  public canrefFormGroup: FormGroup;
  public enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  searchCtrl = new FormControl();
  loginUser: LoginUser;
  public thirdTypeList: SelectItem[] = [];
  public c2cTypeList: SelectItem[] = [];
  isPrimeVendor: boolean = false;
  isManagedServiceProvider: boolean = false;
  isImplementationPartner: boolean = false;
  isSubPrimeVendor: boolean = false;
  isReffralVendor: boolean = false;
  isCanReferralVendor: boolean = false;
  public confirmation: Placement = new Placement();
  public confirmationJob: PlacementJob = new PlacementJob();
  public confirmationCandidate: PlacementCandidate = new PlacementCandidate();
  endClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  primeVClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  mspClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  ipClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public subPVClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public refClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public cansubVClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public canrefClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  directinternaltType: boolean = false;
  contractC2CType: boolean = true;
  SelectedType: number = 3;
  public workStatusFields: SelectItem[] = [];
  public status_bgClass: any = 'bg-amber';
  public accountMaster: AccountMaster[] = [];
  public EndClient: number;
  isLoading: boolean = false;
  isCandidateExists: boolean = false;
  existingCandidate: CandidateMaster = new CandidateMaster();
  employmentC2CType: boolean = false;
  CandidateLoaded: boolean = false;
  //@ViewChild('fieldEmail') fieldEmail: ElementRef;
  endclientFormValid:boolean=true;
  primevendorFormValid:boolean=true;
  mspFormValid:boolean=true;
  ipFormValid:boolean=true;
  subpvFormValid:boolean=true;
  referalFormValid:boolean=true;
  cansubvendorFormValid:boolean=true;
  canreferalvendorFormValid:boolean=true;
  InitialEmailId:string=null;
  SelectedPOC:string=null;
  salesTeam: SubUsers[];
  IsLocation:boolean=false;
  AssigneName:string;
  IsEmailDisabled:boolean=false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public def_placement: any,
    private dialogRef: MatDialogRef<AddPlacementComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private accountTypes: AccountTypes,
    private _service: PlacementService,
    public iconService: IconService,
    private workStatusService: WorkStatusService
  ) {
    this.thirdTypeList = [];
    this.thirdTypeList = this.accountTypes.ThirdPartyClient;
    this.c2cTypeList = [];
    this.c2cTypeList = this.accountTypes.CandidateC2C;
    this.confirmation.EndDate = null;
    this.confirmationFormGroup = this.fb.group({
      JobTitle: [null, [Validators.required]],
      DurationInMonths: ['',Validators.max(24)],
      description: [null],
      wpstexpiration: [null, [Validators.required]],
      wpenexpiration: [null],
      canfname: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      canlname: [null, [Validators.required, ValidationService.onlyAlphabetsValidator]],
      PrimaryPhoneNumber: [null, [Validators.required]],
      Email: [null, [Validators.required, ValidationService.emailValidator]],
      wpexpiration: [null, [Validators.required,ValidationService.ValidatWorkPermitExpiryDate]],
      WorkStatus: [null, [Validators.required]],
      rate: [null, [Validators.required,ValidationService.NumberWith2digits]],
      EmploymentType: [null, [Validators.required]]
    },{validator: this.ValidateStartEndDate})
    
    this.confirmationCandidate = new PlacementCandidate();
  }


  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.endClientAccount.SalesPOC = this.loadContact();
      this.primeVClientAccount.SalesPOC = this.loadContact();
      this.mspClientAccount.SalesPOC = this.loadContact();
      this.ipClientAccount.SalesPOC = this.loadContact();
      this.subPVClientAccount.SalesPOC = this.loadContact();
      this.refClientAccount.SalesPOC = this.loadContact();
      this.cansubVClientAccount.SalesPOC = this.loadContact();
      this.canrefClientAccount.SalesPOC = this.loadContact();
      this.confirmationCandidate.EmploymentType = "W2";
      
      this.confirmation.JobCategory = 3;
      this.OnRequirementChange(3);

      // Load work status fields directly
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

    }
  }

  loadWorkStatusFields() {
    return this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id);
  }
  
  OnRequirementChange(type) {
    this.confirmation.JobCategory = type;
    if (type === 2) {
      this.primevendorFormValid=true;
      this.directinternaltType = true;
      this.contractC2CType = false;
      this.onRemoveClick('prime');
    } else if (type === 3) {
      
      this.primevendorFormValid=true;
      this.directinternaltType = false;
      this.contractC2CType = true;
      this.onRemoveClick('EndClient');
    }

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
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
    
  }
  
  submitConfirmation() {debugger;
    this.isLoading = true;
    this.confirmation.PlacementAccountMappings = [];
    this.confirmation.CompanyID = this.loginUser.Company.Id;
    this.confirmation.CreatedBy = this.loginUser.UserId;
    this.confirmation.PlacementType = this.confirmationCandidate.EmploymentType;
    this.confirmation.BillRateType = 1;
    this.confirmation.CreatedDate = new Date();
    this.confirmation.IsPlacement = true;
    this.confirmation.PlacementPOC = this.loginUser.UserId;
    this.confirmationCandidate.CompanyID = this.loginUser.Company.Id;
    this.confirmationCandidate.CreatedBy = this.loginUser.UserId;
    this.confirmationCandidate.CreatedDate = new Date();
    this.confirmation.Candidate = this.confirmationCandidate;
    this.confirmationJob.CompanyID = this.loginUser.Company.Id;
    this.confirmationJob.CreatedBy = this.loginUser.UserId;
    this.confirmationJob.CreatedDate = new Date();
    this.confirmationJob.JobTypeID = 3;
    this.confirmation.Status = 1;
    this.confirmation.Job = this.confirmationJob;
    let StartDate: any = moment(this.confirmation.StartDate).format("YYYY-MM-DDTHH:mm:ss.ms")
    this.confirmation.StartDate = StartDate;
    if (!isNullOrUndefined(this.confirmation.EndDate)) {
      let EndDate: any = moment(this.confirmation.EndDate).format("YYYY-MM-DDTHH:mm:ss.ms")
      this.confirmation.EndDate = EndDate;
    }
    this.confirmation.JobCategory = this.confirmation.JobCategory;
    if (this.confirmation.JobCategory === 3 || this.confirmation.JobCategory === 2) {
      if (this.endClientAccount.AccountID > 0) {
        this.endClientAccount.MappingStatus = true;
        this.endClientAccount.AccountLevel = "job";
        this.endClientAccount.Employer = false;
        const account = this.DeepCopyForObject(this.endClientAccount);
        this.confirmation.PlacementAccountMappings.push(account)
      } else if (this.endClientAccount.AccountID == 0 && !isNullOrUndefined(this.endClientAccount.AccountName) && this.endClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.EndClient, this.endClientAccount, "job", false);
        let account = this.DeepCopyForObject(prearedacnt);
        this.confirmation.PlacementAccountMappings.push(account)
      }
      if (this.mspClientAccount.AccountID > 0) {
        this.mspClientAccount.MappingStatus = true;
        this.mspClientAccount.AccountLevel = "job";
        this.mspClientAccount.Employer = false;
        const account = this.DeepCopyForObject(this.mspClientAccount);
        this.confirmation.PlacementAccountMappings.push(account)
      } else if (this.mspClientAccount.AccountID == 0 && !isNullOrUndefined(this.mspClientAccount.AccountName) && this.mspClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.ManagedServiceProvider, this.mspClientAccount, "job", false)
        let account = this.DeepCopyForObject(prearedacnt);
        this.confirmation.PlacementAccountMappings.push(account)
      }
      if (this.ipClientAccount.AccountID > 0) {
        this.ipClientAccount.MappingStatus = true;
        this.ipClientAccount.AccountLevel = "job";
        this.ipClientAccount.Employer = false;
        const account = this.DeepCopyForObject(this.ipClientAccount);
        this.confirmation.PlacementAccountMappings.push(account)
      } else if (this.ipClientAccount.AccountID == 0 && !isNullOrUndefined(this.ipClientAccount.AccountName) && this.ipClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.ImplementationPartner, this.ipClientAccount, "job", false)
        let account = this.DeepCopyForObject(prearedacnt);
        this.confirmation.PlacementAccountMappings.push(account);
      }
      if (this.subPVClientAccount.AccountID > 0) {
        this.subPVClientAccount.MappingStatus = true;
        this.subPVClientAccount.AccountLevel = "job";
        this.subPVClientAccount.Employer = false;
        const account = this.DeepCopyForObject(this.subPVClientAccount);
        this.confirmation.PlacementAccountMappings.push(account)
      } else if (this.subPVClientAccount.AccountID == 0 && !isNullOrUndefined(this.subPVClientAccount.AccountName) && this.subPVClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.SubPrimeVendor, this.subPVClientAccount, "job", false)
        let account = this.DeepCopyForObject(prearedacnt);
        this.confirmation.PlacementAccountMappings.push(account);
      }
      if (this.primeVClientAccount.AccountID > 0) {
        this.primeVClientAccount.MappingStatus = true;
        this.primeVClientAccount.AccountLevel = "job";
        this.primeVClientAccount.Employer = false;
        const account = this.DeepCopyForObject(this.primeVClientAccount);
        this.confirmation.PlacementAccountMappings.push(account)
      } else if (this.primeVClientAccount.AccountID == 0 && !isNullOrUndefined(this.primeVClientAccount.AccountName) && this.primeVClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.PrimeVendor, this.primeVClientAccount, "job", false)
        let account = this.DeepCopyForObject(prearedacnt);
        this.confirmation.PlacementAccountMappings.push(account);
      }
      if (this.refClientAccount.AccountID > 0) {
        this.refClientAccount.MappingStatus = true;
        this.refClientAccount.AccountLevel = "job";
        this.refClientAccount.Employer = false;
        const account = this.DeepCopyForObject(this.refClientAccount);
        this.confirmation.PlacementAccountMappings.push(account)
      } else if (this.refClientAccount.AccountID == 0 && !isNullOrUndefined(this.refClientAccount.AccountName) && this.refClientAccount.AccountName != '') {
        const prearedacnt = this.prepareAccount(this.enumAccountTypes.ReferralVendor, this.refClientAccount, "job", false)
        let account = this.DeepCopyForObject(prearedacnt);
        this.confirmation.PlacementAccountMappings.push(account);
      }

      //c2c candidate mapping
      if (this.employmentC2CType == true) {
        if (this.cansubVClientAccount.AccountID > 0) {
          this.cansubVClientAccount.MappingStatus = true;
          this.cansubVClientAccount.AccountLevel = "candidate";

          const account = this.DeepCopyForObject(this.cansubVClientAccount);
          this.confirmation.PlacementAccountMappings.push(account);
        } else if (this.cansubVClientAccount.AccountID == 0 && !isNullOrUndefined(this.cansubVClientAccount.AccountName) && this.cansubVClientAccount.AccountName != '') {
          const precansubvendor = this.prepareAccount(this.enumAccountTypes.SubVendor, this.cansubVClientAccount, "candidate", this.cansubVClientAccount.Employer);
          let account = this.DeepCopyForObject(precansubvendor);
          this.confirmation.PlacementAccountMappings.push(account);
        }

        if (this.canrefClientAccount.AccountID > 0) {
          this.canrefClientAccount.MappingStatus = true;
          this.canrefClientAccount.AccountLevel = "candidate";

          this.canrefClientAccount.Employer = false;
          const account = this.DeepCopyForObject(this.canrefClientAccount);
          this.confirmation.PlacementAccountMappings.push(account);
        } else if (this.canrefClientAccount.AccountID == 0 && !isNullOrUndefined(this.canrefClientAccount.AccountName) && this.canrefClientAccount.AccountName != '') {
          const precanrefvendor = this.prepareAccount(this.enumAccountTypes.ReferralVendor, this.canrefClientAccount, "candidate", false);
          let account = this.DeepCopyForObject(precanrefvendor);
          this.confirmation.PlacementAccountMappings.push(account);
        }
      }

      //this.confirmation.PlacementAccountMappings = this.checkAccountName(this.confirmation.PlacementAccountMappings);
    }
    this.saveConfirmation();
  }
  saveConfirmation() {
    this._service.savePlacements(this.confirmation).subscribe(response => {
      if (!response.IsError) {
        this.confirmationFormGroup.reset();
        
        this._alertService.success(response.SuccessMessage);
        this.dialogRef.close(true);
        this.isLoading = false;
      }
      else {
        this.isLoading = false;
        this._alertService.error(response.ErrorMessage);
      }

    }, error => {
      this._alertService.error(error);
      this.isLoading = false;
    })

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }
  
  inputAssignAddress(event) {
    console.log(event.target.value)
  }

  prepareAccount(AccountType, acunt: PlacementAccountMappings, accountlevel: string, IsEmployer: boolean) {
    let Account: PlacementAccountMappings = new PlacementAccountMappings();
    Account = acunt;
    Account.CreatedDate = new Date();
    Account.AccountTypeId = AccountType;
    Account.Employer = IsEmployer;
    Account.AccountLevel = accountlevel;
    Account.MappingStatus = true;
    //Account.AccountTypeName = this.accountTypes.ThirdPartyClient.find(x => x.value = AccountType).label;
    if (AccountType === this.enumAccountTypes.EndClient) {
      Account.SalesPOC = null;
    } else {
      let contact = {
        PlacementContactID: 0,
        AccountID: 0,
        FirstName: acunt.SalesPOC.FirstName,
        MiddleName: null,
        LastName: acunt.SalesPOC.LastName,
        Email: acunt.SalesPOC.Email,
        Phonenumber: acunt.SalesPOC.Phonenumber,
        ContactType: 0,
        CreatedBy: this.loginUser.UserId,
        CreatedDate: new Date(),
        UpdatedBy: null,
        UpdatedDate: new Date(),
        PlacementAccountMappingID: 0,
        ContactID: 0
      }
      Account.SalesPOC = contact
    }
    return Account;
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
      CreatedBy: null,
      CreatedDate: new Date(),
      UpdatedBy: null,
      UpdatedDate: new Date(),
      PlacementAccountMappingID: 0,
      ContactID: 0
    }
    return contact;
  }
  PhonenumberFormate(type) {
    switch (type) {
      case 'cand':
        this.confirmationCandidate.PrimaryPhoneNumber = this.PhoneValid(this.confirmationCandidate.PrimaryPhoneNumber);
        break;
      case 'end':
        this.endClientAccount.SalesPOC.Phonenumber = this.PhoneValid(this.endClientAccount.SalesPOC.Phonenumber);
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
  private checkAccountName(accountLayer) {
    accountLayer.forEach(element => {
      if (this.accountMaster.findIndex(x => x.AccountName.toLocaleLowerCase() === element.AccountName.toLocaleLowerCase()) === -1) {
        element.AccountID = 0;
        element.CreatedDate = new Date();
      }
    })
    return accountLayer;
  }
  private DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }
  onEmailChanged(event: FocusEvent): void {
    const emailControl = this.confirmationFormGroup.get('Email');
    if (emailControl && emailControl.valid) {
      this.CheckCandidateByEmail();
    }
  }

  async CheckCandidateByEmail() {
    if (!isNullOrUndefined(this.confirmationCandidate.Email)) {
      const CandidateSearchVM = {
        Email: this.confirmationCandidate.Email.trim(),
        CompanyId: this.loginUser.Company.Id,
        CandidateId:this.confirmationCandidate.CandidateID
      }
      this.existingCandidate = new CandidateMaster();
  
      let response = await this._service.SyncCheckCandidateByEmail(CandidateSearchVM);
      if (!response.IsError) {
        this.existingCandidate = response.Data;
        if (this.existingCandidate.FailType !== 'sync' && this.existingCandidate.FailType !== 'New') {
          this.openCandidateExistsDialog();
        }
      } else {
        this._alertService.error(response.ErrorMessage);
        return false;
      }
    }
  }

  openCandidateExistsDialog() {
    const dialogData = this.prepareDialogData(this.existingCandidate.FailType);
  
    this.dialog.open(CandidateExistsComponent, {
      width: '60%',
      panelClass: "dialog-class",
      disableClose: true,
      data: dialogData
    }).afterClosed().subscribe((confirmation) => {
      this.handleDialogConfirmation(confirmation);
    });
  }

  prepareDialogData(failType: string) {
    let dialogData = {};
    switch (failType) {
      case 'sync':
        dialogData = this.existingCandidate; 
        break;
      case 'Mismatch-New':
        this.existingCandidate.FirstName = this.confirmationCandidate.FirstName;
        this.existingCandidate.LastName = this.confirmationCandidate.LastName;
        this.existingCandidate.CandidateEmail = this.confirmationCandidate.Email;
        this.existingCandidate.PrimaryPhoneNumber = this.confirmationCandidate.PrimaryPhoneNumber;
        this.existingCandidate.WorkStatus = this.confirmationCandidate.WorkStatus;
        this.existingCandidate.WorkStatusExpiry = this.confirmationCandidate.WorkStatusExpiry;
        this.existingCandidate.EmploymentType = this.confirmationCandidate.EmploymentType;
        this.existingCandidate.FailType="Mismatch-New";
        dialogData = { ...this.existingCandidate }; 
        break;
      case 'new':
        dialogData = this.existingCandidate;
        break;
      default:
        dialogData = this.existingCandidate;
    }
    return dialogData;
  }

  handleDialogConfirmation(confirmation: string) {
    if (confirmation) {
      if (confirmation === "Existing Candidate") {
        this.updateConfirmationCandidateFromExisting();
      } else if (confirmation === "Update") {
        this.confirmationCandidate.CandidateID = this.existingCandidate.CandidateID;
        this.confirmationCandidate.Email = this.existingCandidate.CandidateEmail;
      } else if (confirmation === "Cancel") {
        this.confirmationCandidate.Email = null;
        return true;
      }
      else if(confirmation === "NEW"){
        this.confirmationCandidate.CandidateID = 0;
      }
    }
    if (!this.cdRef["destroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  updateConfirmationCandidateFromExisting() {
    this.confirmationCandidate.CandidateID = this.existingCandidate.CandidateID;
    this.confirmationCandidate.FirstName = this.existingCandidate.FirstName;
    this.confirmationCandidate.LastName = this.existingCandidate.LastName;
    this.confirmationCandidate.Email = this.existingCandidate.CandidateEmail;
    this.confirmationCandidate.PrimaryPhoneNumber = this.existingCandidate.PrimaryPhoneNumber;
    this.confirmationCandidate.WorkStatus = this.existingCandidate.WorkStatus;
    this.confirmationCandidate.WorkStatusExpiry = this.existingCandidate.WorkStatusExpiry;
    this.confirmationCandidate.ExperienceYears = this.existingCandidate.ExperienceYears;
  }

  
  CandidateselectionChange(event) {
    if (event.value === 'C2C') {
      this.employmentC2CType = true;
    } else {
      this.employmentC2CType = false;
      this.cansubvendorFormValid=true;
      this.canreferalvendorFormValid=true;
    }
  }

  GetCandSubVendorData(event) {
    this.cansubVClientAccount = event;
  }

  GetCandRefVendorData(event) {
    this.canrefClientAccount = event;
  }

  AddNewCandidate() {
    this.confirmationCandidate = new PlacementCandidate();
    this.CandidateLoaded = true;

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  SearchCandidate() {
    this.dialog.open(SearchCandidateComponent, { width: '80%', panelClass: "dialog-class", disableClose: true }).afterClosed().subscribe((response) => {
      if (response) {
        if (response.CandidateID > 0 || response.EmployeeID > 0) {
          this.confirmationCandidate.EmployeeID = response.EmployeeID;
          this.confirmationCandidate.CandidateID = response.CandidateID;
          this.confirmationCandidate.FirstName = response.FirstName;
          this.confirmationCandidate.LastName = response.LastName;
          this.confirmationCandidate.Email = response.CandidateEmail;
          this.confirmationCandidate.PrimaryPhoneNumber = response.PrimaryPhoneNumber;
          this.confirmationCandidate.WorkStatus = response.WorkStatus;
          this.confirmationCandidate.WorkStatusExpiry = response.WorkStatusExpiry;
          this.confirmationCandidate.ExperienceYears = response.ExperienceYears;
          this.CandidateLoaded = true;
        }
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    });
  }

  ResetCandidate() {
    this.confirmationFormGroup.controls['canfname'].setValue('');
    this.confirmationFormGroup.controls['canlname'].setValue('');
    this.confirmationFormGroup.controls['Email'].setValue('');
    this.confirmationFormGroup.controls['PrimaryPhoneNumber'].setValue('');
    this.confirmationFormGroup.controls['WorkStatus'].setValue('');
    this.confirmationFormGroup.controls['wpexpiration'].setValue('');

    this.confirmationCandidate = new PlacementCandidate();
    this.CandidateLoaded = false;

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
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
  }

  OnCanSubVendorFormValidity(validity: boolean) {
    this.cansubvendorFormValid = validity;
  }

  OnCanRefVendorFormValidity(validity: boolean) {
    this.canreferalvendorFormValid = validity;
  }

  GetEndClientInternalData(event) {
    this.endClientAccount = event;
  }

  OnEndClientInternalFormValidity(validity: boolean) {
    this.endclientFormValid = validity;
    console.log(this.endclientFormValid);
  }

  GetPrimeVendorData(event){
    this.primeVClientAccount = event;
  }

  OnPrimeVendorFormValidity(validity: boolean){
   this.primevendorFormValid = validity;
  }

  GetMSPVendorData(event){
    this.mspClientAccount = event;
  }

  OnMSPFormValidity(validity: boolean){
    this.mspFormValid = validity;
  }

  GetIPVendorData(event){
    this.ipClientAccount = event;
  }

  OnIPFormValidity(validity: boolean){
    this.ipFormValid = validity;
  }

  GetSubpvVendorData(event){
   this.subPVClientAccount = event;
  }

  OnSubpvFormValidity(validity: boolean){
    this.subpvFormValid = validity;
  }

  GetRefVendorData(event){
    this.refClientAccount=event;
  }

  OnRefFormValidity(validity: boolean){
   this.referalFormValid=validity;
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.confirmationFormGroup.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }

    console.log(invalid);
  
    return invalid;
  }

 
  UpdateAccountandContact(account,ExistingAccountMapping:PlacementAccountMappings) {
    //let ClientAccount: ConfirmationAccountMappings = new ConfirmationAccountMappings();
    ExistingAccountMapping.AccountLevel = "job"
    ExistingAccountMapping.AccountName = account.AccountName;
    ExistingAccountMapping.AccountID = account.AccountID;
    ExistingAccountMapping.Employer = false;
    ExistingAccountMapping.AccountTypeId = account.AccountTypeId;
    ExistingAccountMapping.CreatedDate = account.CreatedDate;
    //ClientAccount.ConfirmationAccountMappingID = account.ConfirmationAccountMappingID;
    ExistingAccountMapping.MappingStatus = account.MappingStatus;
    //ExistingAccountMapping.ConfirmationID = account.ConfirmationID;
    if(account.AccountContacts.length > 0 ){
      ExistingAccountMapping.SalesPOC = account.AccountContacts[0];
    } 
    else {
      const contact = {
        PlacementContactID:0,
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
        PlacementAccountMappingID:0,
        ContactID :0,
      }
      ExistingAccountMapping.SalesPOC=contact;
    }
    return ExistingAccountMapping;
  }

}
