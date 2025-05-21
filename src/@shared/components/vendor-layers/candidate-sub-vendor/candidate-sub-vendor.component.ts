import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountMaster } from 'src/@shared/models/common/accountmaster';
import { AccountTypesEnum } from 'src/@cv/models/accounttypeenum';
import { map, startWith } from 'rxjs/operators';
import { AuthenticationService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { SelectItem } from 'src/@shared/models/common/selectitem';
import { VendorLayerService } from '../../../http/vendor-layer.service';
import { ValidationService } from 'src/@cv/services/validation.service';
import { AccountTypes } from 'src/static-data/accounttypes';
import { PlacementAccountMappings, PlacementAcctContactInfo } from 'src/@shared/models/placementAcctContactInfo';

@Component({
  selector: 'cv-candidate-sub-vendor',
  templateUrl: './candidate-sub-vendor.component.html',
  styleUrls: ['./candidate-sub-vendor.component.scss'],
  providers: [AccountTypes, VendorLayerService]
})
export class CandidateSubVendorComponent implements OnInit, OnChanges {
  @Input('canSubvendorAccount') cansubVClientAccount: PlacementAccountMappings;
  @Output() out_candsubvendor = new EventEmitter<any>();
  @Input() IsRequired: boolean = false;

  candidateSubVendorFormGroup: FormGroup;
  accountMaster: AccountMaster[] = [];
  c2cTypeList: SelectItem[] = [];
  enumAccountTypes: typeof AccountTypesEnum = AccountTypesEnum;

  loginUser: LoginUser;

  CandSubVendorControl: FormControl = new FormControl();
  CandSubVendorOptions: Observable<AccountMaster[]>;
  CandSubVendorList: AccountMaster[] = [];
  @Output() formValidityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private _authService: AuthenticationService,
    private _service: VendorLayerService,
    private accountTypes: AccountTypes,
    private cdRef: ChangeDetectorRef
  ) {
    this.c2cTypeList = this.accountTypes.CandidateC2C;
    this.initializeForm();
  }

  ngOnInit(): void {
    // Initial setup or logic that needs to run on component initialization
    this.candidateSubVendorFormGroup.controls['fcsubName'].valueChanges.subscribe(firstName => {
      this.onPOCNameChange();
    });
  
    this.candidateSubVendorFormGroup.controls['lcsubName'].valueChanges.subscribe(lastName => {
      this.onPOCNameChange();
    });

    this.candidateSubVendorFormGroup.controls['csubEmail'].valueChanges.subscribe(email => {
      this.onPOCNameChange();
    });

    this.candidateSubVendorFormGroup.controls['csubPhone'].valueChanges.subscribe(phone => {
      this.onPOCNameChange();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.GetAccounts();
      if (changes['cansubVClientAccount'] && this.cansubVClientAccount) {
        this.patchFormValues(this.cansubVClientAccount);
      }
    }
  }

  private initializeForm() {
    this.candidateSubVendorFormGroup = this.fb.group({
      CompanyName: [null, this.IsRequired ? [Validators.required] : []],
      fcsubName: [null, this.IsRequired ? [Validators.required, ValidationService.onlyAlphabetsValidator] : []],
      lcsubName: [null, this.IsRequired ? [Validators.required, ValidationService.onlyAlphabetsValidator] : []],
      csubEmail: [null, this.IsRequired ? [Validators.required, ValidationService.emailValidator] : []],
      csubPhone: [null, this.IsRequired ? [Validators.required] : []],
      checkcanEmployer: [null],
      BillRate: [null]
    });

    this.candidateSubVendorFormGroup.valueChanges.subscribe(() => {
      this.formValidityChanged.emit(this.candidateSubVendorFormGroup.valid);
    });
  }

  private patchFormValues(clientAccount) {debugger;
    this.candidateSubVendorFormGroup.patchValue({
      CompanyName: clientAccount.AccountName,
      fcsubName: clientAccount.SalesPOC.FirstName,
      lcsubName: clientAccount.SalesPOC.LastName,
      csubEmail: clientAccount.SalesPOC.Email,
      csubPhone: clientAccount.SalesPOC.Phonenumber,
      checkcanEmployer: clientAccount.Employer,
      BillRate: clientAccount.BillRate
    });
    this.cdRef.detectChanges();  // Ensure Angular detects changes.
  }

  private subvendorfilter(val: string) {
    return this.CandSubVendorList.filter(option => option.AccountName.toLowerCase().includes(val.toLowerCase()));
  }

  GetAccounts() {
    this._service.GetAccounts(this.loginUser.Company.Id).subscribe(response => {
      this.accountMaster = response;
      this.prepareAccountTypeAccountList();
    });
  }

  SeelectedAccount(event, type) {debugger;
    const subv = this.CandSubVendorList.find(x => x.AccountID === event.option.id);
    this.cansubVClientAccount = this.GetAccountandContact(subv);
    this.out_candsubvendor.emit(this.cansubVClientAccount);
  }

  GetAccountandContact(account) {
    let ClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
    ClientAccount.AccountLevel = "candidate";
    ClientAccount.AccountName = account.AccountName;
    ClientAccount.AccountID = account.AccountID;
    ClientAccount.Employer = false;
    ClientAccount.AccountTypeId = account.AccountTypeID;
    ClientAccount.CreatedDate = account.CreatedDate;
    
    if (account.AccountContacts.length > 0) {
      ClientAccount.SalesPOC = account.AccountContacts[0];
    } else {
      ClientAccount.SalesPOC = this.createEmptyContact();
    }

    return ClientAccount;
  }

  private createEmptyContact() {
    return {
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
    };
  }

  private prepareAccountTypeAccountList() {
    this.CandSubVendorList = this.accountMaster.filter(x => x.AccountTypeID === this.enumAccountTypes.SubVendor);
    this.CandSubVendorOptions = this.CandSubVendorControl.valueChanges.pipe(startWith(''), map(val => this.subvendorfilter(val)));
  }

  SubVendorChange(event) {
    if (this.cansubVClientAccount.BillRate != null) {
      this.cansubVClientAccount.BillRateType = 1;
    }
    this.out_candsubvendor.emit(this.cansubVClientAccount);
  }

  onCompanyNameChange(event: any) {
    debugger;
    const enteredCompanyName = event.target.value.trim();
    this.candidateSubVendorFormGroup.controls['CompanyName'].setValue(enteredCompanyName);
  
    // Check if the entered company name exists in the CandSubVendorList
    const companyExists = this.CandSubVendorList.some(option => 
      option.AccountName.toLowerCase() === enteredCompanyName.toLowerCase()
    );
  
    if (companyExists) {
      // Find the existing company details and map them to the account
      const existingCompany = this.CandSubVendorList.find(option => 
        option.AccountName.toLowerCase() === enteredCompanyName.toLowerCase()
      );
      this.cansubVClientAccount = this.GetAccountandContact(existingCompany);
    } else {
      // Clear account and contact if the entered company name doesn't exist
      this.cansubVClientAccount = this.ClearAccountandContact(enteredCompanyName);
    }
  
    // Emit updated cansubVClientAccount data
    this.out_candsubvendor.emit(this.cansubVClientAccount);
  }

  // Method to handle dynamic changes in POC First and Last Names
  onPOCNameChange() {
    const firstName = this.candidateSubVendorFormGroup.controls['fcsubName'].value;
    const lastName = this.candidateSubVendorFormGroup.controls['lcsubName'].value;
    const email = this.candidateSubVendorFormGroup.controls['csubEmail'].value;
    const phone = this.candidateSubVendorFormGroup.controls['csubPhone'].value;

    // Update cansubVClientAccount with the new values
    this.cansubVClientAccount.SalesPOC.FirstName = firstName || '';  // Set default to empty if null
    this.cansubVClientAccount.SalesPOC.LastName = lastName || '';
    this.cansubVClientAccount.SalesPOC.Email = email || '';  // Set default to empty if null
    this.cansubVClientAccount.SalesPOC.Phonenumber = phone || '';


    // Emit the updated cansubVClientAccount object
    this.out_candsubvendor.emit(this.cansubVClientAccount);
  }
  

  // onCompanyNameChange(event) {
  //   debugger;
  //   const enteredCompanyName = event.target.value;
  //   this.candidateSubVendorFormGroup.controls['CompanyName'].setValue(enteredCompanyName);
  //   //on manual entry check the company name is available or not
  //   const isExistingItem = this.CandSubVendorList.some(option => option.AccountName.toLowerCase() === enteredCompanyName.toLowerCase());
  //   //if company not exits and previous if any existing company is mapped to account,then clear the existing values
  //   if (!isExistingItem && this.cansubVClientAccount.AccountID > 0) {
  //     this.cansubVClientAccount = this.ClearAccountandContact(enteredCompanyName);
  //   } 
  //   else 
  //   {  
  //     //chec for existing item
  //     const ExistingItem = this.CandSubVendorList.find(option => option.AccountName.toLowerCase() === enteredCompanyName.toLowerCase());
  //     if (ExistingItem != null) {
  //       this.cansubVClientAccount = this.GetAccountandContact(ExistingItem);
  //     }
  //     else {
  //       this.cansubVClientAccount = this.ClearAccountandContact(enteredCompanyName);
  //     }
  //   }

  //   this.out_candsubvendor.emit(this.cansubVClientAccount);
  // }

  public onInputKeyPress(event): void {
    const pattern = /[0-9\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.code !== 'Backspace' && event.code !== 'Tab' && event.code !== 'ArrowLeft' && event.code !== 'ArrowRight') {
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }

  PhonenumberFormate(type) {
    this.cansubVClientAccount.SalesPOC.Phonenumber = this.PhoneValid(this.cansubVClientAccount.SalesPOC.Phonenumber);
  }

  private PhoneValid(phone) {
    if (phone) {
      phone = phone.replace(/[^\d]/g, "");
      if (phone.length === 10) {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      }
    }
    return phone;
  }

  private ClearAccountandContact(companyName: string) {
    let ClientAccount: PlacementAccountMappings = new PlacementAccountMappings();
    ClientAccount.AccountLevel = "candidate";
    ClientAccount.AccountName = companyName;
    ClientAccount.AccountID = 0; // Reset the AccountID as it is not an existing account
    ClientAccount.Employer = false;
    ClientAccount.AccountTypeId = 7; // Assuming AccountType is not set for new accounts
    ClientAccount.CreatedDate = new Date();
  
    // Set the SalesPOC as an empty contact since it's a new account
    ClientAccount.SalesPOC = this.createEmptyContact();
  
    return ClientAccount;
  }

  onClickCheckBox(event: any) {
    // Set checkcanEmployer to true if checked, else false
    this.cansubVClientAccount.Employer = event.checked;
    
    // Emit the updated account data
    this.out_candsubvendor.emit(this.cansubVClientAccount);
  }
  
}
