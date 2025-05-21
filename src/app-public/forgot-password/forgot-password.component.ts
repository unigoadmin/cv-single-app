import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import icMail from '@iconify/icons-ic/twotone-mail';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { AlertService } from 'src/@shared/services';
import { IdentityService } from 'src/@shared/http/identity.service';

@Component({
  selector: 'vex-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [fadeInUp400ms]
})
export class ForgotPasswordComponent implements OnInit {

  form = this.fb.group({
    email: [null, Validators.required]
  });
 
  icMail = icMail;
  isSuccess:boolean = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _identityService: IdentityService,
    private _alertService: AlertService,
  ) { }

  ngOnInit() {
  }

  
  send() {
    const form = this.form.value;
      this._identityService.sendResetUrlLink(form.email)
        .subscribe(
        response => {
            this.isSuccess = true;
            this._alertService.success("Password reset activation link is sent to your e-mail id");
        },
        error => {
            this._alertService.error(error);
        }
        );
  }
}
