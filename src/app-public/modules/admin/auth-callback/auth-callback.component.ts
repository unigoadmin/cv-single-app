import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/@shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/@shared/services/alert.service';
import { AccountService } from 'src/@shared/http';
import { LoginUser } from 'src/@shared/models/login-user';


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
    private _router: Router,
    private _alertService: AlertService,
    private _accountService: AccountService,) { }

  async ngOnInit() {

    // check for error
    if (this.route.snapshot.fragment.indexOf('error') >= 0) {
      this.error = true;
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
          debugger;
          let loginUser = <LoginUser>response;

          this._authService.setLoginUser(loginUser);
          let redirectionUrl = this._authService.getRedirectionURL();
          this._authService.clearRedirectionURL();

          if (loginUser.Role == "employer") {
            if (redirectionUrl != null && redirectionUrl != '/') {
              this._router.navigate([redirectionUrl]);
            } else {
              this.router.navigate(['admin-console']);
            }
          }
          else if (loginUser.Role == "admin") {
            if (redirectionUrl != null && redirectionUrl != '/') {
              this._router.navigate([redirectionUrl]);
            } else {
              this.router.navigate(['admin-companies']);
            }
          }
          else {
            this._router.navigate(['/unauthorized']);
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }
}
