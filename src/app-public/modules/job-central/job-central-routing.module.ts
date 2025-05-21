import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';

const routes: Routes = [
  {
    path: '',
    component: CustomLayoutComponent,
    children:[
      {
        path:'',
        loadChildren:()=>import('./jc-entry-component/jc-entry.module')
        .then(m=>m.JobCentralEntryModule)
     },
     {
       path:'jobs-dashboard',
       loadChildren:()=>import('./jobs-dashboard/jobs-dashboard.module')
       .then(m=>m.JobsDashboardModule)
     },
     {
       path:'candidates',
       loadChildren:()=>import('./candidates-list/candidates-list.module')
       .then(m=>m.CandidatesListModule)
     },
     {
       path:'jcsettings',
       loadChildren:()=>import('./jc-settings/jc-settings.module')
       .then(m=>m.JobCentralSettingsModule)
     },
     {
      path:'recruiter-dashboard',
      loadChildren:()=>import('./recruiter-dashboard/recruiter-dashboard.module')
      .then(m=>m.JobCentralDashboardModule)
    },
    {
      path:'archived-responses',
      loadChildren:()=>import('./archived-responses/archived-reposes.module')
      .then(m=>m.ArchivedResponsesInboxModule)
    },
    {
      path:'new-jobboard-responses',
      loadChildren:()=>import('./jobboard-responses/jobboard-responses.module')
      .then(m=>m.JobBoardResponsesModule)
    },
    {
      path:'requisition-responses',
      loadChildren:()=>import('./requisitions-responses/requisitions-responses.module')
      .then(m=>m.RequisitionsResponsesModule)
    },
    {
      path:'hotlist-jobs',
      loadChildren:()=>import('./jobs-hot-list/jobs-hotlist.module')
      .then(m=>m.JobsHotListModule)
    },
    {
      path:'jc-reports',
      loadChildren:()=>import('./jc-reports/jc-reports-module')
      .then(m=>m.JobCentralReportsModule)
    }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobCentralRoutingModule { }
