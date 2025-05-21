import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { JCSecurityAuthGuard} from 'src/@shared/guards/jc.auth.guard';
import {  CandidatesListComponent} from './candidates-list.component';

const routes: Routes = [
    {path:'',component:CandidatesListComponent,canActivate:[JCSecurityAuthGuard], data: {toolbarShadowEnabled: true,
      permissions:{role:['employer'],screens:['SCREEN_CANDIDATES_DATABASE']}
    }},
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidatesListRoutingModule { }