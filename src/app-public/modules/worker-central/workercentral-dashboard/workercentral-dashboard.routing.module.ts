import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';
import { WorkercentralDashboardComponent } from './workercentral-dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: WorkercentralDashboardComponent,
    canActivate:[SecurityAuthGuard],
    data: {
      toolbarShadowEnabled: true,
      permissions: { role: ['employer'],
      screens: ['SCREEN_WC_DASHBOARD'] }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkerCentralDashboardRoutingModule {
}
