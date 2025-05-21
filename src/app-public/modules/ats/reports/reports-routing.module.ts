import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportViewComponent } from 'src/@shared/components/shared-reports/report-view/report-view.component';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';
import { AtsReportsComponent } from '../reports/ats-reports/ats-reports.component';


// const routes: Routes = [
//   {path:'',loadChildren:()=>import('./ats-reports/ats-reports.module').then(m=>m.AtsReportModule)},
//   {path:'ats-reports',loadChildren:()=>import('./ats-reports/ats-reports.module').then(m=>m.AtsReportModule)}
// ];

const routes: Routes = [
  {
    path: '', component: AtsReportsComponent,
    canActivate: [SecurityAuthGuard],
    data: {
      toolbarShadowEnabled: true,
      permissions: {
        role: ['employer'],
        screens: ['SCREEN_TC_REPORTS']
      }
    }
  },
  {
    path: 'submissions/:id/:reportid/:isdef/:rptTypeName/:moduleName/:category', component: ReportViewComponent,
    canActivate: [AuthGuard],
    data: { toolbarShadowEnabled: true }
  },
  {
    path: 'report-view',
    component: ReportViewComponent,
    canActivate: [AuthGuard],
    data: { toolbarShadowEnabled: true }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
