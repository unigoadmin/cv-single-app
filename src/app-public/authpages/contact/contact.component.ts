import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import isSupervised_User_Circle from '@iconify/icons-ic/sharp-supervised-user-circle'
import icVerifiedUser from '@iconify/icons-ic/verified-user'
import icBusiness from '@iconify/icons-ic/business'
import icPerm_Data_Setting from '@iconify/icons-ic/perm-data-setting'
import icPayment from '@iconify/icons-ic/payment'
import icSettings_Applications from '@iconify/icons-ic/settings-applications'
import icAnnouncement from '@iconify/icons-ic/announcement'
import icView_Module from '@iconify/icons-ic/view-module'
import icPhoneInTalk from '@iconify/icons-ic/twotone-phone-in-talk';
import icMail from '@iconify/icons-ic/twotone-mail';
import { ContactEnquiry } from '../../modules/initial/core/models';
import { IdentityService } from '../../modules/initial/core/http/identity.service';
import { AlertService } from 'src/@shared/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import icLocation_On from '@iconify/icons-ic/twotone-location-on';
import { ValidationService } from 'src/@cv/services/validation.service';

@UntilDestroy()
@Component({
  selector: 'cv-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class ContactComponent implements OnInit, AfterViewInit {

  isSupervised_User_Circle = isSupervised_User_Circle;
  icVerifiedUser = icVerifiedUser;
  icBusiness = icBusiness;
  icPerm_Data_Setting = icPerm_Data_Setting;
  icPayment = icPayment;
  icSettings_Applications = icSettings_Applications;
  icAnnouncement = icAnnouncement;
  icView_Module = icView_Module;
  icPhoneInTalk = icPhoneInTalk;
  icMail = icMail;
  icLocation_On = icLocation_On;

  contactEnquiry: ContactEnquiry = new ContactEnquiry();
  form: FormGroup;

  constructor(private _identityService: IdentityService,
    private _alertService: AlertService,
    private fb: FormBuilder) {

    this.form = this.fb.group({
      Name: ['', [Validators.required,ValidationService.onlyAlphabetsValidator]],
      EmailId: ['', [Validators.required,ValidationService.emailValidator]],
      PhoneNo: ['', [Validators.required,ValidationService.phonenumValidator]],
      Subject: ['', Validators.required],
      Message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  saveContactEnquiry() {
    // this.contactEnquiry = <ContactEnquiry>{};
    // const form = this.form.value;
    // this.contactEnquiry.Name = form.Name;
    // this.contactEnquiry.EmailId = form.EmailId;
    // this.contactEnquiry.PhoneNo = form.PhoneNo;
    // this.contactEnquiry.Subject = form.Subject;
    // this.contactEnquiry.Message = form.Message;

    this._identityService.saveContactRequest(this.contactEnquiry)
      .subscribe(
        response => {
          this._alertService.success("Thank you for your enquiry.");
          this.form.reset();
        },
        error => {
          this._alertService.error(error);

        }
      );
  }
}
