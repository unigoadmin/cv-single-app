import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import icClose from '@iconify/icons-ic/twotone-close';
import { AuthenticationService } from 'src/@shared/services/authentication.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'cv-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class UnauthorizedComponent implements OnInit ,AfterViewInit {

  icClose = icClose;
  dashboarURL= environment.publicAppUrl+'#/consultant-dashboard';

  constructor(private authenticationService: AuthenticationService, private router: Router,) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }
  ongoback(){
    let loginUser = this.authenticationService.getLoginUser();
    if(loginUser!=null){
      if (loginUser.Role == "employer"){
        this.dashboarURL = environment.publicAppUrl+'#/dashboard';
      }
    }
    else{
      this.authenticationService.signOut();
    }
  }
}
