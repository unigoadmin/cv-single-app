import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';
import { InterviewsComponent } from './interviews.component';

const routes: Routes = [
  {
    path:'',component:InterviewsComponent,
    data: { toolbarShadowEnabled: true,
      permissions:{role:['employer'],
      screens:['SCREEN_INTERVIEWS']} }, 
    canActivate: [SecurityAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterviewsRoutingModule { }