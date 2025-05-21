import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/@shared/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/@shared/services/alert.service';
import { AccountService } from 'src/@shared/http';
import { LoginUser } from 'src/@shared/models/login-user';
import { NavigationService } from 'src/@cv/services/navigation.service';
import icDashboard from '@iconify/icons-ic/dashboard'

@Component({
  selector: 'cv-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  error: boolean;
  constructor(
     private router: Router, 
     private route: ActivatedRoute,
     private _authService:AuthenticationService,
     private _router: Router,
     private _alertService: AlertService,
     private _accountService: AccountService,
     private navigationService: NavigationService,) {}

  async ngOnInit() {
 
    // check for error
    if (this.route.snapshot.fragment.indexOf('error') >= 0) {
       this.error=true; 
       return;    
     }
    
     this._authService.completeAuthentication().then((args) => {
     this.getAuthUser();
    });
  }

  getAuthUser(): void {
    this._accountService.getLoginUserProfile()
        .subscribe(
            response => {
                let loginUser = <LoginUser>response;
               
                this._authService.setLoginUser(loginUser);
                let redirectionUrl = this._authService.getRedirectionURL();
                this._authService.clearRedirectionURL();
                
                  if (redirectionUrl != null && redirectionUrl != '/') {
                    this._router.navigate([redirectionUrl]);
                  }else     if (loginUser.Role == "employer"){
                    this.router.navigate(['documents']);  
                  }
                 else if (loginUser.Role == "candidate"){
                     this.router.navigate(['documents']);  
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
