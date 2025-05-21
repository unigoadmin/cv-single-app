import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobsHotListComponent} from './jobs-hot-list.component';
import { JCSecurityAuthGuard } from 'src/@shared/guards/jc.auth.guard';

const routes: Routes = [
    {path:'',component:JobsHotListComponent,canActivate:[JCSecurityAuthGuard], data: {
      toolbarShadowEnabled: true,
      permissions:{role:['employer'],screens:['SCREEN_MY_JOBS']}
    }}
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsHotListRoutingModule { }