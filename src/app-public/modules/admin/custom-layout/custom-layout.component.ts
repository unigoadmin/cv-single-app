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
import { UserModules } from 'src/@cv/models/accounttypeenum';
import { NavigationService } from 'src/@cv/services/navigation.service';
import { Subscription } from 'rxjs';
import { AdminNavigationService } from '../services/admin-navigation.service';

@UntilDestroy()
@Component({
  selector: 'vex-custom-layout',
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
    private authService: AuthenticationService,
    private navigationService: NavigationService,
    private adminNavigationService: AdminNavigationService
    ) { }

  ngOnInit() {
    this.adminNavigationService.initializeNavigation();
    this.layoutService.configpanelOpen$.pipe(
      untilDestroyed(this)
    ).subscribe(open => open ? this.configpanel.open() : this.configpanel.close());

    let loginUser = this.authService.getLoginUser();
    if (loginUser) {
    

      if (loginUser.Role == "admin") {
        var filteredItems = this.navigationService.items.filter(f => f.permission == "admin");
      }
      else if (loginUser.Role == "employer") {
        var filteredItems = this.navigationService.items.filter(f => f.permission == "employer");
      }

      this.navigationService.items = filteredItems;

      // let AdminModule = loginUser.ModulesList.find(i=>i.ModuleId==UserModules.Admin);
      // if(loginUser.Role != "employer" || !AdminModule ){
      //   this.router.navigate(['/unauthorized']);
      // }
    }
  }

  
}
