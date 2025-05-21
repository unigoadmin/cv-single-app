import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JcReportsComponent } from './jc-reports.component';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { JCSecurityAuthGuard } from 'src/@shared/guards/jc.auth.guard';
import { ReportViewComponent } from 'src/@shared/components/shared-reports/report-view/report-view.component';

const routes: Routes = [
  {
    path: '', component: JcReportsComponent, canActivate: [JCSecurityAuthGuard],
    data: {
      toolbarShadowEnabled: true,
      permissions:{role:['employer'],screens:['SCREEN_JC_REPORTS']}
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
export class JobCentralReportsRoutingModule { }
