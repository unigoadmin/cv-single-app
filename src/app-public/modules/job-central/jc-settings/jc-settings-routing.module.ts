import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JCSecurityAuthGuard } from 'src/@shared/guards/jc.auth.guard';
import {  JcSettingsComponent} from './jc-settings.component';

const routes: Routes = [
    {path:'',component:JcSettingsComponent,canActivate:[JCSecurityAuthGuard], data: {
      toolbarShadowEnabled: true,
      permissions:{role:['employer'],screens:['SCREEN_JOBCENTRAL_SETTINGS']}
    }}
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JcSettingsRoutingModule { }