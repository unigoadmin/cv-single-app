import { Component, Inject, LOCALE_ID, Renderer2 ,OnInit} from '@angular/core';
import { ConfigService } from '../@cv/services/config.service';
import { Settings } from 'luxon';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { NavigationService } from '../@cv/services/navigation.service';
import icLayers from '@iconify/icons-ic/twotone-layers';
import { LayoutService } from '../@cv/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SplashScreenService } from '../@cv/services/splash-screen.service';
import { Style, StyleService } from '../@cv/services/style.service';
import { ConfigName } from '../@cv/interfaces/config-name.model';
import icHome  from '@iconify/icons-ic/home'
import isSupervised_User_Circle  from '@iconify/icons-ic/sharp-supervised-user-circle'
import icVerifiedUser  from '@iconify/icons-ic/verified-user'
 import icBusiness  from '@iconify/icons-ic/business'
 import icPerm_Data_Setting  from '@iconify/icons-ic/perm-data-setting'
 import icPayment  from '@iconify/icons-ic/payment'
 import icSettings_Applications  from '@iconify/icons-ic/settings-applications'
 import icAnnouncement  from '@iconify/icons-ic/announcement'
 import icView_Module from '@iconify/icons-ic/view-module'
 import icDashboard from '@iconify/icons-ic/dashboard'
 
import { LoginUser } from 'src/@shared/models';
import { AuthenticationService ,SessionManagementService} from 'src/@shared/services';


@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Consultvite Admin';

  loginUser: LoginUser;
  constructor(private configService: ConfigService,
              private styleService: StyleService,
              private renderer: Renderer2,
              private platform: Platform,
              @Inject(DOCUMENT) private document: Document,
              @Inject(LOCALE_ID) private localeId: string,
              private layoutService: LayoutService,
              private route: ActivatedRoute,
              private navigationService: NavigationService,
              private splashScreenService: SplashScreenService,
              private _authService: AuthenticationService,
              private sessionManagementService: SessionManagementService) {
    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }

    /**
     * Customize the template to your needs with the ConfigService
     * Example:
     *  this.configService.updateConfig({
     *    sidenav: {
     *      title: 'Custom App',
     *      imageUrl: '//placehold.it/100x100',
     *      showCollapsePin: false
     *    },
     *    showConfigButton: false,
     *    footer: {
     *      visible: false
     *    }
     *  });
     */

    /**
     * Config Related Subscriptions
     * You can remove this if you don't need the functionality of being able to enable specific configs with queryParams
     * Example: example.com/?layout=apollo&style=default
     */
    this.route.queryParamMap.pipe(
      map(queryParamMap => queryParamMap.has('rtl') && coerceBooleanProperty(queryParamMap.get('rtl'))),
    ).subscribe(isRtl => {
      this.document.body.dir = isRtl ? 'rtl' : 'ltr';
      this.configService.updateConfig({
        rtl: isRtl
      });
    });

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('layout'))
    ).subscribe(queryParamMap => this.configService.setConfig(queryParamMap.get('layout') as ConfigName));

    this.route.queryParamMap.pipe(
      filter(queryParamMap => queryParamMap.has('style'))
    ).subscribe(queryParamMap => this.styleService.setStyle(queryParamMap.get('style') as Style));


    if (this._authService.isLoggedIn()) {
      this.navigationService.items = [];
    }
    else{

      this.navigationService.items = [
        {
          type: 'link',
          label: 'HOME',
          route: '/home',
          icon: icHome,
          routerLinkActiveOptions: { exact: true }
        },
        {
          type: 'link',
          label: 'CONTACT',
          route: '/contact',
          icon: icBusiness,
        },
        
      ];
    }
    
  }

  ngOnInit() {
    this._authService.$loginUser
      .pipe(
        filter(u => u !== undefined), // Wait for the first emission
        take(1)
      )
      .subscribe(user => {
        if (user) {
          this.sessionManagementService.initializeSession(user.Company.Id);
        }
      });
  }
}
