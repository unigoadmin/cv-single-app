import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { AlertService, AuthenticationService, CountryCodeService } from 'src/@shared/services';
import { SignUp } from 'src/@shared/models/signup';
import { TermsAndCondtionsComponent } from 'src/@shared/components/terms-and-condtions/terms-and-condtions.component';
import { MatDialog } from '@angular/material/dialog';
import { CountriesList, Country } from 'src/@shared/models';
import { IdentityService } from 'src/@shared/http/identity.service';

@Component({
  selector: 'vex-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class VerifyComponent implements OnInit {

  isSuccess:boolean = false;
  private sub: any;
  private verficationId: string;
  constructor(private dialog: MatDialog,
              private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private authService:AuthenticationService,
              private _alertService: AlertService,
              private _identityService: IdentityService,
              private route: ActivatedRoute) {
               
               }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {debugger;
      this.verficationId = params['Id'].toString() || null;
    });

    if (this.verficationId == null){
         // this.login();
    }
    else{
          this.verifyEmail();
    }
  }

  login(){
    this.authService.startAuthentication();
  }

  verifyEmail(){
      this._identityService.verifyEmail(this.verficationId)
      .subscribe(
      response => {
        this.isSuccess = true;
      },
      error => {
        this.isSuccess = false;
      });
  }
}
