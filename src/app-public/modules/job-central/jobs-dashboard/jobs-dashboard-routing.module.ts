import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobsDashboardComponent } from '../jobs-dashboard/jobs-dashboard.component';
import { JCSecurityAuthGuard } from 'src/@shared/guards/jc.auth.guard';

const routes: Routes = [
  {path:'',component:JobsDashboardComponent,canActivate:[JCSecurityAuthGuard], data: {
    toolbarShadowEnabled: true,
    permissions:{role:['employer'],screens:['SCREEN_JC_RECRUITER_DASHBOARD']}
  }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsDashboardRoutingModule { }
