import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUser } from 'src/@shared/models';
import { AuthenticationService } from 'src/@shared/services';

@Component({
  selector: 'cv-wc-entry-component',
  templateUrl: './wc-entry-component.component.html',
})
export class WcEntryComponentComponent implements OnInit {

  loginUser: LoginUser;
  constructor(
    private _authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {
      if(this.loginUser.Role=="employer"){
        let tcscreens = [];
        let talaentCenrtralModule = this.loginUser.ModulesList.find(i=>i.ModuleId=="D1F78D81-5F25-4F43-BF71-86BE16823816");
        if (talaentCenrtralModule) {
          tcscreens = talaentCenrtralModule.RoleAssociatedScreens?.split(',');
          if(tcscreens){
            if(tcscreens.indexOf("SCREEN_WC_DASHBOARD") > -1){
              this.router.navigateByUrl('/worker-central/wc-dashboard');
            }
            else if(tcscreens.indexOf("SCREEN_PLACEMENTS") > -1){
              this.router.navigateByUrl('/worker-central/placements');
            }
            else if(tcscreens.indexOf("SCREEN_WORKERS") > -1){
              this.router.navigateByUrl('/worker-central/workers');
            }
            else if(tcscreens.indexOf("SCREEN_ASSIGNMENTS") > -1){
              this.router.navigateByUrl('/worker-central/assignments');
            }
            else if(tcscreens.indexOf("SCREEN_MANAGER_DASHBOARD") > -1){
              this.router.navigateByUrl('/worker-central/timesheets/ManagerDashboard');
            }
            else if(tcscreens.indexOf("SCREEN_ADMIN_CONSOLE") > -1){
              this.router.navigateByUrl('/worker-central/wc-admin');
            }
            else if(tcscreens.indexOf("SCREEN_WC_REPORTS") > -1){
              this.router.navigateByUrl('/worker-central/wc-reports');
            }
            else if(tcscreens.indexOf("SCREEN_TIMESHEET_SETTINGS") > -1){
              this.router.navigateByUrl('/worker-central/timesheets/Settings');
            }
          }
          
        }
      }
      else if(this.loginUser.Role=="candidate"){
        this.router.navigateByUrl('/worker-central/timesheets');
      }
   
    }
  }

}
