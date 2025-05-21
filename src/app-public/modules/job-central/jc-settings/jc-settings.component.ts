import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { JobCentralSettings } from '../core/model/jobcentralsettings';
import icSettings from '@iconify/icons-ic/settings';
import { EmitterService } from 'src/@cv/services/emitter.service';

@Component({
  selector: 'cv-jc-settings',
  templateUrl: './jc-settings.component.html',
  styleUrls: ['./jc-settings.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AuthenticationService, TimeZoneService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class JcSettingsComponent implements OnInit {
  @Input() index: number = 0;
  icSettings = icSettings;
  MaxRecruiters: number;
  loginUser: LoginUser;
  public jcSetting: JobCentralSettings = new JobCentralSettings();
  public loading = false;
  public myFilter: any;
  constructor(
    private _authService: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      EmitterService.get("JobCentral").emit("JobCentral");
    }
  }

}
