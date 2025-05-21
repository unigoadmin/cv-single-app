import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import icClose from '@iconify/icons-ic/twotone-close';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import { stagger80ms } from 'src/@cv/animations/stagger.animation';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { scaleIn400ms } from 'src/@cv/animations/scale-in.animation';
import { fadeInRight400ms } from 'src/@cv/animations/fade-in-right.animation';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import { AccountTypes } from 'src/static-data/accounttypes';
import { ConfirmationService } from '../../core/http/confirmations.service';
import iclocationon from '@iconify/icons-ic/location-on';
import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import { LoginUser } from 'src/@shared/models';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import icPerson from '@iconify/icons-ic/twotone-person';
import icBack from '@iconify/icons-ic/twotone-arrow-back';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { Router } from '@angular/router';
import { SelectItem } from '../../core/models/selectitem';
import { Placement, PlacementCandidate,PlacementAccountMappings } from 'src/@shared/models/common/placement';
import {  PlacementJob } from '../../core/models/confirmations';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import moment from 'moment';
import { AccountMaster } from  '../../core/models/accountmaster'; 
import { WorkStatusService } from 'src/@shared/http/work-status.service';


@Component({
  selector: 'cv-convert-to-placement',
  templateUrl: './convert-to-placement.component.html',
  styleUrls: ['./convert-to-placement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    stagger80ms,
    fadeInUp400ms,
    scaleIn400ms,
    fadeInRight400ms
  ],
  providers: [AccountTypes, ConfirmationService]
})
export class ConvertToPlacementComponent implements OnInit {
  public enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  searchCtrl = new FormControl();
  loginUser: LoginUser;
  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icBack = icBack
  icClose = icClose;
  icPerson = icPerson;
  iclocationon=iclocationon;
  icMoreVert=icMoreVert;
  public thirdTypeList: SelectItem[] = [];
  isPrimeVendor: boolean = false;
  isManagedServiceProvider: boolean = false;
  isImplementationPartner: boolean = false;
  isSubPrimeVendor: boolean = false;
  isReffralVendor: boolean = false;
  public confirmation: Placement = new Placement();
  public confirmationJob: PlacementJob = new PlacementJob();
  public confirmationCandidate: PlacementCandidate = new PlacementCandidate();
  public endClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public primeVClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public mspClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public ipClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public subPVClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  public refClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
  directinternaltType: boolean = false;
  contractC2CType: boolean = true;
  SelectedType: any;
  public workStatusFields: SelectItem[] = [];
  public status_bgClass: any = 'bg-amber';
  public accountMaster: AccountMaster[] = [];
  public EndClient: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<ConvertToPlacementComponent>,
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
    private workStatusService: WorkStatusService
  ) { 
    this.thirdTypeList = [];
    this.thirdTypeList = this.accountTypes.ThirdPartyClient;
  }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetConfirmation();
      this.workStatusService.getWorkStatusFields(this.loginUser.Company.Id).subscribe(data => {
        this.workStatusFields = data;
      });
    }
  }
  GetConfirmation() {
    this._service.GetConfirmation(this.loginUser.Company.Id, this.Data.confirmId).subscribe(response => {
      if (response.IsError) {
        this._alertService.error(response.ErrorMessage);
      } else {
        this.confirmation = response.Data;
        this.confirmationJob = this.confirmation.Job;
        if(!isNullOrUndefined(this.confirmationJob.City) && !isNullOrUndefined(this.confirmationJob.State)){
          this.confirmationJob.Location=this.confirmationJob.City+", "+this.confirmationJob.State;
        }        
        this.confirmationCandidate = this.confirmation.Candidate;
        let StartDate:any= moment(this.confirmation.StartDate).format("YYYY-MM-DDTHH:mm:ss.ms")
        this.confirmation.StartDate =StartDate;
        if(!isNullOrUndefined(this.confirmation.EndDate)){
          let EndDate:any= moment(this.confirmation.EndDate).format("YYYY-MM-DDTHH:mm:ss.ms")
          this.confirmation.EndDate =EndDate;
        }
        this.SelectedType = this.confirmation.JobCategory;
        this.OnRequirementChange(this.confirmation.JobCategory);
        if (this.confirmation.JobCategory === 3 ) {
          this.confirmation.PlacementAccountMappings.forEach(account => {
            this.EditAccount(account, account.AccountTypeId);
            if(account.AccountTypeId!=1){
              let type={
                label:this.accountTypes.ThirdPartyClientList.find(x => x.value == account.AccountTypeId).label
              }
              this.addLayerSelection(type);
              if(account.AccountTypeId===4){
                this.OnRequirementChange(this.confirmation.JobCategory);
              }
            }
          });
        }
        if (!this.cdRef["distroyed"]) {
          this.cdRef.detectChanges();
        }
      }
    }, error => {
      this._alertService.error(error);
    })
  }
  OnRequirementChange(type) {
    this.confirmation.JobCategory = type;
    this.SelectedType = Number(type);
    if (type == 2) {
      this.directinternaltType = true;
      this.contractC2CType = false;
    } else if (type == 3) {
      this.directinternaltType = false;
      this.contractC2CType = true;
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
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
  EditAccountandContact(account:PlacementAccountMappings) {
    let ClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
    ClientAccount.AccountLevel = "job"
    ClientAccount.AccountName = account.AccountName;
    ClientAccount.AccountID = account.AccountID;
    ClientAccount.Employer = false;
    ClientAccount.AccountTypeId = account.AccountTypeId;
    ClientAccount.CreatedDate = account.CreatedDate;
    ClientAccount.PlacementAccountMappingID = account.PlacementAccountMappingID;
    ClientAccount.MappingStatus = account.MappingStatus;
    ClientAccount.PlacementID = account.PlacementID;
    if(account.PlacementAcctContactInfo!=null && account.PlacementAcctContactInfo.length >0 ){
      if(account.PlacementAcctContactInfo[0].PlacementContactID > 0)
      ClientAccount.SalesPOC = account.PlacementAcctContactInfo[0];
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
      ClientAccount.SalesPOC=contact;
    }
    return ClientAccount;
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
  submit(){
    let placement={
      PlacementId:this.confirmation.PlacementID,
      CompanyId:this.loginUser.Company.Id,
      Updatedby:this.loginUser.UserId
    }
    this._service.ConvertConfirmationToPlacement(placement).subscribe(response=>{
      if(response.IsError==false){
        this._alertService.success(response.SuccessMessage);
        this.dialogRef.close(true);
        
      }else{
        this._alertService.success(response.ErrorMessage);
      }
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    },error=>{
      this._alertService.error(error);
      if (!this.cdRef["distroyed"]) {
        this.cdRef.detectChanges();
      }
    })
  }
}
