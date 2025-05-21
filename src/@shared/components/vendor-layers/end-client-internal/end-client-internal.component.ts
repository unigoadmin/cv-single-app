import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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
  selector: 'cv-end-client-internal',
  templateUrl: './end-client-internal.component.html',
  styleUrls: ['./end-client-internal.component.scss'],
  providers: [AccountTypes,VendorLayerService]
})
export class EndClientInternalComponent implements OnInit {
  
  @Input('endclientinternalAccount') endclientinternalAccount: PlacementAccountMappings;
  
  InitialObject: PlacementAccountMappings = new PlacementAccountMappings();
  @Input('DisplayBilling') DisplayBilling: Boolean;
  @Output() out_endclientinternalAccount = new EventEmitter<any>();
  
  EndclientInternalFromGroup : FormGroup;
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
      this.EndclientInternalFromGroup = this.fb.group({
        EndclientName:[null,[Validators.required]],
        fEndclientName: [null,[Validators.required, ValidationService.onlyAlphabetsValidator]],
        lEndclientName: [null,[Validators.required, ValidationService.onlyAlphabetsValidator]],
        EEndclientmail: [null,[Validators.required, ValidationService.emailValidator]],
        Endclientphone: [null,[Validators.required]],
        Evbilling:[null]
      });

      this.EndclientInternalFromGroup.valueChanges.subscribe(() => {
        this.formValidityChanged.emit(this.EndclientInternalFromGroup.valid);
      });
    }

  ngOnInit(): void {
    console.log(this.endclientinternalAccount);
  }

  // ngOnChanges(...args: any[]){
  //   this.InitialObject = { ...this.endclientinternalAccount };
  //   this.loginUser = this._authService.getLoginUser();
  //   if(this.loginUser){
  //     this.GetAccounts();
  //   }
  // }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.endclientinternalAccount);
    if (changes.endclientinternalAccount) {
      this.InitialObject = { ...this.endclientinternalAccount };
    }
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
    this.endclientinternalAccount = this.GetAccountandContact(subv); 
    this.out_endclientinternalAccount.emit(this.endclientinternalAccount);
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
    this.endclientinternalAccount.SalesPOC.Phonenumber = this.PhoneValid(this.endclientinternalAccount.SalesPOC.Phonenumber);
    this.out_endclientinternalAccount.emit(this.endclientinternalAccount);
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
      this.endclientinternalAccount.Isbilling = true;
      this.endclientinternalAccount.BillingPOC = new PlacementAcctContactInfo();
      this.endclientinternalAccount.ImmigrationPOC = new PlacementAcctContactInfo();
    }
    else{
      this.endclientinternalAccount.Isbilling = false;
      this.endclientinternalAccount.BillingPOC = new PlacementAcctContactInfo();
      this.endclientinternalAccount.ImmigrationPOC = new PlacementAcctContactInfo();
    }
  }

  GetBllingData(event){
   this.endclientinternalAccount  = this.DeepCopyForObject(event);
   console.log('---end client obect---');
   console.log(this.endclientinternalAccount);
   this.out_endclientinternalAccount.emit(this.endclientinternalAccount);
  }

  OnBillingFormValidity(event){

  }

  private DeepCopyForObject(source) {
    return JSON.parse(JSON.stringify(source));
  }

  resetForm() {
    this.endclientinternalAccount = { ...this.InitialObject };
    this.out_endclientinternalAccount.emit(this.endclientinternalAccount);
    if (!this.cdRef["distroyed"]) {
      this.cdRef.detectChanges();
    }
    
  }

  OnInputChange(event){
    this.out_endclientinternalAccount.emit(this.endclientinternalAccount);
  }



}
