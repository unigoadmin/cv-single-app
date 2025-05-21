import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { TcSettingsComponent } from './tc-settings.component';
import { InterviewStatusComponent } from './interview-status/interview-status.component';
import { AccountTypesComponent } from './account-types/account-types.component';
import { SubmissionsStatusComponent } from './submissions-status/submissions-status.component';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';

const routes: Routes = [
  {
    path:'',component:TcSettingsComponent,data: { toolbarShadowEnabled: true }, canActivate: [AuthGuard],
    children:[
      { path: '', redirectTo: 'resume-source', pathMatch: 'full' },
      
      {
        path:'interview-status',
        component:InterviewStatusComponent,
        data: { toolbarShadowEnabled: true, 
          permissions:{role:['employer'],
          screens:['SCREEN_SETTINGS']}}, 
        canActivate: [SecurityAuthGuard]
      },
      {
        path:'accounttypes',
        component:AccountTypesComponent,
        data: { toolbarShadowEnabled: true,
          permissions:{role:['employer'],
          screens:['SCREEN_SETTINGS']} }, 
        canActivate: [SecurityAuthGuard]
      },
      {
        path:'submissionsstatus',
        component:SubmissionsStatusComponent,
        data: { toolbarShadowEnabled: true,
          permissions:{role:['employer'],
          screens:['SCREEN_SETTINGS']} }, 
        canActivate: [SecurityAuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TCSettingsRoutingModule { }