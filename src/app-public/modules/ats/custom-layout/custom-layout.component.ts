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

import { AtsNavigationService } from '../services/tc-navigation.service';



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
  FilteredNavItems: any[] = [];
  constructor(private layoutService: LayoutService,
    private configService: ConfigService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private _authService: AuthenticationService,
    private permissionsService: NgxPermissionsService,
    private navigationService: NavigationService,
    private dialog: MatDialog,
    private sessionAlertService: SessionAlertService,
    private processService: ProcessMenuService,
    private atsNavigationService: AtsNavigationService) { }

  ngOnInit() {debugger;
    // if (!this._authService.isLoggedIn()) {
    //   // Save current URL before redirecting
    //   this._authService.setRedirectionURL(this.router.url);
    //   this._authService.startAuthentication();
    // } else {
    //   // Already logged in, check if there's a saved route
    //   const redirectUrl = this._authService.getRedirectionURL();
    //   if (redirectUrl) {
    //     this._authService.clearRedirectionURL();
    //     this.router.navigate([redirectUrl]);
    //   }
    // }
    this.atsNavigationService.initializeNavigation();
    this.layoutService.configpanelOpen$.pipe(
      untilDestroyed(this)
    ).subscribe(open => open ? this.configpanel.open() : this.configpanel?.close());
    let loginUser = this._authService.getLoginUser();
    if (loginUser) {
      let tcperm = []; let jcperm = []; let tcscreens = []; let jcscreens = [];
      let perm = []; let allscreens: string[] = [];
      let talaentCenrtralModule = loginUser.ModulesList.find(i => i.ModuleId == "404A5725-4FB7-470D-AC0F-6AD1086A6C3B");
      let JobCentralModule = loginUser.ModulesList.find(i => i.ModuleId == "D1605CE5-4500-44F4-8ED9-7D40A2F25594");
      if (talaentCenrtralModule) {
        tcperm = talaentCenrtralModule.RoleAssociatedActions?.split(',');
        tcscreens = talaentCenrtralModule.RoleAssociatedScreens?.split(',');
      }
      if (JobCentralModule) {
        jcperm = JobCentralModule.RoleAssociatedActions?.split(',');
        jcscreens = JobCentralModule.RoleAssociatedScreens?.split(',');
      }
      perm = [...(tcperm || []), ...(jcperm || [])];
      //perm = tcperm.concat(jcperm);
      //allscreens=tcscreens.concat(jcscreens);
      allscreens = [...(tcscreens || []), ...(jcscreens || [])];
      this.permissionsService.loadPermissions(perm);

      var filteredItems = this.navigationService.items.filter(f => allscreens.includes(f.permission));

      this.navigationService.items = filteredItems;

      

    }

  }

}
