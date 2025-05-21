import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/@cv/services/layout.service';
import { filter, map, startWith } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { checkRouterChildsData } from 'src/@cv/utils/check-router-childs-data';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ConfigService } from 'src/@cv/services/config.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SidebarComponent } from 'src/@cv/components/sidebar/sidebar.component';
import { AuthenticationService } from 'src/@shared/services';
import { NgxPermissionsService } from 'ngx-permissions';
import { NavigationService } from 'src/@cv/services/navigation.service';

import { Subscription } from 'rxjs';
import { SessionAlertComponent } from 'src/@shared/components/filter-components/session-alert/session-alert.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SessionAlertService } from 'src/@shared/services/session-alert.service';
import { ProcessMenuService } from 'src/@cv/services/processmenu.service';
import { CompanySessionSettings } from 'src/@cv/models/apiresponse';

import { WcNavigationService } from '../services/wc-navigation.service';


@UntilDestroy()
@Component({
  selector: 'cv-custom-layout',
  templateUrl: './custom-layout.component.html',
  styleUrls: ['./custom-layout.component.scss']
})
export class CustomLayoutComponent implements OnInit {

  sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
  isFooterVisible$ = this.configService.config$.pipe(map(config => config.footer.visible));
  isDesktop$ = this.layoutService.isDesktop$;

  subscription!: Subscription;
  lastPing?: Date = undefined;
  idleState = 'Not started.';
  timedOut = false;
  private dialogRef: MatDialogRef<SessionAlertComponent> | null = null;


  toolbarShadowEnabled$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    map(() => checkRouterChildsData(this.router.routerState.root.snapshot, data => data.toolbarShadowEnabled))
  );

  @ViewChild('configpanel', { static: true }) configpanel: SidebarComponent;

  constructor(
    private layoutService: LayoutService,
    private configService: ConfigService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthenticationService,
    private permissionsService: NgxPermissionsService,
    private navigationService: NavigationService,
    private dialog: MatDialog,
    private wcNavigationService: WcNavigationService
  ) { }

  ngOnInit() {
    // Initialize navigation first
    this.wcNavigationService.initializeNavigation();

    // Setup layout configuration
    this.layoutService.configpanelOpen$.pipe(
      untilDestroyed(this)
    ).subscribe(open => open ? this.configpanel?.open() : this.configpanel?.close());

    // Handle user permissions and navigation filtering
    if (this.authService.isLoggedIn()) {
      const loginUser = this.authService.getLoginUser();
      if (loginUser) {
        this.setupNavigationAndPermissions(loginUser);
      }
    }
  }

  private setupNavigationAndPermissions(loginUser: any) {
    let perm = [];
    let wcscreens = [];

    // Find Worker Central module
    const workerCentralModule = loginUser.ModulesList.find(
      i => i.ModuleId === "D1F78D81-5F25-4F43-BF71-86BE16823816"
    );

    if (workerCentralModule) {
      perm = workerCentralModule.RoleAssociatedActions?.split(',') || [];
      wcscreens = workerCentralModule.RoleAssociatedScreens?.split(',') || [];

      // Load permissions
      this.permissionsService.loadPermissions(perm);

      // Filter navigation items based on permissions
      const filteredItems = this.navigationService.items.filter(
        item => wcscreens.includes(item.permission)
      );
      this.navigationService.items = filteredItems;
    }
  }


}
