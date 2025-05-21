import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { timesheetSettings } from '../../../core/models/timesheetSettings'; 
import { ModuleScreenAction } from '../../../core/models/modulescreenactions';
import { TimesheetService } from '../../../core/http/timesheet.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { isNullOrUndefined } from 'src/@shared/services/helpers';
import moment from 'moment';

@Component({
  selector: 'cv-timesheet-features',
  templateUrl: './timesheet-features.component.html',
  styleUrls: ['./timesheet-features.component.scss'],
  animations:[
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [AuthenticationService, TimeZoneService,TimesheetService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class TimesheetFeaturesComponent implements OnInit {

  public loginUser: LoginUser;
  public timesheetSetting: timesheetSettings = new timesheetSettings();
  public loading = false;
  public moduleAction: ModuleScreenAction=new ModuleScreenAction();
  public myFilter: any;
  
  constructor(
    private _alertService: AlertService,
    private _timesheetService: TimesheetService,
    private _authService: AuthenticationService,
    private cdr:ChangeDetectorRef
  ) { }

  clear() {
    this.timesheetSetting = new timesheetSettings();
  }
  ngOnInit() {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.onGetTimesheetSettings(this.loginUser.Company.Id);
    }
  }
  onGetTimesheetSettings(companyId: number) {
    this._timesheetService.GetTimesheetConfiguration(companyId)
      .subscribe(
        timesheetSettingResponse => {
          if (timesheetSettingResponse.Data!=null) {
            this.timesheetSetting = timesheetSettingResponse.Data;
          }
          else
          {
            this.timesheetSetting = new timesheetSettings();
          }
          if(!this.cdr["distroyed"]){
            this.cdr.detectChanges();
          }
        },
        error => {
          this._alertService.error(error);
          if(!this.cdr["distroyed"]){
            this.cdr.detectChanges();
          }
        }
      );
  }
  saveTimeSheetSettings() {
    if (this.timesheetSetting.StandardHoursMax && this.timesheetSetting.StandardHoursMax > 24) {
      this._alertService.error("Total Standard hours cannot be greater than 24");
      return;
    }
    if (this.timesheetSetting.MinWeeklyDescription > this.timesheetSetting.MaxWeeklyDescription) {
      this._alertService.error("maximum value should be greater than minimum value");
      return;
    }
    if(this.timesheetSetting.TimesheetType==0){
      this._alertService.error("Please Select Timesheet Type");
      return;
    }
    if(this.timesheetSetting.TimesheetStartDate==null){
      this._alertService.error("Please Enter Timesheet Start Date");
      return;
    }
    if(!isNullOrUndefined(this.timesheetSetting.TimesheetStartDate)){
      let StartDate: any = moment(this.timesheetSetting.TimesheetStartDate).format("YYYY-MM-DDTHH:mm:ss.ms")
        this.timesheetSetting.TimesheetStartDate = StartDate;
    }
    this.loading = true;
    this.timesheetSetting.CompanyId = this.loginUser.Company.Id;
    if (this.timesheetSetting.TimesheetConfigID == 0) {
      this.timesheetSetting.CreatedBy = this.loginUser.UserId;
    }
    else { this.timesheetSetting.UpdatedBy = this.loginUser.UserId; }

    this._timesheetService.TimesheetConfiguration(this.timesheetSetting)
      .subscribe(
        timesheetSettings => {
         if(timesheetSettings.IsError==true){
          this._alertService.error(timesheetSettings.ErrorMessage);
          this.loading = false;

         }
         else{
          this._alertService.success("Timesheet Setting Saved Successfully");
          this.loading = false;
         }
         if(!this.cdr["distroyed"]){
            this.cdr.detectChanges();
          }
        },
        error => {
          this.loading = false;
          this._alertService.error(error);
          if(!this.cdr["distroyed"]){
            this.cdr.detectChanges();
          }
        }
      );
  }
  mailcheck(event) {
    this.timesheetSetting.FromSuperAdminEmail = event.target.checked;
  }

  onSelectStartdate(event: MatDatepickerInputEvent<Date>) {
    this.timesheetSetting.TimesheetStartDate = event.value;
  }
}
