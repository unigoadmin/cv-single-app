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
import icFlag from '@iconify/icons-ic/twotone-flag';
import icAttachMoney from '@iconify/icons-ic/twotone-attach-money';
import icContactSupport from '@iconify/icons-ic/twotone-contact-support';
import icBook from '@iconify/icons-ic/twotone-book';
import icPhoneInTalk from '@iconify/icons-ic/twotone-phone-in-talk';
import icMail from '@iconify/icons-ic/twotone-mail';
import { Link } from 'src/@cv/interfaces/link.interface';
import { Icon } from '@visurel/iconify-angular';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icWork from '@iconify/icons-ic/twotone-work';
import icInsert_Drive_File from '@iconify/icons-ic/insert-drive-file';
import icAccountCircle from '@iconify/icons-ic/account-circle';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { NavigationService } from 'src/@cv/services/navigation.service';

@UntilDestroy()
@Component({
  selector: 'cv-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit ,AfterViewInit {

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

  links: (Link & { icon: Icon })[] = [
    {
      icon: icAccountCircle,
      label: 'Admin',
      route: '/admin',
    },
    {
      icon: icLayers,
      label: 'TalentCentral',
      route:  '/talent-central', 
    },
    {
      icon: icWork,
      label: 'JobCentral',
      route:  '/job-central', 
    },
    {
      icon: icContacts,
      label: 'WorkerCentral',
      route:  '/worker-central',
    },
    {
      icon: icInsert_Drive_File,
      label: 'DocVault',
      route: '/docvault', 
    }
  ];

  constructor( private _authService: AuthenticationService,
    private router: Router,
    private navigationService: NavigationService,) { }

  ngOnInit(): void {
   
    // if (this._authService.isLoggedIn()) {
    //   this.navigationService.items = [];
    //   let loginUser = this._authService.getLoginUser();
    //   if (loginUser.Role == "employer"){
    //     this.router.navigate(['dashboard']);  
    //   }
    // else if (loginUser.Role == "candidate"){
    //     this.router.navigate(['consultant-dashboard']);  
    //   }
    //   else{
    //   this.router.navigate(['unauthorized']);
    // }
    // }
  }

  ngAfterViewInit() {
  }

  navigateToModule(route: string) {
    // If not logged in, save the intended destination first
    if (!this._authService.isLoggedIn()) {
      this._authService.setRedirectionURL(route);
      // Let the auth guard handle the redirect to login
      this.router.navigate([route]);
    } else {
      // If already logged in, navigate directly
      this.router.navigate([route]);
    }
  }
}
