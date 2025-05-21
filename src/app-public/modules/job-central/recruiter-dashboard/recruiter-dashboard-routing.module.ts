import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { JCRecruiterDashboardComponent } from './recruiter-dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: JCRecruiterDashboardComponent,canActivate:[AuthGuard],data: {
      toolbarShadowEnabled: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobCentralDashboardRoutingModule {
}
