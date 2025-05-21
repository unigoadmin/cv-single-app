import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelSecurityAuthGuard } from 'src/@shared/guards/adminpanel.security.guard';
import { AdminConsoleComponent } from './admin-console.component';

const routes: Routes = [
  {
    path: '',
    component: AdminConsoleComponent,
    data: { toolbarShadowEnabled: true,permissions:{role:['employer'],module:'Admin'} }, 
    canActivate: [AdminPanelSecurityAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminConsoleRoutingModule { }
