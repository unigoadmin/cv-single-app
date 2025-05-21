import { Component, OnInit } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { ModuleScreenAction } from '../../../core/models/modulescreenactions';
import { TimesheetService } from '../../../core/http/timesheet.service';
import { TimesheetConfiguration } from '../../../core/models/timesheetNotification';

@Component({
  selector: 'cv-setting-notify',
  templateUrl: './setting-notify.component.html',
  styleUrls: ['./setting-notify.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AuthenticationService, TimeZoneService, TimesheetService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class SettingNotifyComponent implements OnInit {

  public loginUser: LoginUser;
  public timesheetNotification: TimesheetConfiguration = new TimesheetConfiguration();
  public loading = false;
  public moduleAction: ModuleScreenAction;
  constructor(private _alertService: AlertService,
    private _timesheetService: TimesheetService,
    private _authService: AuthenticationService) {
    this.clear();
  }
  clear() {
    this.timesheetNotification = new TimesheetConfiguration();
  }

  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) { this.onGetTimesheetNotificationSettings(this.loginUser.Company.Id); }
  }
  onGetTimesheetNotificationSettings(companyId: number) {
    this._timesheetService.GetTimeSheetNotificationSettings(companyId)
      .subscribe(
        timesheetSettingResponse => {debugger;
          if (timesheetSettingResponse) {
            this.timesheetNotification = timesheetSettingResponse.Data;
            
          }
        },
        error => {
          this._alertService.error(error);
        }
      );
  }
  saveTimeSheetNotify() {

    this.loading = true;
    if (this.timesheetNotification.Id == 0) {
      this.timesheetNotification.CreatedBy = this.loginUser.UserId;
    }
    else { this.timesheetNotification.UpdatedBy = this.loginUser.UserId; }
    this._timesheetService.AddTimesheetNotification(this.timesheetNotification)
      .subscribe(
        timesheetSettings => {
          this._alertService.success("Timesheet notification configuration updated successfully");
          this.loading = false;
        },
        error => {
          this.loading = false;
          this._alertService.error(error);
        }
      );
  }
}
