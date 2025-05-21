import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { LoginUser } from 'src/@shared/models';
import { iconsFA } from 'src/static-data/icons-fa';  
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { GlobalSettingsService } from 'src/@shared/http/globalsettings.service';
import { SessionSettings } from '../../core/models/globalsettings';
import { IconService } from 'src/@shared/services/icon.service';

@UntilDestroy()
@Component({
  selector: 'cv-session-settings',
  templateUrl: './session-settings.component.html',
  styleUrls: ['./session-settings.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AuthenticationService, GlobalSettingsService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class SessionSettingsComponent implements OnInit {

  loginUser: LoginUser;

  IsHashTagLoading: boolean = false;
  searchCtrl = new FormControl();

  filteredIcons: string;
  SessionSettingsform: FormGroup;

  sessionSettingsModel = {
    IdleTimeout: 0,
    SessionTimeout: 0,
    KeepAliveInterval: 0
  };
  currentSettings = [];


  constructor(
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private _formBuilder: FormBuilder,
    private service: GlobalSettingsService,
    public iconService: IconService
  ) {
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin.svg')
    );
    this.matIconRegistry.addSvgIcon('disable-linkedin', this.domSanitzer.bypassSecurityTrustResourceUrl('assets/img/demo/rounded_linkedin-disable.svg'));

  }


  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.filteredIcons = iconsFA.find(iconName => iconName == "fa-filter");
      this.GetCompanySettings();
    }

  }

  GetCompanySettings() {
    this.service.GetSessionSettingsList(this.loginUser.Company.Id).subscribe(response => {
      if (response.Data) {
        this.currentSettings = response.Data;
        response.Data.forEach(setting => {
          switch (setting.SettingKey) {
            case 'IdleTimeout':
              this.sessionSettingsModel.IdleTimeout = Number(setting.SettingValue) || 0;
              break;
            case 'SessionTimeout':
              this.sessionSettingsModel.SessionTimeout = Number(setting.SettingValue) || 0;
              break;
            case 'KeepAliveInterval':
              this.sessionSettingsModel.KeepAliveInterval = Number(setting.SettingValue) || 0;
              break;
          }
        });
      }
    });
  }

  // UpdateSessionSettings() {
  //   const updatedSettings = [
  //     { SettingKey: 'IdleTimeout', SettingValue: this.sessionSettingsModel.IdleTimeout },
  //     { SettingKey: 'SessionTimeout', SettingValue: this.sessionSettingsModel.SessionTimeout },
  //     { SettingKey: 'KeepAliveInterval', SettingValue: this.sessionSettingsModel.KeepAliveInterval }
  //   ];

  //   this.service.SaveSessionSettings(updatedSettings).subscribe(response => {
  //     this.GetCompanySettings();
  //     this._alertService.success("Session Setting values updated successfully");
  //   },
  //     error => {
  //       this._alertService.error(error);
  //     }
  //   );
  // }

  UpdateSessionSettings() {
    const updatedSettings = this.currentSettings.map(setting => {
      let updatedValue;
      switch (setting.SettingKey) {
        case 'IdleTimeout':
          updatedValue = this.sessionSettingsModel.IdleTimeout;
          break;
        case 'SessionTimeout':
          updatedValue = this.sessionSettingsModel.SessionTimeout;
          break;
        case 'KeepAliveInterval':
          updatedValue = this.sessionSettingsModel.KeepAliveInterval;
          break;
        default:
          updatedValue = setting.SettingValue; // Keep unchanged values
      }
      return {
        Id: setting.Id,  // Retain original ID
        SettingKey: setting.SettingKey,
        SettingValue: updatedValue.toString(), // Convert to string
        UpdatedAt: new Date(), // Set updated time
        CompanyId: setting.CompanyId // Retain original company ID
      };
    });
    
    console.log(updatedSettings);
    this.service.SaveSessionSettings(updatedSettings).subscribe(response => {
      this.GetCompanySettings();
      this._alertService.success("Session Setting values updated successfully");
    },
      error => {
        this._alertService.error(error);
      }
    );
  }

}
