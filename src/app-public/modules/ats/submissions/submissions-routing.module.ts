import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';
import { SubmissionsComponent } from './submissions.component';

const routes: Routes = [
  {
    path:'',component:SubmissionsComponent,
    data: { toolbarShadowEnabled: true,
      permissions:{role:['employer'],
      screens:['SCREEN_SUBMISSIONS']} }, 
    canActivate: [SecurityAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmissionsRoutingModule { }
