import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { ConsultantDashboardComponent } from './consultant-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultantDashboardComponent,
    data: {
      toolbarShadowEnabled: true
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultantDashboardRoutingModule { }
