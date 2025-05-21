import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';
import { EmployeesComponent } from './employees.component';


const routes: Routes = [
 
    {
        path: '',
        component: EmployeesComponent,
        data: { toolbarShadowEnabled: true,permissions:{role:['employer'],screens:['SCREEN_WORKERS']} }, canActivate: [SecurityAuthGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }