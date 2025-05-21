import { Component, OnInit } from '@angular/core';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icAssigment from '@iconify/icons-ic/twotone-assignment';
import { Icon } from '@visurel/iconify-angular';
import icContactSupport from '@iconify/icons-ic/twotone-contact-support';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import icAssessment from '@iconify/icons-ic/twotone-assessment';
import icBook from '@iconify/icons-ic/twotone-book';
import icAccountCircle from '@iconify/icons-ic/account-circle';
import { PopoverRef } from '../popover/popover-ref';
import { environment } from '../../../environments/environment'
import icInsert_Drive_File from '@iconify/icons-ic/insert-drive-file';
import { AlertService, AuthenticationService } from 'src/@shared/services';
import icWork from '@iconify/icons-ic/twotone-work';
import { TerminateworkerComponent } from './terminateworker/terminateworker.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { UpdateAssignmentComponent } from './update-assignment/update-assignment.component';


export interface ProcessMenuPage {
  label: string;
  route: string;
  screencode:string;
  actioncode:string;
  id:number;
}

@Component({
  selector: 'vex-process-menu',
  templateUrl: './process-menu.component.html'
})
export class ProcessMenuComponent implements OnInit {
  icLayers=icLayers;
  icContacts=icContacts;
  atsPages: ProcessMenuPage[] =[];
  allatsPages: ProcessMenuPage[] = [
    {
      label: 'Add Candidate',
      route: environment.atsAppUrl+'#/talent-central/bench-candidates',
      screencode:'SCREEN_BENCH_CANDIDATES',
      actioncode :'ACTION_BENCH_CANDIDATES_ADD',
      id:1
    },
    {
      label: 'Make a Submission',
      route: environment.atsAppUrl+'#/talent-central/submissions',
      screencode:'SCREEN_SUBMISSIONS',
      actioncode :'ACTION_SUBMISSIONS_ADD',
      id:2
    },
    {
      label: 'Create a Confirmation',
      route: environment.atsAppUrl+'#/talent-central/confirmations',
      screencode:'SCREEN_CONFIRMATIONS',
      actioncode :'ACTION_CONFIRMATIONS_ADD',
      id:3
    },
    
  ];

  wcPages: ProcessMenuPage[] =[];
  allwcPages: ProcessMenuPage[] = [
    {
      label: 'Terminate a Worker',
      route:  environment.employeecentralAppUrl+'#/worker-central/workers',
      screencode:'SCREEN_WORKERS',
      actioncode :'ACTION_WORKERS_DELETE',
      id:4
    },
    {
      label: 'Create a Placement',
      route:  environment.employeecentralAppUrl+'#/worker-central/placements',
      screencode:'SCREEN_PLACEMENTS',
      actioncode :'ACTION_PLACEMENTS_ADD',
      id:5
    },
    {
      label: 'Update an Assignment',
      route:  environment.employeecentralAppUrl+'#/worker-central/assignments',
      screencode:'SCREEN_ASSIGNMENTS',
      actioncode :'ACTION_ASSIGNMENTS_MODIFY',
      id:6
    },
    {
      label: 'Submit a Timesheet',
      route:  environment.employeecentralAppUrl,
      screencode:'SCREEN_TIME_SHEETS',
      actioncode :'ACTION_TIME_SHEETS_ADD',
      id:7
    },
    {
      label: 'Approve Timesheet',
      route:  environment.employeecentralAppUrl,
      screencode:'SCREEN_MANAGER_DASHBOARD',
      actioncode :'ACTION_MANAGER_DASHBOARD_MODIFY',
      id:8
    },
  ];

  constructor(
    private popoverRef: PopoverRef<ProcessMenuComponent>,
    private authService:AuthenticationService,
    private dialog: MatDialog,
    private matIconRegistry: MatIconRegistry,
    private domSanitzer: DomSanitizer,
    private _alertService: AlertService,
    ) { }

  ngOnInit() {
    let loginUser = this.authService.getLoginUser();
    loginUser.ModulesList.forEach(userModule=>{
      if(userModule.HasAccess){
         let associatedScreens = userModule.RoleAssociatedScreens?.split(',');
         let associatedActions = userModule.RoleAssociatedActions?.split(',');
         associatedScreens?.forEach(screenCode=>{
          let atspage = this.allatsPages.find(i=> i.screencode == screenCode);
          if(atspage && userModule.RoleAssociatedActions?.includes(atspage.actioncode)){
            this.atsPages.push(atspage)
          }
 
          let wspage = this.allwcPages.find(i=> i.screencode == screenCode);
          if(wspage && userModule.RoleAssociatedActions?.includes(wspage.actioncode)){
            this.wcPages.push(wspage)
          }
         })
      }
    })
  }
  TerminateWorker() {
    this.dialog.open(TerminateworkerComponent, { width: '80%', panelClass: "dialog-class",disableClose:true }).afterClosed().subscribe((emp) => {
      if (emp) {
        
      }
    });
  }
  updateAssignment() {
    this.dialog.open(UpdateAssignmentComponent, { width: '80%', panelClass: "dialog-class",disableClose:true }).afterClosed().subscribe((emp) => {
      if (emp) {
        
      }
    });
  }
  closeProcessMenu(page:ProcessMenuPage) {
    this.popoverRef.close();
    if(page.id===4){
       this.TerminateWorker();
    }else if(page.id===6){
      this.updateAssignment();
    }
  }
}
