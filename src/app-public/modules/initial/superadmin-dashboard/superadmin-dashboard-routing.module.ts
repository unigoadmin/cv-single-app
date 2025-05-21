import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { SuperadminDashboardComponent } from './superadmin-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: SuperadminDashboardComponent,
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
export class SuperAdminDashboardRoutingModule { }
