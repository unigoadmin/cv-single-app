import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from 'src/@shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/@shared/services/alert.service';
import { AccountService } from 'src/@shared/http';
import { LoginUser } from 'src/@shared/models/login-user';
import { NavigationService } from 'src/@cv/services/navigation.service';
import { IconService } from 'src/@shared/services/icon.service';
import icBook from '@iconify/icons-ic/twotone-book';
import icAssigment from '@iconify/icons-ic/twotone-assignment';
import icdashboard from '@iconify/icons-ic/twotone-dashboard';
import icPerson from '@iconify/icons-ic/twotone-person';
import icEvent from '@iconify/icons-ic/event';
import icDashboard from '@iconify/icons-ic/dashboard';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icSettings from '@iconify/icons-ic/settings';
import icReports from '@iconify/icons-ic/round-file-copy';


@Component({
  selector: 'cv-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  error: boolean;
  Items:any;
  canItems:any;
  constructor(
     private router: Router, 
     private route: ActivatedRoute,
     private _authService:AuthenticationService,
     private _router: Router,
     private _alertService: AlertService,
     private _accountService: AccountService,
     private navigationService: NavigationService,
     private cdref:ChangeDetectorRef,
     public iconService: IconService,) {}

  async ngOnInit() {
 
    // check for error
    if (this.route.snapshot.fragment.indexOf('error') >= 0) {
       this.error=true; 
       return;    
     }
    
    this.canItems= [
      {
        type: 'link',
        label: 'Timesheets',
        route: '/worker-central/timesheets',
        icon: icEvent,
        disabled:false,
        routerLinkActiveOptions: { exact: true },
        permission:'SCREEN_TIMESHEETS_CONSULTANT'
      },
     
    ];
     this._authService.completeAuthentication().then((args) => {
     this.getAuthUser();
    });
    
  }

  getAuthUser(): void {

    this._accountService.getLoginUserProfile()
        .subscribe(
            response => {
                let loginUser = <LoginUser>response;
                if(loginUser.Role == "employer"){
                  this.navigationService.items = this.Items;
                }
                else
                {
                  this.navigationService.items = this.canItems;
                }
                this._authService.setLoginUser(loginUser);
                let redirectionUrl = this._authService.getRedirectionURL();
                this._authService.clearRedirectionURL();

                if (!this.cdref["distroyed"]) {
                  this.cdref.detectChanges();
                }

                if (loginUser.Role == "employer"){
                  if (redirectionUrl != null && redirectionUrl != '/') {
                    this._router.navigate([redirectionUrl]);
                  }else{
                    this.router.navigate(['worker-central']);  
                  }
                }
                else if(loginUser.Role == "candidate"){
                  this._router.navigate(['/timesheets']);
                 } 
                 else{
                  this._router.navigate(['/unauthorized']);
                 }
            },
            error => {
                this._alertService.error(error);
            }
        );
          }
        }
