import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperadminConsoleComponent } from '../superadmin-console/superadmin-console.component';
import { SuperAdminPanelSecurityAuthGuard } from 'src/@shared/guards/superadminpanel.security.guard';

const routes: Routes = [
  {
    path: '',
    component: SuperadminConsoleComponent,
    data: { toolbarShadowEnabled: true,permissions:{role:['admin'],module:'Admin'} }, 
    canActivate: [SuperAdminPanelSecurityAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminConsoleRoutingModule { }
