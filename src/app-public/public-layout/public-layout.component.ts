import { Component, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from 'src/@cv/services/layout.service';
import { filter, map, startWith } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { checkRouterChildsData } from 'src/@cv/utils/check-router-childs-data';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ConfigService } from 'src/@cv/services/config.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SidebarComponent } from 'src/@cv/components/sidebar/sidebar.component';
import { Style, StyleService } from 'src/@cv/services/style.service';
import { ConfigName } from 'src/@cv/interfaces/config-name.model';


@UntilDestroy()
@Component({
  selector: 'vex-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent implements OnInit {

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
              private styleService: StyleService,
              private router: Router) { }

  ngOnInit() {
    this.configService.setConfig(ConfigName.ikaros);
    this.styleService.setStyle(Style.light);
  }
}
