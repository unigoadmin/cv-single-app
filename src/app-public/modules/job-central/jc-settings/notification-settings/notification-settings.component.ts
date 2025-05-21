import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { AlertService, AuthenticationService, TimeZoneService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { fadeInUp400ms } from 'src/@cv/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@cv/animations/stagger.animation';
import { JobCentralService } from '../../core/http/job-central.service';
import { JobCentralSettings } from '../../core/model/jobcentralsettings';
import icSettings from '@iconify/icons-ic/settings';

@Component({
  selector: 'cv-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
  animations:[
    fadeInUp400ms,
    stagger40ms
  ],
})
export class NotificationSettingsComponent implements OnInit {

  icSettings=icSettings;
  MaxRecruiters:number;
  loginUser: LoginUser;
  public jcSetting: JobCentralSettings = new JobCentralSettings();
  public loading = false;
  public myFilter: any;
  constructor(
    private _alertService: AlertService,
    private _jobcentralService: JobCentralService,
    private _authService: AuthenticationService,
    private cdr:ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      this.getJobCentralSettings(this.loginUser.Company.Id);
    }
  }

  getJobCentralSettings(companyId:number){
    this._jobcentralService.GetJobCentralSettings(companyId)
    .subscribe(
      jcSettingResponse => {
        if (jcSettingResponse.Data!=null) {
          this.jcSetting = jcSettingResponse.Data;
        }
        else
        {
          this.jcSetting = new JobCentralSettings();
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

  saveSettings(){debugger;
   this.jcSetting.CompanyId=this.loginUser.Company.Id;
   this.jcSetting.CreatedBy = this.loginUser.UserId;
   if(this.jcSetting.JCSettings_id > 0)
    this.jcSetting.UpdatedBy = this.loginUser.UserId;
    this._jobcentralService.SaveJobCentralSettings(this.jcSetting)
    .subscribe(jcSettings => {
      if(jcSettings.IsError==true){
       this._alertService.error(jcSettings.ErrorMessage);
       this.loading = false;

      }
      else{
       this._alertService.success("Setting Saved Successfully");
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

  onReviewEventChanged(isEnabled: boolean) {

  }

}
