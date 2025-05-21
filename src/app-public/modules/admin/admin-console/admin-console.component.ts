import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import isSupervised_User_Circle  from '@iconify/icons-ic/sharp-supervised-user-circle'
import icVerifiedUser  from '@iconify/icons-ic/verified-user'
import icBusiness  from '@iconify/icons-ic/business'
import icPerm_Data_Setting  from '@iconify/icons-ic/perm-data-setting'
import icPayment  from '@iconify/icons-ic/payment'
import icSettings_Applications  from '@iconify/icons-ic/settings-applications'
import icAnnouncement  from '@iconify/icons-ic/announcement'
import icView_Module from '@iconify/icons-ic/view-module'
import icHome  from '@iconify/icons-ic/home'

@UntilDestroy()
@Component({
  selector: 'cv-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.scss'],
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
export class AdminConsoleComponent implements OnInit ,AfterViewInit {

  isSupervised_User_Circle = isSupervised_User_Circle;
  icVerifiedUser = icVerifiedUser;
  icBusiness = icBusiness;
  icPerm_Data_Setting = icPerm_Data_Setting;
  icPayment = icPayment;
  icSettings_Applications = icSettings_Applications;
  icAnnouncement = icAnnouncement;
  icView_Module = icView_Module;
  icHome=icHome;

  companyPanelOpenState = false;
  userPanelOpenState = false;
  rolePanelOpenState = false;
  modulePanelOpenState = false;
  securityPanelOpenState = false;
  billingPanelOpenState = false;
  announcementPanelOpenState = false;
  settingsPanelOpenState = false;
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }
}
