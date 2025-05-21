import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUser } from 'src/@shared/models';
import { AuthenticationService } from 'src/@shared/services';

@Component({
  selector: 'cv-tc-entry-component',
  templateUrl: './tc-entry-component.component.html',
})
export class TcEntryComponentComponent implements OnInit {

  loginUser: LoginUser;
  constructor(
    private _authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {debugger;
    this.loginUser = this._authService.getLoginUser();
    if (this.loginUser) {debugger;
      let tcscreens = [];
      let talaentCenrtralModule = this.loginUser.ModulesList.find(i=>i.ModuleId=="404A5725-4FB7-470D-AC0F-6AD1086A6C3B");
      if (talaentCenrtralModule) {
        tcscreens = talaentCenrtralModule.RoleAssociatedScreens?.split(',');
        if(tcscreens.indexOf("SCREEN_BENCH_CANDIDATES") > -1){
          this.router.navigateByUrl('/talent-central/bench-candidates');
        }
        else if(tcscreens.indexOf("SCREEN_SUBMISSIONS") > -1){
          this.router.navigateByUrl('/talent-central/submissions');
        }
        else if(tcscreens.indexOf("SCREEN_INTERVIEWS") > -1){
          this.router.navigateByUrl('/talent-central/interviews');
        }
        else if(tcscreens.indexOf("SCREEN_CONFIRMATIONS") > -1){
          this.router.navigateByUrl('/talent-central/confirmations');
        }
        else if(tcscreens.indexOf("SCREEN_SEARCH_CANDIDATES") > -1){
          this.router.navigateByUrl('/talent-central/candidates');
        }
        else if(tcscreens.indexOf("SCREEN_SETTINGS") > -1){
          this.router.navigateByUrl('/talent-central/settings');
        }
        else if(tcscreens.indexOf("SCREEN_TC_REPORTS") > -1){
          this.router.navigateByUrl('/talent-central/ats-reports');
        }
      }
    }
  }

}

