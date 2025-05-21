import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import icMail from '@iconify/icons-ic/twotone-mail';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { IdentityService } from 'src/@shared/http/identity.service';
import { ResetPassword } from 'src/@shared/models/reset-password';

@Component({
  selector: 'vex-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [fadeInUp400ms]
})
export class ResetPasswordComponent implements OnInit {

  form = this.fb.group({
    Password: [null, Validators.required],
    ConformPassword: [null, Validators.required]
  });
 
  icMail = icMail;

  resetPassword: ResetPassword;
  verficationId: string;
  sub: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _identityService: IdentityService,
    private _alertService: AlertService,
    private route: ActivatedRoute,
    private authService:AuthenticationService
  ) { 
    this.form = this.fb.group({
      'NewPassword': ['', Validators.required],
      'ConfirmPassword': ['', Validators.required],
    });

   }

  ngOnInit() {
    
    this.sub = this.route.params.subscribe(params => {
      this.verficationId = params['Id'].toString() || null;
  });

   if (this.verficationId == null){
          this.login();
    }
  }

  login(){
    this.authService.startAuthentication();
  }
  
  submit() {
    this.resetPassword = <ResetPassword>{};
    const form = this.form.value;
    this.resetPassword.VerificationId = this.verficationId;
    this.resetPassword.NewPassword = form.NewPassword;
    this.resetPassword.ConfirmPassword = form.ConfirmPassword;

    
    if(this.resetPassword.NewPassword.trim()!=this.resetPassword.ConfirmPassword.trim())
    {
        this._alertService.error("New password & Confirm password are not same");
        return ;
    }
    this._identityService.resetPassword(this.resetPassword)
        .subscribe(
        response => {
            if(response.isError==false){
              this._alertService.success("Password is updated successfully");
              this.login();
            }
            else{
              this._alertService.error(response.errorMessage);
            }
           
        },
        error => {
            this._alertService.error(error);
        }
        );
  }
}
