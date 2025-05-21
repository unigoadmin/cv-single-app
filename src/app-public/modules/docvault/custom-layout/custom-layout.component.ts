import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/@cv/services/layout.service';
import { filter, map, startWith } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { checkRouterChildsData } from 'src/@cv/utils/check-router-childs-data';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ConfigService } from 'src/@cv/services/config.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SidebarComponent } from 'src/@cv/components/sidebar/sidebar.component';
import { ConfigName } from 'src/@cv/interfaces/config-name.model';
import { Style, StyleService } from 'src/@cv/services/style.service';
import { NavigationService } from 'src/@cv/services/navigation.service';
import { AuthenticationService } from 'src/@shared/services';


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

  

  toolbarShadowEnabled$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    map(() => checkRouterChildsData(this.router.routerState.root.snapshot, data => data.toolbarShadowEnabled))
  );

  @ViewChild('configpanel', { static: true }) configpanel: SidebarComponent;

  constructor(private layoutService: LayoutService,
    private configService: ConfigService,
    private breakpointObserver: BreakpointObserver,
    private styleService: StyleService,
    private router: Router,
    private navigationService: NavigationService,
    private _authService: AuthenticationService,
    ) { }

  ngOnInit() {
    this.layoutService.configpanelOpen$.pipe(
      untilDestroyed(this)
    ).subscribe(open => open ? this.configpanel.open() : this.configpanel.close());

    let loginUser = this._authService.getLoginUser();
    if (loginUser) {
      
    }
  }


}
