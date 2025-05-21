import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { ArchivedResponsesComponent } from './archived-responses/archived-responses.component';
import { JCSecurityAuthGuard } from 'src/@shared/guards/jc.auth.guard';

const routes: Routes = [
    {path:'',component:ArchivedResponsesComponent,canActivate:[JCSecurityAuthGuard], data: {
      toolbarShadowEnabled: true,
      permissions:{role:['employer'],screens:['SCREEN_JOBCENTRAL_ARCHIVED']}
    }}
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchivedResponsesRoutingModule { }