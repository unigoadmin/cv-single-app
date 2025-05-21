import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { trackByRoute } from '../../utils/track-by';
import { NavigationService } from '../../services/navigation.service';
import icRadioButtonChecked from '@iconify/icons-ic/twotone-radio-button-checked';
import icRadioButtonUnchecked from '@iconify/icons-ic/twotone-radio-button-unchecked';
import { LayoutService } from '../../services/layout.service';
import { ConfigService } from '../../services/config.service';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/@shared/services';
import { LoginUser } from 'src/@shared/models';
import { EmitterService } from '../../services/emitter.service';

@Component({
  selector: 'vex-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Input() collapsed: boolean;
  collapsedOpen$ = this.layoutService.sidenavCollapsedOpen$;
  title$ = this.configService.config$.pipe(map(config => config.sidenav.title));
  imageUrl$ = this.configService.config$.pipe(map(config => config.sidenav.imageUrl));
  showCollapsePin$ = this.configService.config$.pipe(map(config => config.sidenav.showCollapsePin));

  items = this.navigationService.items;
  trackByRoute = trackByRoute;
  icRadioButtonChecked = icRadioButtonChecked;
  icRadioButtonUnchecked = icRadioButtonUnchecked;

  companyLogo:string = "";
  comanyName:string = "";
  loginUser:LoginUser;
  constructor(private navigationService: NavigationService,
              private layoutService: LayoutService,
              private configService: ConfigService,
              private authService:AuthenticationService,
              private cdr:ChangeDetectorRef
              ) { }
              _emitjobsidenav=EmitterService.get("JobCentral");
              _emittalsidenav=EmitterService.get("TalentCentral");
              _emittalsidenavadmin=EmitterService.get("Admin");
              _emittalsidenavWorker=EmitterService.get("WorkerCentral");
              _emittalsidenavVault=EmitterService.get("DocVault");
  ngOnInit() {
    this.authService.$loginUser.subscribe((loginUser:LoginUser)=>{
      this.loginUser = loginUser;
      this.companyLogo = this.loginUser.Company.Logo;
      this.comanyName = this.loginUser.Company.Name;
    });
    if(!this.loginUser){
       this.loginUser = this.authService.getLoginUser(); 
       if(this.loginUser){ 
       this.companyLogo = this.loginUser.Company.Logo;
       this.comanyName = this.loginUser.Company.Name;
       }
    }
    this._emitjobsidenav.subscribe(response=>{
      let menu:any[]=JSON.parse(JSON.stringify(this.items))
      menu.forEach(x=>{
        //if(x.label=== "Job Dashboard" || x.label=== "Job Inbox" || x.label==="Applicant Inbox")
        if(x.module==="JobCentral")
        {
          x.disabled=false;
        }else{
          x.disabled=true;
        }
      });
      this.items=JSON.parse(JSON.stringify(menu));
      if(!this.cdr["Destroyed"]){
        this.cdr.detectChanges();
      }
    })
    this._emittalsidenav.subscribe(response=>{
      let menu:any[]=JSON.parse(JSON.stringify(this.items))
      menu.forEach(x=>{
        //if(x.label=== "Job Dashboard" || x.label=== "Inbox" || x.label==="Applicant Inbox")
        if(x.module === "JobCentral"){
          x.disabled=true;
        }else{
          x.disabled=false;
        }
      });
      this.items=JSON.parse(JSON.stringify(menu));
      if(!this.cdr["Destroyed"]){
        this.cdr.detectChanges();
      }
    })
    this._emittalsidenavadmin.subscribe(response=>{
      let menu:any[]=JSON.parse(JSON.stringify(this.items))
      menu.forEach(x=>{
      x.disabled=false;
      });
      this.items=JSON.parse(JSON.stringify(menu));
      if(!this.cdr["Destroyed"]){
      this.cdr.detectChanges();
      }
      })
      this._emittalsidenavWorker.subscribe(response=>{
      let menu:any[]=JSON.parse(JSON.stringify(this.items))
      menu.forEach(x=>{
      x.disabled=false;
      });
      this.items=JSON.parse(JSON.stringify(menu));
      if(!this.cdr["Destroyed"]){
      this.cdr.detectChanges();
      }
      })
      this._emittalsidenavVault.subscribe(response=>{
      let menu:any[]=JSON.parse(JSON.stringify(this.items))
      menu.forEach(x=>{
      x.disabled=false;
      });
      this.items=JSON.parse(JSON.stringify(menu));
      if(!this.cdr["Destroyed"]){
      this.cdr.detectChanges();
      }
      })
  }

  onMouseEnter() {
    this.layoutService.collapseOpenSidenav();
  }

  onMouseLeave() {
    this.layoutService.collapseCloseSidenav();
  }

  toggleCollapse() {
    this.collapsed ? this.layoutService.expandSidenav() : this.layoutService.collapseSidenav();
  }
}
