import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';
import { CandidatesComponent } from './candidates.component';

const routes: Routes = [
    {
      path:'',component:CandidatesComponent,
      data: { toolbarShadowEnabled: true,
        permissions:{role:['employer'],
        screens:['SCREEN_TC_CANDIDATES']} }, 
      canActivate: [SecurityAuthGuard]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CandidatesRoutingModule { } 