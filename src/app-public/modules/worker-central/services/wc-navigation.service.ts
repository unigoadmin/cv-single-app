import { Injectable } from '@angular/core';
import { NavigationService } from 'src/@cv/services/navigation.service';
import { ConfigService } from 'src/@cv/services/config.service';
import { ConfigName } from 'src/@cv/interfaces/config-name.model';
import { IconService } from 'src/@shared/services/icon.service';

@Injectable({
  providedIn: 'root'
})
export class WcNavigationService {
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
        label: 'Dashboard',
        route: '/worker-central/wc-dashboard',
        icon: this.iconService.icdashboard,
        disabled: false,
        routerLinkActiveOptions: { exact: true },
        permission: 'SCREEN_WC_DASHBOARD'
      },
      {
        type: 'link',
        label: 'Placements',
        route: '/worker-central/placements',
        icon: this.iconService.icLayers,
        disabled: false,
        routerLinkActiveOptions: { exact: true },
        permission: 'SCREEN_PLACEMENTS',
        badge: {
          textClass: "text-position",
          bgClass: null,
          value: null
        }
      },
      {
        type: 'link',
        label: 'Workers',
        route: '/worker-central/workers',
        icon: this.iconService.icPerson,
        disabled: false,
        routerLinkActiveOptions: { exact: true },
        permission: 'SCREEN_WORKERS'
      },
      {
        type: 'link',
        label: 'Assignments',
        route: '/worker-central/assignments',
        icon: this.iconService.icAssigment,
        disabled: false,
        routerLinkActiveOptions: { exact: true },
        permission: 'SCREEN_ASSIGNMENTS'
      },
      {
        type: 'link',
        label: 'Manager Dashboard',
        route: '/worker-central/timesheets/ManagerDashboard',
        icon: this.iconService.icdashboard,
        disabled: false,
        routerLinkActiveOptions: { exact: true },
        permission: 'SCREEN_MANAGER_DASHBOARD'
      },
      {
        type: 'link',
        label: 'Settings',
        route: '/worker-central/timesheets/Settings',
        disabled: false,
        icon: this.iconService.icSettings,
        routerLinkActiveOptions: { exact: true },
        permission: 'SCREEN_TIMESHEET_SETTINGS'
      },
      {
        type: 'link',
        label: 'WC Admin Console',
        route: '/worker-central/wc-admin',
        disabled: false,
        icon: this.iconService.icLayers,
        routerLinkActiveOptions: { exact: true },
        permission: 'SCREEN_ADMIN_CONSOLE'
      },
      {
        type: 'link',
        label: 'Reports',
        route: '/worker-central/wc-reports',
        disabled: false,
        icon: this.iconService.icReports,
        routerLinkActiveOptions: { exact: true },
        permission: 'SCREEN_WC_REPORTS'
      }
    ];
  }
}