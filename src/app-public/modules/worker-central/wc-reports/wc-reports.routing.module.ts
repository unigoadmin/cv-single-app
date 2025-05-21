import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomizeReportComponent } from 'src/@shared/components/shared-reports/customize-report/customize-report.component';
import { ReportViewComponent } from 'src/@shared/components/shared-reports/report-view/report-view.component';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';
import { WCReportsComponent } from './wc-reports.component';



const routes: Routes = [
  {
    path: '', component: WCReportsComponent,
    data: { toolbarShadowEnabled: true, permissions: { role: ['employer'], screens: ['SCREEN_WC_REPORTS'] } }, canActivate: [SecurityAuthGuard]
  },
  {
    path: 'submissions/:id/:reportid/:isdef/:rptTypeName/:moduleName/:category', component: ReportViewComponent,
    canActivate: [SecurityAuthGuard],
    data: { toolbarShadowEnabled: true, permissions: { role: ['employer'], screens: ['SCREEN_WC_REPORTS'] } }
  },
  {
    path: 'report-view',
    component: ReportViewComponent,
    canActivate: [SecurityAuthGuard],
    data: { toolbarShadowEnabled: true, permissions: { role: ['employer'], screens: ['SCREEN_WC_REPORTS'] } }
  },
  {
    path: 'customize', component: CustomizeReportComponent,
    data: { toolbarShadowEnabled: true }, canActivate: [SecurityAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WCReportsRoutingModule { }