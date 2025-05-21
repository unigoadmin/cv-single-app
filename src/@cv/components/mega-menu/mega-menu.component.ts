import { Component, OnInit } from '@angular/core';
import icLayers from '@iconify/icons-ic/twotone-layers';
import { Icon } from '@visurel/iconify-angular';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import icAccountCircle from '@iconify/icons-ic/account-circle';
import { PopoverRef } from '../popover/popover-ref';
import { environment } from '../../../environments/environment'
import icInsert_Drive_File from '@iconify/icons-ic/insert-drive-file';
import { AuthenticationService } from 'src/@shared/services';
import icWork from '@iconify/icons-ic/twotone-work';
import { EmitterService } from '../../services/emitter.service';


export interface MegaMenuModule {
  icon: Icon;
  label: string;
  route: string;
  id:string;
}


@Component({
  selector: 'vex-mega-menu',
  templateUrl: './mega-menu.component.html'
})
export class MegaMenuComponent implements OnInit {

  modules :MegaMenuModule[] = [];
  allModules: MegaMenuModule[] = [
    {
      icon: icAccountCircle,
      label: 'Admin',
      route: environment.publicAppUrl+'#admin', 
      id:'4AB1C7D0-F8DE-4C23-A263-8932B6074E85'
    },
    {
      icon: icLayers,
      label: 'TalentCentral',
      route:  environment.publicAppUrl+'#/talent-central', 
      id:'404A5725-4FB7-470D-AC0F-6AD1086A6C3B'
    },
    {
      icon: icWork,
      label: 'JobCentral',
      route:  environment.publicAppUrl+'#/job-central', 
      id:'D1605CE5-4500-44F4-8ED9-7D40A2F25594'
    },
    {
      icon: icContacts,
      label: 'WorkerCentral',
      route:  environment.publicAppUrl+'#/worker-central',
      id:'D1F78D81-5F25-4F43-BF71-86BE16823816'
    },
    {
      icon: icInsert_Drive_File,
      label: 'DocVault',
      route:  environment.publicAppUrl+'#/docvault', 
      id:'324DE4D0-09D6-4D72-AA8A-8BD530570955'
    }
  ];

  
  constructor(private popoverRef: PopoverRef<MegaMenuComponent>,
    private authService:AuthenticationService,) { }

  ngOnInit() {debugger;
    let loginUser = this.authService.getLoginUser();
    // if(loginUser.EmployerType && (loginUser.EmployerType==1 || loginUser.EmployerType==2)){
    //   let adminModule = this.allModules.find(i=>i.id=='')
    //   this.modules.push(adminModule);
    // }
    loginUser.ModulesList.forEach(userModule=>{
      if(userModule.HasAccess){
        let module = this.allModules.find(i=>i.id == userModule.ModuleId)
        this.modules.push(module);
        
      }
    })

    if(loginUser.Role=='candidate'){
      let wcmodule = this.modules.find(i=>i.id =='D1F78D81-5F25-4F43-BF71-86BE16823816');
      if(wcmodule!=null)
      {
        wcmodule.label='TimeSheets';
        wcmodule.route=environment.publicAppUrl+'#worker-central/timesheets';
      }
        
    }

  }

  close() {

    this.popoverRef.close();
  }
  moduleChange(label){
    if(label==="JobCentral"){
      EmitterService.get("JobCentral").emit(label);
    }else if(label==="TalentCentral"){
      EmitterService.get("TalentCentral").emit(label);
    }
    else if(label==="Admin"){
      EmitterService.get("Admin").emit(label);
    }else if(label==="WorkerCentral"){
      EmitterService.get("WorkerCentral").emit(label);
    }else if(label==="DocVault"){
      EmitterService.get("DocVault").emit(label);
    }
  }
}
