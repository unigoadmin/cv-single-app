import { Injectable } from '@angular/core';
import { NavigationService } from 'src/@cv/services/navigation.service';
import { ConfigService } from 'src/@cv/services/config.service';
import { ConfigName } from 'src/@cv/interfaces/config-name.model';
import { IconService } from 'src/@shared/services/icon.service';

@Injectable({
  providedIn: 'root'
})
export class AdminNavigationService {
  constructor(
    private navigationService: NavigationService,
    private configService: ConfigService,
    public iconService: IconService,
  ) {}

  initializeNavigation() {
    this.configService.setConfig(ConfigName.zeus);
    this.navigationService.items = [
        {
            type: 'link',
            label: 'Admin Console',
            route: 'admin-console',
            icon: this.iconService.icHome,
            disabled:false,
            routerLinkActiveOptions: { exact: true },
            permission:'employer'
          },
          {
            type: 'link',
            label: 'Company',
            route: 'company',
            icon: this.iconService.icBusiness,
            disabled:false,
            permission:'employer'
          },
          {
            type: 'link',
            label: 'Modules',
            route: 'modules',
            icon: this.iconService.icView_Module,
            disabled:false,
            permission:'employer'
          },
          {
            type: 'link',
            label: 'Users',
            route: 'users',
            icon: this.iconService.isSupervised_User_Circle,
            disabled:false,
            permission:'employer'
          },
          {
            type: 'link',
            label: 'Roles',
            route: 'roles',
            icon: this.iconService.icPerm_Data_Setting,
            disabled:false,
            permission:'employer'
          },
          {
            type: 'link',
            label: 'Security',
            route: 'coming-soon',
            icon: this.iconService.icVerifiedUser,
            disabled:false,
            permission:'employer'
          },
          {
            type: 'link',
            label: 'Billing',
            route: 'coming-soon',
            icon: this.iconService.icPayment,
            disabled:false,
            permission:'employer'
          },
          {
            type: 'link',
            label: 'Announcements',
            route: 'coming-soon',
            icon: this.iconService.icAnnouncement,
            disabled:false,
            permission:'employer'
          },
          {
            type: 'link',
            label: 'Global Settings',
            route: 'globalsettings',
            icon: this.iconService.icSettings_Applications,
            disabled:false,
            permission:'employer'
          },
          {
            type: 'link',
            label: 'Company',
            route: 'tenants',
            icon: this.iconService.icBusiness,
            disabled:false,
            permission:'admin'
          },
          {
            type: 'link',
            label: 'Recurring Jobs',
            route: 'recurring-jobs',
            icon: this.iconService.icSettings_Applications,
            disabled:false,
            permission:'admin'
          },
    ];
  }
}