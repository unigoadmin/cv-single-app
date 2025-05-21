// src/app-public/modules/ats/services/ats-navigation.service.ts
import { Injectable } from '@angular/core';
import { NavigationService } from 'src/@cv/services/navigation.service';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icBook from '@iconify/icons-ic/twotone-book';
import icdashboard from '@iconify/icons-ic/twotone-dashboard';
import icPerson from '@iconify/icons-ic/twotone-person';
import icschedule from '@iconify/icons-ic/schedule';
import icAccount from '@iconify/icons-ic/account-box';
import icConfirmation from '@iconify/icons-ic/confirmation-number';
import icSettings from '@iconify/icons-ic/settings';
import icReports from '@iconify/icons-ic/round-file-copy';
import inbox from '@iconify/icons-ic/inbox';
import icArchived from '@iconify/icons-ic/twotone-archive';
import icpeople from '@iconify/icons-ic/people';
import icSupervisor_Account from '@iconify/icons-ic/twotone-supervisor-account';
import ichot_tub from '@iconify/icons-ic/hot-tub';
import { ConfigService } from 'src/@cv/services/config.service';
import { ConfigName } from 'src/@cv/interfaces/config-name.model';

@Injectable({
  providedIn: 'root'
})
export class AtsNavigationService {
  constructor(private navigationService: NavigationService,
    private configService: ConfigService
  ) {}

  initializeNavigation() {
    this.configService.setConfig(ConfigName.zeus);
    this.navigationService.items = [
        {
            type: 'link',
            label: 'Talent Bench',
            route: '/talent-central/bench-candidates',
            icon: icLayers,
            disabled:false,
            routerLinkActiveOptions: { exact: true },
            module:'TalentCentral',
            permission:'SCREEN_BENCH_CANDIDATES'
          },
          {
            type: 'link',
            label: 'Submissions',
            route: '/talent-central/submissions',
            icon: icBook,
            disabled:false,
            routerLinkActiveOptions: { exact: true },
            module:'TalentCentral',
            permission:'SCREEN_SUBMISSIONS'
          },
          {
            type: 'link',
            label: 'Interviews',
            route: '/talent-central/interviews',
            icon: icschedule,
            disabled:false,
            routerLinkActiveOptions: { exact: true },
            module:'TalentCentral',
            permission:'SCREEN_INTERVIEWS'
          },
          {
            type: 'link',
            label: 'Confirmations',
            route: '/talent-central/confirmations',
            icon: icConfirmation,
            disabled:false,
            routerLinkActiveOptions: { exact: true },
            module:'TalentCentral',
            permission:'SCREEN_CONFIRMATIONS'
          },
          {
            type: 'link',
            label: 'Candidates',
            route: '/talent-central/candidates',
            icon: icPerson,
            disabled:false,
            routerLinkActiveOptions: { exact: true },
            module:'TalentCentral',
            permission:'SCREEN_TC_CANDIDATES'
          },
          {
            type: 'link',
            label: 'Accounts',
            route: '/talent-central/accounts',
            icon: icAccount,
            disabled:false,
            routerLinkActiveOptions: { exact: true },
            module:'TalentCentral',
            permission:'SCREEN_VENDOR_ACCOUNTS'
          },
          {
            type: 'link',
            label: 'Settings',
            route: '/talent-central/settings',
            icon: icSettings,
            disabled:false,
            routerLinkActiveOptions: { exact: true },
            module:'TalentCentral',
            permission:'SCREEN_SETTINGS'
          },
          {
            type: 'link',
            label: 'Reports',
            route: 'ats-reports',
            icon: icReports,
            disabled:false,
            routerLinkActiveOptions: { exact: true },
            module:'TalentCentral',
            permission:'SCREEN_TC_REPORTS'
          }
    ];
  }

  filterNavigationByPermissions(loginUser: any) {
    if (loginUser) {
      let tcperm = [];
      let jcperm = [];
      let tcscreens = [];
      let jcscreens = [];
      let perm = [];
      let allscreens: string[] = [];

      const talaentCenrtralModule = loginUser.ModulesList.find(
        i => i.ModuleId === "404A5725-4FB7-470D-AC0F-6AD1086A6C3B"
      );
      const JobCentralModule = loginUser.ModulesList.find(
        i => i.ModuleId === "D1605CE5-4500-44F4-8ED9-7D40A2F25594"
      );

      if (talaentCenrtralModule) {
        tcperm = talaentCenrtralModule.RoleAssociatedActions?.split(',') || [];
        tcscreens = talaentCenrtralModule.RoleAssociatedScreens?.split(',') || [];
      }
      if (JobCentralModule) {
        jcperm = JobCentralModule.RoleAssociatedActions?.split(',') || [];
        jcscreens = JobCentralModule.RoleAssociatedScreens?.split(',') || [];
      }

      perm = [...tcperm, ...jcperm];
      allscreens = [...tcscreens, ...jcscreens];

      const filteredItems = this.navigationService.items.filter(f => 
        allscreens.includes(f.permission)
      );
      
      this.navigationService.items = filteredItems;
      return perm;
    }
    return [];
  }
}