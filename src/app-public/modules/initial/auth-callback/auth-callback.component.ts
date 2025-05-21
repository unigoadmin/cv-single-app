import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/@shared/services';
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
    private _authService: AuthenticationService,
    private _alertService: AlertService,
    private _accountService: AccountService,
    private navigationService: NavigationService,) { }

  async ngOnInit() {debugger;
    try {
      // First try to restore the user
      await this._authService.completeAuthentication();
      
      // Check if we already have login user data
      const existingLoginUser = this._authService.getLoginUser();
      if (existingLoginUser) {
        // If we have login user data, just redirect
        this.handleRedirection(existingLoginUser);
      } else {
        // If no login user data, get it from the server
        this.getAuthUser();
      }
    } catch (error) {debugger;
      console.error('Error in auth callback:', error);
      this._alertService.error('Authentication failed. Please try again.');
      this.router.navigate(['/home']);
    }
  }

  private handleRedirection(loginUser: LoginUser) {
    let redirectionUrl = this._authService.getRedirectionURL();
    this._authService.clearRedirectionURL();

    if (redirectionUrl != null && redirectionUrl != '/') {
      this.router.navigate([redirectionUrl]);
    } else {
      switch (loginUser.Role) {
        case 'employer':
          this.router.navigate(['/dashboard']);
          break;
        case 'candidate':
          this.router.navigate(['/consultant-dashboard']);
          break;
        case 'admin':
          this.router.navigate(['/superadmin-dashboard']);
          break;
        default:
          this.router.navigate(['/unauthorized']);
      }
    }
  }

  getAuthUser(): void {
    this._accountService.getLoginUserProfile()
      .subscribe(
        response => {
          this.navigationService.items = [];
          const loginUser = <LoginUser>response;
          this._authService.setLoginUser(loginUser);
          this.handleRedirection(loginUser);
        },
        error => {
          console.error('Error getting user profile:', error);
          this._alertService.error('Failed to get user profile. Please try again.');
          this.router.navigate(['/home']);
        }
      );
  }
}
