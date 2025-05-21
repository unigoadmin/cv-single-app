import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { TenantsComponent } from './tenants.component';
import { SuperAdminPanelSecurityAuthGuard } from 'src/@shared/guards/superadminpanel.security.guard';

const routes: Routes = [
  {
    path: '',
    component: TenantsComponent,
    data: { toolbarShadowEnabled: true,permissions:{role:['admin'],module:'Admin'} }, 
    canActivate: [SuperAdminPanelSecurityAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantsRoutingModule { }
