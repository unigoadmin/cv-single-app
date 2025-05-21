import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimesheetsComponent } from './timesheets.component';
import {ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { TsSettingsComponent } from './ts-settings/ts-settings.component';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';
import { ConsultantSecurityAuthGuard } from 'src/@shared/guards/consultantsecurty.auth.guard';



const routes: Routes = [
    {   
        path: '',
        component: TimesheetsComponent,
        data: { toolbarShadowEnabled: true,permissions:{role:['candidate'],screens:['SCREEN_TIMESHEETS_CONSULTANT']} }, canActivate: [ConsultantSecurityAuthGuard]
    },
    {
      path: 'ManagerDashboard',
        component: ManagerDashboardComponent,
        data: { toolbarShadowEnabled: true,permissions:{role:['employer'],screens:['SCREEN_MANAGER_DASHBOARD']} }, canActivate: [SecurityAuthGuard]
    },
    {
      path: 'Settings',
        component: TsSettingsComponent,
        data: { toolbarShadowEnabled: true,permissions:{role:['employer'],screens:['SCREEN_MANAGER_DASHBOARD']} }, canActivate: [SecurityAuthGuard]
    },
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetsRoutingModule { }