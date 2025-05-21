import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'src/@cv/services/validation.service';
import { VendorLayerService } from 'src/@shared/http/vendor-layer.service';
import { PlacementAccountMappings, PlacementAcctContactInfo } from 'src/@shared/models/common/placement';
import { AccountTypes } from 'src/static-data/accounttypes';

@Component({
  selector: 'cv-billing-vendor',
  templateUrl: './billing-vendor.component.html',
  styleUrls: ['./billing-vendor.component.scss'],
  providers: [AccountTypes,VendorLayerService]
})
export class BillingVendorComponent implements OnInit {
  
  @Input('billingAccount') billingAccount: PlacementAccountMappings;
  @Input('vendortype') vendortype:string;
  @Output() out_billing = new EventEmitter<any>();
  BillingFromGroup : FormGroup;
  @Output() formValidityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private fb: FormBuilder) { 
    this.BillingFromGroup = this.fb.group({
    Epofcname: [null,[Validators.required,ValidationService.onlyAlphabetsValidator]],
    Eoclname:  [null,[Validators.required,ValidationService.onlyAlphabetsValidator]],
    Epocemail: [null,[Validators.required,ValidationService.emailValidator]],
    Epocphone: [null,[Validators.required]],
    Eimpofcname: [null,[Validators.required,ValidationService.onlyAlphabetsValidator]],
    Eimpoclname: [null,[Validators.required,ValidationService.onlyAlphabetsValidator]],
    Emppocemail: [null,[Validators.required,ValidationService.emailValidator]],
    Eimppocphone:[null,[Validators.required]], 
    Evdetails: [null]
  });

  this.BillingFromGroup.valueChanges.subscribe(() => {
    this.formValidityChanged.emit(this.BillingFromGroup.valid);
  });}

  ngOnInit(): void {
    console.log(this.billingAccount);
  }

  CopyDetails(event, type) {
    if (event.checked) {
      this.billingAccount.BillingPOC = this.billingAccount.SalesPOC;
      this.billingAccount.ImmigrationPOC = this.billingAccount.SalesPOC;
    } else {
      this.billingAccount.ImmigrationPOC = new PlacementAcctContactInfo();
      this.billingAccount.BillingPOC = new PlacementAcctContactInfo();
    }
    this.out_billing.emit(this.billingAccount);
  }

  public onNamesInputKeyPress(event): void {
    const pattern = /[a-z\A-Z\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.code !== 'Backspace' && event.code !== 'Tab' &&
      event.code !== 'ArrowLeft' && event.code !== 'ArrowRight') {
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
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

  PhonenumberFormate(type) {
    switch (type) {
      case 'endbilling':
        this.billingAccount.BillingPOC.Phonenumber = this.PhoneValid(this.billingAccount.BillingPOC.Phonenumber);
        break;
      case 'endibilling': 
        this.billingAccount.ImmigrationPOC.Phonenumber = this.PhoneValid(this.billingAccount.ImmigrationPOC.Phonenumber);
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

}
