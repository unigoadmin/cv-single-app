import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JCSecurityAuthGuard } from 'src/@shared/guards/jc.auth.guard';
import { JobboardResponsesComponent } from './jobboard-responses.component';

const routes: Routes = [
    {path:'',component:JobboardResponsesComponent,canActivate:[JCSecurityAuthGuard], data: {
      toolbarShadowEnabled: true,
      permissions:{role:['employer'],screens:['SCREEN_APPLICANTS_INBOX']}
    }}
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobBoardResponsesRoutingModule { }