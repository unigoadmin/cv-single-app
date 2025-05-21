import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { ValidationService } from 'src/@cv/services/validation.service';
import { VendorLayerService } from 'src/@shared/http/vendor-layer.service';
import { LoginUser } from 'src/@shared/models';
import { AuthenticationService } from 'src/@shared/services';
import { AccountMaster } from 'src/@shared/models/common/accountmaster'; 

import { AccountTypes } from 'src/static-data/accounttypes';
import icClose from '@iconify/icons-ic/twotone-close';
import { PlacementAccountMappings, PlacementAcctContactInfo } from 'src/@shared/models/placementAcctContactInfo';

@Component({
  selector: 'cv-referal-vendor',
  templateUrl: './referal-vendor.component.html',
  styleUrls: ['./referal-vendor.component.scss'],
  providers: [AccountTypes,VendorLayerService]
})
export class ReferalVendorComponent implements OnInit {
  icClose=icClose;
  @Input('refClientAccount') refClientAccount: any;
  @Input('DisplayBilling') DisplayBilling: Boolean;
  @Output() out_refClientAccount = new EventEmitter<any>();
  @Output() out_removeReferalAccount = new EventEmitter<any>();
  refFromGroup : FormGroup;
  EndClientList: AccountMaster[] = [];
  accountMaster: AccountMaster[] = [];
  RefControl: FormControl = new FormControl();
  RefOptions: Observable<AccountMaster[]>;
  loginUser: LoginUser;
  enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  @Output() formValidityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private fb: FormBuilder,
    private _authService: AuthenticationService,
    private _service:VendorLayerService,
    private accountTypes: AccountTypes,
    private cdRef: ChangeDetectorRef) { 
      this.refFromGroup = this.fb.group({
        refEndclientName:[null,[Validators.required]],
        fName: [null,[Validators.required, ValidationService.onlyAlphabetsValidator]],
        lName: [null,[Validators.required, ValidationService.onlyAlphabetsValidator]],
        Email: [null,[Validators.required, ValidationService.emailValidator]],
        Phone: [null,[Validators.required]],
        Evbilling:[null]
      });

      this.refFromGroup.valueChanges.subscribe(() => {
        this.formValidityChanged.emit(this.refFromGroup.valid);
      });
    }

  ngOnInit(): void {
  }

  ngOnChanges(...args: any[]){
    this.loginUser = this._authService.getLoginUser();
    if(this.loginUser){
      this.GetAccounts();
    }
  }

  GetAccounts() {
    this._service.GetAccounts(this.loginUser.Company.Id).subscribe(response => {
      this.accountMaster = response;
      this.PepareAccountTypeAccountList();
    })
  }

  PepareAccountTypeAccountList() {debugger;
    this.EndClientList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.ReferralVendor);
    this.RefOptions = this.RefControl.valueChanges.pipe(startWith(''), map(val => this.endclientfilter(val)));
  }

  endclientfilter(val: string) {
    return this.EndClientList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  SeelectedAccount(event, type) {
    const subv = this.EndClientList.find(x=>x.AccountID == event.option.id);
    this.refClientAccount = this.GetAccountandContact(subv); 
    this.out_refClientAccount.emit(this.refClientAccount);
  }

  GetAccountandContact(account) {
    let ClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
    ClientAccount.AccountLevel = "job"
    ClientAccount.AccountName = account.AccountName;
    ClientAccount.AccountID = account.AccountID;
    ClientAccount.Employer = false;
    ClientAccount.AccountTypeId = account.AccountTypeID;
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

  PhonenumberFormate(type) {
    this.refClientAccount.SalesPOC.Phonenumber = this.PhoneValid(this.refClientAccount.SalesPOC.Phonenumber);
    this.out_refClientAccount.emit(this.refClientAccount);
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

  onRemoveClick(event){
    this.out_removeReferalAccount.emit(event);
  }

  SelectBillingAccount(event,type){
    if (event.checked){
      this.refClientAccount.Isbilling = true;
      this.refClientAccount.BillingPOC = new PlacementAcctContactInfo();
      this.refClientAccount.ImmigrationPOC = new PlacementAcctContactInfo();
    }
    else{
      this.refClientAccount.Isbilling = false;
      this.refClientAccount.BillingPOC = null;
      this.refClientAccount.ImmigrationPOC = null;
    }
  }

  GetBllingData(event){
   this.refClientAccount  = this.DeepCopyForObject(event);
   console.log(this.refClientAccount);
   this.out_refClientAccount.emit(this.refClientAccount);
  }

  OnBillingFormValidity(event){

  }

  private DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }

  OnInputChange(event){
    this.out_refClientAccount.emit(this.refClientAccount);
  }


}
