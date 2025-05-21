import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WcAdminConsoleComponent} from './wc-admin-console/wc-admin-console.component';
import {DeleteTimesheetsComponent} from './delete-timesheets/delete-timesheets.component';
import { GenerateTimesheetsComponent } from './generate-timesheets/generate-timesheets.component';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';

const routes: Routes = [
    {
        path: '',
        component:WcAdminConsoleComponent,
        data: { toolbarShadowEnabled: true,permissions:{role:['employer'],screens:['SCREEN_ADMIN_CONSOLE']} }, canActivate: [SecurityAuthGuard]
    },
    {
        path: 'delete-timesheets',
        component:DeleteTimesheetsComponent,
        data: { toolbarShadowEnabled: true,permissions:{role:['employer'],screens:['SCREEN_ADMIN_CONSOLE']} }, canActivate: [SecurityAuthGuard]
    },
    {
        path:'generate-timesheets',
        component:GenerateTimesheetsComponent,
        data: { toolbarShadowEnabled: true,permissions:{role:['employer'],screens:['SCREEN_ADMIN_CONSOLE']} }, canActivate: [SecurityAuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class WCAdminRoutingModule { }