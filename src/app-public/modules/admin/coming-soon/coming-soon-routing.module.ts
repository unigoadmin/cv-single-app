import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';
import { AdminPanelSecurityAuthGuard } from 'src/@shared/guards/adminpanel.security.guard';
import { ComingSoonComponent } from './coming-soon.component';


const routes: Routes = [
  {
    path: '',
    component: ComingSoonComponent,
    data: { toolbarShadowEnabled: true,permissions:{role:['employer'],module:'Admin'} }, 
    canActivate: [AdminPanelSecurityAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class ComingSoonRoutingModule {
}
