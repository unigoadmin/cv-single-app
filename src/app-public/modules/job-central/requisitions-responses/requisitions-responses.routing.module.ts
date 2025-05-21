import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { RequisitionsResponsesComponent } from './requisitions-responses.component';
import { JCSecurityAuthGuard } from 'src/@shared/guards/jc.auth.guard';


const routes: Routes = [
    {path:'',component:RequisitionsResponsesComponent,canActivate:[JCSecurityAuthGuard], data: {
      toolbarShadowEnabled: true,
      permissions:{role:['employer'],screens:['SCREEN_REQUISITION']}
    }}
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisitionsRoutingModule { }