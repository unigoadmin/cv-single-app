import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { ValidationService } from 'src/@cv/services/validation.service';
import { VendorLayerService } from 'src/@shared/http/vendor-layer.service';
import { LoginUser } from 'src/@shared/models';
import { PlacementAccountMappings, PlacementAcctContactInfo } from 'src/@shared/models/placementAcctContactInfo';
import { AuthenticationService } from 'src/@shared/services';
import { AccountMaster } from 'src/@shared/models/common/accountmaster';
import { AccountTypes } from 'src/static-data/accounttypes';

@Component({
  selector: 'cv-prime-vendor',
  templateUrl: './prime-vendor.component.html',
  styleUrls: ['./prime-vendor.component.scss'],
  providers: [AccountTypes,VendorLayerService]
})
export class PrimeVendorComponent implements OnInit {

  @Input('primevendorAccount') primevendorAccount: any;
  @Input('DisplayBilling') DisplayBilling: Boolean;
  @Output() out_primevendorAccount = new EventEmitter<any>();
  PrimeVendorFromGroup : FormGroup;
  EndClientList: AccountMaster[] = [];
  accountMaster: AccountMaster[] = [];
  primeClientControl: FormControl = new FormControl();
  PrimeClientOptions: Observable<AccountMaster[]>;
  loginUser: LoginUser;
  enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  @Output() formValidityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private fb: FormBuilder,
    private _authService: AuthenticationService,
    private _service:VendorLayerService,
    private accountTypes: AccountTypes,
    private cdRef: ChangeDetectorRef) { 
      this.PrimeVendorFromGroup = this.fb.group({
        PEndclientName:[null,[Validators.required]],
        fName: [null,[Validators.required, ValidationService.onlyAlphabetsValidator]],
        lName: [null,[Validators.required, ValidationService.onlyAlphabetsValidator]],
        Email: [null,[Validators.required, ValidationService.emailValidator]],
        Phone: [null,[Validators.required]],
        Evbilling:[null]
      });

      this.PrimeVendorFromGroup.valueChanges.subscribe(() => {
        this.formValidityChanged.emit(this.PrimeVendorFromGroup.valid);
      });
    }

  ngOnInit(): void {
  }

  ngOnChanges(...args: any[]){debugger;
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
    this.EndClientList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.PrimeVendor);
    this.PrimeClientOptions = this.primeClientControl.valueChanges.pipe(startWith(''), map(val => this.endclientfilter(val)));
  }

  endclientfilter(val: string) {
    return this.EndClientList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  SeelectedAccount(event, type) {
    const subv = this.EndClientList.find(x=>x.AccountID == event.option.id);
    this.primevendorAccount = this.GetAccountandContact(subv); 
    this.out_primevendorAccount.emit(this.primevendorAccount);
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
    this.primevendorAccount.SalesPOC.Phonenumber = this.PhoneValid(this.primevendorAccount.SalesPOC.Phonenumber);
    this.out_primevendorAccount.emit(this.primevendorAccount);
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

  SelectBillingAccount(event,type){
    if (event.checked){
      this.primevendorAccount.Isbilling = true;
      this.primevendorAccount.BillingPOC = new PlacementAcctContactInfo();
      this.primevendorAccount.ImmigrationPOC = new PlacementAcctContactInfo();
    }
    else{
      this.primevendorAccount.Isbilling = false;
      this.primevendorAccount.BillingPOC = null;
      this.primevendorAccount.ImmigrationPOC = null;
    }

    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
  }

  GetBllingData(event){
   this.primevendorAccount  = this.DeepCopyForObject(event);
   console.log(this.primevendorAccount);
   this.out_primevendorAccount.emit(this.primevendorAccount);
  }

  OnBillingFormValidity(event){

  }

  private DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }

  OnInputChange(event){
    this.out_primevendorAccount.emit(this.primevendorAccount);
  }

}
