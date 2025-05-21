import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output,OnChanges } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountMaster } from 'src/@shared/models/common/accountmaster';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { map, startWith } from 'rxjs/operators';
import { PlacementAccountMappings } from 'src/@shared/models/common/placement';
import { AuthenticationService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { VendorLayerService } from '../../../http/vendor-layer.service';
import { ValidationService } from 'src/@cv/services/validation.service';
import icPerson from '@iconify/icons-ic/twotone-person';
import { AccountTypes } from 'src/static-data/accounttypes';
import { isNullOrUndefined } from 'src/@shared/services/helpers';

@Component({
  selector: 'cv-candidate-account',
  templateUrl: './candidate-account.component.html',
  styleUrls: ['./candidate-account.component.scss'],
  providers: [AccountTypes,VendorLayerService]
})
export class CandidateAccountComponent implements OnInit,OnChanges {
  
  @Input('canSubvendorAccount') cansubVClientAccount: PlacementAccountMappings;
  @Input('canReferralVendorAccount') canrefClientAccount: PlacementAccountMappings;
  @Output() out_candsubvendor = new EventEmitter<any>();
  @Output() out_candRefvendor = new EventEmitter<any>();
  public candidateSubVendorFormGroup: FormGroup;
  public canrefFormGroup:FormGroup;
  public accountMaster: AccountMaster[] = [];
  public c2cTypeList:SelectItem[] = [];
  public enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  
  loginUser: LoginUser;
  isCanReferralVendor:boolean = false;
  CandSubVendorControl: FormControl = new FormControl();
  CandSubVendorOptions: Observable<AccountMaster[]>;
  CandSubVendorList: AccountMaster[] = [];

  CandRefControl:FormControl = new FormControl();
  CandRefOptions:Observable<AccountMaster[]>;
  CandRefList:AccountMaster[] = [];
  icPerson=icPerson;
  @Output() SubvendorformValidityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() RefVendorformValidityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private fb: FormBuilder,
    private _authService: AuthenticationService,
    private _service:VendorLayerService,
    private accountTypes: AccountTypes,
    private cdRef: ChangeDetectorRef
  ) {
    this.c2cTypeList=[];
    this.c2cTypeList = this.accountTypes.CandidateC2C;
    this.candidateSubVendorFormGroup = this.fb.group({
      fcsubName: [null,[Validators.required,ValidationService.onlyAlphabetsValidator]],
      lcsubName: [null,[Validators.required,ValidationService.onlyAlphabetsValidator]],
      csubEmail: [null,[Validators.required,ValidationService.emailValidator]],
      csubPhone: [null,[Validators.required]],
      checkcanEmployer: [null],
      BillRate:[null, [Validators.required,ValidationService.NumberWith2digits]],
    });

    this.canrefFormGroup = this.fb.group({
      canreffcName:[null,[Validators.required,ValidationService.onlyAlphabetsValidator]],
      canreflcName:[null,[Validators.required,ValidationService.onlyAlphabetsValidator]],
      canrefEmail:[null,[Validators.required,ValidationService.emailValidator]],
      canrefPhone:[null,[Validators.required]],
      candrefBillrate:[null, [Validators.required,ValidationService.NumberWith2digits]],
    });

    this.candidateSubVendorFormGroup.valueChanges.subscribe(() => {
      this.SubvendorformValidityChanged.emit(this.candidateSubVendorFormGroup.valid);
    });

    this.canrefFormGroup.valueChanges.subscribe(() => {
      this.RefVendorformValidityChanged.emit(this.canrefFormGroup.valid);
    });
   }

  ngOnInit(): void {
    
  }

  ngOnChanges(...args: any[]){
    this.loginUser = this._authService.getLoginUser();
    if(this.loginUser){
      this.GetAccounts();
     
      if(!isNullOrUndefined(this.canrefClientAccount.AccountName) && this.canrefClientAccount.AccountName!=""){
        this.isCanReferralVendor = true;
      }
    }
  }

  subvendorfilter(val: string) {
    return this.CandSubVendorList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  canreffilter(val:string){
    return this.CandRefList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  GetAccounts() {
    this._service.GetAccounts(this.loginUser.Company.Id).subscribe(response => {
      this.accountMaster = response;
      this.PepareAccountTypeAccountList();
    })
  }

  SeelectedAccount(event, type) {
    switch (type) {
      case 'subvendor':
        const subv = this.CandSubVendorList.find(x=>x.AccountID == event.option.id);
        this.cansubVClientAccount = this.GetAccountandContact(subv); 
        this.out_candsubvendor.emit(this.cansubVClientAccount);
        break;
      case 'candref':
        const candref = this.CandRefList.find(x=>x.AccountID == event.option.id);
        this.canrefClientAccount = this.GetAccountandContact(candref);
      break;
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
      CreatedBy: null,
      CreatedDate: new Date(),
      UpdatedBy: null,
      UpdatedDate: new Date(),
      PlacementAccountMappingID: 0,
      ContactID: 0
    }
    return contact;
  }

  GetAccountandContact(account) {
    let ClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
    ClientAccount.AccountLevel = "candidate"
    ClientAccount.AccountName = account.AccountName;
    ClientAccount.AccountID = account.AccountID;
    ClientAccount.Employer = false;
    ClientAccount.AccountTypeId = account.AccountTypeID;
    //ClientAccount.AccountTypeName = account.AccountTypeName;
    ClientAccount.CreatedDate = account.CreatedDate;
    if (account.AccountContacts.length > 0) {
      ClientAccount.SalesPOC = account.AccountContacts[0];
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
        ContactID: 0
      }
      ClientAccount.SalesPOC = contact;
    }
    return ClientAccount;
  }

  onClickCheckBox(event, layer) {
    if (event.checked) {
      this.c2cTypeList = this.c2cTypeList.filter(x => x.value !== this.enumAccountTypes.SubVendor);
      // if (this.confirmation.PlacementAccountMappings.findIndex(x => x.AccountTypeId === this.enumAccountTypes.SubVendor) > -1) {
      //   this.confirmation.PlacementAccountMappings = this.confirmation.PlacementAccountMappings.filter(x => x.AccountTypeId !== this.enumAccountTypes.SubVendor);
      // }
    } else {
      let data = { label: 'Sub Vendor', value: 7 }
      this.c2cTypeList.unshift(data)
    }
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
    this.out_candsubvendor.emit(this.cansubVClientAccount);
  }

  PhonenumberFormate(type) {
    switch (type) {
      case 'candref':
        this.canrefClientAccount.SalesPOC.Phonenumber = this.PhoneValid(this.canrefClientAccount.SalesPOC.Phonenumber);
        break;
      case 'cansubvendor':
        this.cansubVClientAccount.SalesPOC.Phonenumber = this.PhoneValid(this.cansubVClientAccount.SalesPOC.Phonenumber);
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

  PepareAccountTypeAccountList() {
  
    this.CandSubVendorList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.SubVendor);
    this.CandSubVendorOptions = this.CandSubVendorControl.valueChanges.pipe(startWith(''), map(val => this.subvendorfilter(val)));

    this.CandRefList = this.accountMaster.filter(x=>x.AccountTypeID === this.enumAccountTypes.ReferralVendor);
    this.CandRefOptions = this.CandRefControl.valueChanges.pipe(startWith(''), map(val => this.canreffilter(val)));
  }

  addCandidateLayerSelection(type){
    switch (type.label) {
      case "Referral Vendor":
        this.canrefFormGroup.get('canreffcName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
        this.canrefFormGroup.get('canreflcName').setValidators([Validators.required, ValidationService.onlyAlphabetsValidator]);
        this.canrefFormGroup.get('canrefEmail').setValidators([Validators.required, ValidationService.emailValidator]);
        this.canrefFormGroup.get('canrefPhone').setValidators([Validators.required]);
        this.canrefFormGroup.get('candrefBillrate').setValidators([Validators.required]);
        this.isCanReferralVendor = true;
        break;
    }
    this.CandidateDynamicValidation(type);
  }

  CandidateDynamicValidation(type) {
    switch (type) {
      case "Referral Vendor":
        this.canrefFormGroup.controls['canreffcName'].updateValueAndValidity();
        this.canrefFormGroup.controls['canreffcName'].updateValueAndValidity();
        this.canrefFormGroup.controls['canreffcName'].updateValueAndValidity();
        this.canrefFormGroup.controls['canreffcName'].updateValueAndValidity();
        this.canrefFormGroup.controls['candrefBillrate'].updateValueAndValidity();
        break;
    }
  }

  SubVendorChange(event){
    if(this.cansubVClientAccount.BillRate!=null){
      this.cansubVClientAccount.BillRateType=1;
    }  
    this.out_candsubvendor.emit(this.cansubVClientAccount);
  }

  RefVendorChange(event){
    if(this.canrefClientAccount.BillRate!=null){
      this.canrefClientAccount.BillRateType=1;
    }
   this.out_candRefvendor.emit(this.canrefClientAccount);
  }

}
