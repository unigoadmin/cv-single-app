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
  selector: 'cv-end-client-c2c',
  templateUrl: './end-client-c2c.component.html',
  styleUrls: ['./end-client-c2c.component.scss'],
  providers: [AccountTypes,VendorLayerService]
})
export class EndClientC2cComponent implements OnInit {

  @Input('endclientc2cAccount') endclientc2cAccount: PlacementAccountMappings;
  @Input('DisplayBilling') DisplayBilling: Boolean;
  @Output() out_endclientc2cAccount = new EventEmitter<any>();
  EndclientC2CFromGroup : FormGroup;
  EndClientList: AccountMaster[] = [];
  accountMaster: AccountMaster[] = [];
  EndClientControl: FormControl = new FormControl();
  EndClientOptions: Observable<AccountMaster[]>;
  loginUser: LoginUser;
  enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;
  @Output() formValidityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private fb: FormBuilder,
    private _authService: AuthenticationService,
    private _service:VendorLayerService,
    private accountTypes: AccountTypes,
    private cdRef: ChangeDetectorRef) { 
      this.EndclientC2CFromGroup = this.fb.group({
        EndclientName:[null,[Validators.required]],
        fEndclientName: [null,[ValidationService.onlyAlphabetsValidator]],
        lEndclientName: [null,[ValidationService.onlyAlphabetsValidator]],
        EEndclientmail: [null,[ValidationService.emailValidator]],
        Endclientphone: [null],
        Evbilling:[null]
      });

      this.EndclientC2CFromGroup.valueChanges.subscribe(() => {
        this.formValidityChanged.emit(this.EndclientC2CFromGroup.valid);
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
    this.EndClientList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.EndClient);
    this.EndClientOptions = this.EndClientControl.valueChanges.pipe(startWith(''), map(val => this.endclientfilter(val)));
  }

  endclientfilter(val: string) {
    return this.EndClientList.filter(option => option.AccountName.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  SeelectedAccount(event, type) {
    const subv = this.EndClientList.find(x=>x.AccountID == event.option.id);
    this.endclientc2cAccount = this.GetAccountandContact(subv); 
    this.out_endclientc2cAccount.emit(this.endclientc2cAccount);
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
    this.endclientc2cAccount.SalesPOC.Phonenumber = this.PhoneValid(this.endclientc2cAccount.SalesPOC.Phonenumber);
    this.out_endclientc2cAccount.emit(this.endclientc2cAccount);
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
      this.endclientc2cAccount.Isbilling = true;
      this.endclientc2cAccount.BillingPOC = new PlacementAcctContactInfo();
      this.endclientc2cAccount.ImmigrationPOC = new PlacementAcctContactInfo();
    }
    else{
      this.endclientc2cAccount.Isbilling = false;
      this.endclientc2cAccount.BillingPOC = null;
      this.endclientc2cAccount.ImmigrationPOC = null;
    }
  }

  GetBllingData(event){
   this.endclientc2cAccount  = this.DeepCopyForObject(event);
   console.log('---end client obect---');
   console.log(this.endclientc2cAccount);
   this.out_endclientc2cAccount.emit(this.endclientc2cAccount);
  }

  OnBillingFormValidity(event){

  }

  private DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }

  OnInputChange(event){debugger;
    this.out_endclientc2cAccount.emit(this.endclientc2cAccount);
  }

}
