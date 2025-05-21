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
import icAssigment from '@iconify/icons-ic/twotone-assignment';
import { Icon } from '@visurel/iconify-angular';
import icContactSupport from '@iconify/icons-ic/twotone-contact-support';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import icAssessment from '@iconify/icons-ic/twotone-assessment';
import icBook from '@iconify/icons-ic/twotone-book';
import icAccountCircle from '@iconify/icons-ic/account-circle';
import { environment } from 'src/environments/environment'
import icInsert_Drive_File from '@iconify/icons-ic/insert-drive-file';
import { AuthenticationService } from 'src/@shared/services/authentication.service';
import icWork from '@iconify/icons-ic/twotone-work';
import { Router } from '@angular/router';
import { UserModules } from 'src/@cv/models/accounttypeenum';

export interface MegaMenuModule {
  icon: Icon;
  label: string;
  route: string;
  id:string;
}

@UntilDestroy()
@Component({
  selector: 'cv-superadmin-dashboard',
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.scss'],
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

export class SuperadminDashboardComponent implements OnInit {

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
      icon: icAccountCircle,
      label: 'SuperAdmin',
      route: environment.superadminAppUrl+'#/superadmin-console', 
      id:'4AB1C7D0-F8DE-4C23-A263-8932B6074E85'
    }
  ];

  constructor( private authService:AuthenticationService,
    private _router: Router,) { }

  ngOnInit(): void {
    let loginUser = this.authService.getLoginUser();
    if(loginUser.Role == "admin")
    {
      let module = this.allModules.find(i=>i.id == UserModules.Admin)
      this.modules.push(module);
      // if(loginUser.EmployerType && (loginUser.EmployerType==1 || loginUser.EmployerType==2)){
      //   let adminModule = this.allModules.find(i=>i.id=='')
      //   this.modules.push(adminModule);
      // }
      // loginUser.ModulesList.forEach(userModule=>{
      //   if(userModule.HasAccess){
      //     let module = this.allModules.find(i=>i.id == userModule.ModuleId)
      //     this.modules.push(module);
      //   }
      // })
    }else{
      this._router.navigate(['/unauthorized']);
    }
  }

  ngAfterViewInit() {
  }

}
