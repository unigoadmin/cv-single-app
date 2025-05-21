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
export class JcNavigationService {
  constructor(private navigationService: NavigationService,
    private configService: ConfigService
  ) {}

  initializeNavigation() {
    this.configService.setConfig(ConfigName.zeus);
    this.navigationService.items = [
        {
            type: 'link',
            label: 'Dashboard',
            route: '/job-central/recruiter-dashboard',
            disabled:true,
            icon: icdashboard,
            routerLinkActiveOptions: { exact: true },
            module:'JobCentral',
            permission:'SCREEN_JC_RECRUITER_DASHBOARD'
          },
          {
            type: 'link',
            label: 'Applicants',
            route: '/job-central/new-jobboard-responses',
            disabled:true,
            icon: inbox,
            routerLinkActiveOptions: { exact: true },
            module:'JobCentral',
            permission:'SCREEN_APPLICANTS_INBOX'
          },
          {
            type: 'link',
            label: 'Requisitions',
            route: '/job-central/requisition-responses',
            disabled:true,
            icon: icSupervisor_Account,
            routerLinkActiveOptions: { exact: true },
            module:'JobCentral',
            permission:'SCREEN_APPLICANTS_INBOX'
          },
          {
            type: 'link',
            label: 'Jobs',
            route: '/job-central/jobs-dashboard',
            disabled:true,
            icon: icBook,
            routerLinkActiveOptions: { exact: true },
            module:'JobCentral',
            permission:'SCREEN_MY_JOBS'
          },
          {
            type: 'link',
            label: 'Candidates Database',
            route: '/job-central/candidates',
            disabled:true,
            icon: icpeople,
            routerLinkActiveOptions: { exact: true },
            module:'JobCentral',
            permission:'SCREEN_CANDIDATES_DATABASE'
          },
          {
            type: 'link',
            label: 'Archived Applicants',
            route: '/job-central/archived-responses',
            disabled:true,
            icon: icArchived,
            routerLinkActiveOptions: { exact: true },
            module:'JobCentral',
            permission:'SCREEN_JOBCENTRAL_ARCHIVED'
          },
          {
            type: 'link',
            label: 'HotList',
            route: '/job-central/hotlist-jobs',
            disabled:true,
            icon: ichot_tub,
            routerLinkActiveOptions: { exact: true },
            module:'JobCentral',
            permission:'SCREEN_MY_JOBS'
          },
          {
            type: 'link',
            label: 'Reports',
            route: '/job-central/jc-reports',
            disabled:true,
            icon: icReports,
            routerLinkActiveOptions: { exact: true },
            module:'JobCentral',
            permission:'SCREEN_JC_REPORTS'
          },
          {
            type: 'link',
            label: 'Settings',
            route: '/job-central/jcsettings',
            disabled:true,
            icon: icSettings,
            routerLinkActiveOptions: { exact: true },
            module:'JobCentral',
            permission:'SCREEN_JOBCENTRAL_SETTINGS'
          },
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