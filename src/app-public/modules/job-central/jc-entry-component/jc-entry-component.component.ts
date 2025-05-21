import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmitterService } from 'src/@cv/services/emitter.service';
import { LoginUser } from 'src/@shared/models';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import { JobCentralService } from '../core/http/job-central.service';
import { FormPermissionsService } from 'src/@shared/services/formpermissions.service';

@Component({
  selector: 'cv-jc-entry-component',
  templateUrl: './jc-entry-component.component.html',
  providers: [FormPermissionsService]
})
export class JcEntryComponentComponent implements OnInit {
  loginUser: LoginUser;
  constructor(
    private _authService: AuthenticationService,
    private _jobcentralService: JobCentralService,
    private _formService:FormPermissionsService,
    private _alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      EmitterService.get("JobCentral").emit("JobCentral");
      let jcscreens = [];
      let JobCentralModule = this.loginUser.ModulesList.find(i => i.ModuleId == "D1605CE5-4500-44F4-8ED9-7D40A2F25594");
      if (JobCentralModule) {
        jcscreens = JobCentralModule.RoleAssociatedScreens?.split(',');
        if(jcscreens.indexOf("SCREEN_JC_RECRUITER_DASHBOARD") > -1){
          this.router.navigateByUrl('/job-central/recruiter-dashboard');
        }
        else if(jcscreens.indexOf("SCREEN_APPLICANTS_INBOX") > -1){
          this.router.navigateByUrl('/job-central/jobboard-responses');
        }
        else if(jcscreens.indexOf("SCREEN_MY_APPLICANTS") > -1){
          this.router.navigateByUrl('/job-central/my-applicants');
        }
        else if(jcscreens.indexOf("SCREEN_CANDIDATES_DATABASE") > -1){
          this.router.navigateByUrl('/job-central/candidates');
        }
        // else if(jcscreens.indexOf("SCREEN_JOB_INBOX") > -1){
        //   this.router.navigateByUrl('/job-central/jobs-inbox');
        // }
        else if(jcscreens.indexOf("SCREEN_MY_JOBS") > -1){
          this.router.navigateByUrl('/job-central/jobs-dashboard');
        }
      }
      this.GetJobCentralModueFormPermissions(this.loginUser.Company.Id);
    }
  }

  GetJobCentralModueFormPermissions(companyId:number){
    this._jobcentralService.GetJobCentralFormSettings(companyId,'D1605CE5-4500-44F4-8ED9-7D40A2F25594')
    .subscribe(
      jcSettingResponse => {
        if (jcSettingResponse.Data!=null) {
          this._formService.setFormPermissions_JobCentral(jcSettingResponse.Data);
        }
      },
      error => {
        this._alertService.error(error);
      }
    );
  }

  

}
