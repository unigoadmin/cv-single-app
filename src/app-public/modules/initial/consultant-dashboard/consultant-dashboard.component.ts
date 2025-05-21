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
import icBeenhere from '@iconify/icons-ic/twotone-beenhere';
import icStars from '@iconify/icons-ic/twotone-stars';
import icBusinessCenter from '@iconify/icons-ic/twotone-business-center';
import icPhoneInTalk from '@iconify/icons-ic/twotone-phone-in-talk';
import icMail from '@iconify/icons-ic/twotone-mail';
import icLayers from '@iconify/icons-ic/twotone-layers';
import { Icon } from '@visurel/iconify-angular';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import icAccountCircle from '@iconify/icons-ic/account-circle';
import { environment } from 'src/environments/environment'
import icInsert_Drive_File from '@iconify/icons-ic/insert-drive-file';
import { AuthenticationService } from 'src/@shared/services/authentication.service';
import icWork from '@iconify/icons-ic/twotone-work';
import { Router } from '@angular/router';

export interface MegaMenuModule {
  icon: Icon;
  label: string;
  route: string;
  id:string;
}

@UntilDestroy()
@Component({
  selector: 'cv-consultant-dashboard',
  templateUrl: './consultant-dashboard.component.html',
  styleUrls: ['./consultant-dashboard.component.scss'],
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


export class ConsultantDashboardComponent implements OnInit ,AfterViewInit {

  isSupervised_User_Circle = isSupervised_User_Circle;
  icVerifiedUser = icVerifiedUser;
  icBusiness = icBusiness;
  icPerm_Data_Setting = icPerm_Data_Setting;
  icPayment = icPayment;
  icSettings_Applications = icSettings_Applications;
  icAnnouncement = icAnnouncement;
  icView_Module = icView_Module;

  companyPanelOpenState = false;
  userPanelOpenState = false;
  rolePanelOpenState = false;
  modulePanelOpenState = false;
  securityPanelOpenState = false;
  billingPanelOpenState = false;
  announcementPanelOpenState = false;
  settingsPanelOpenState = false;

  
  icBeenhere = icBeenhere;
  icStars = icStars;
  icBusinessCenter = icBusinessCenter;
  icPhoneInTalk = icPhoneInTalk;
  icMail = icMail;

  modules :MegaMenuModule[] = [];
  allModules: MegaMenuModule[] = [
    {
      icon: icContacts,
      label: 'TimeSheets',
      route:  environment.publicAppUrl+'#/worker-central/timesheets', 
      id:'D1F78D81-5F25-4F43-BF71-86BE16823816'
    },
    {
      icon: icInsert_Drive_File,
      label: 'DocVault',
      route:  environment.publicAppUrl+'#/docvault', 
      id:'324DE4D0-09D6-4D72-AA8A-8BD530570955'
    },
  
  ];

  constructor( private authService:AuthenticationService,
    private _router: Router,) { }

  ngOnInit(): void {
    let loginUser = this.authService.getLoginUser();
    console.log(loginUser);
    if(loginUser.Role == "candidate"){
      loginUser.ModulesList.forEach(userModule=>{
        if(userModule.HasAccess){
          let module = this.allModules.find(i=>i.id == userModule.ModuleId)
          this.modules.push(module);
        }
      })
    }else{
      this._router.navigate(['/unauthorized']);
    }
  }

  ngAfterViewInit() {
  }
}
