import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';
import { UsersComponent } from './users.component';
import { VexRoutes } from 'src/@cv/interfaces/vex-route.interface';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { AdminPanelSecurityAuthGuard } from 'src/@shared/guards/adminpanel.security.guard';


const routes: VexRoutes = [
  {
    path: '',
    component: UsersComponent,
    data: { toolbarShadowEnabled: true,permissions:{role:['employer'],module:'Admin'} }, 
    canActivate: [AdminPanelSecurityAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class UsersRoutingModule {
}
