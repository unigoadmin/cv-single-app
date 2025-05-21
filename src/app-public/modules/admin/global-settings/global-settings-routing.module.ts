import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelSecurityAuthGuard } from 'src/@shared/guards/adminpanel.security.guard';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { GlobalSettingsComponent } from './global-settings.component';

const routes: Routes = [
  {
    path: '',
    component: GlobalSettingsComponent,
    data: { toolbarShadowEnabled: true,permissions:{role:['employer'],module:'Admin'} }, 
    canActivate: [AdminPanelSecurityAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalSettingsRoutingModule { }
