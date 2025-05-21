import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';
import { WcEntryComponentComponent } from './wc-entry-component.component';

const routes: Routes = [
    {path:'',component:WcEntryComponentComponent,canActivate:[SecurityAuthGuard], data: {
      toolbarShadowEnabled: true
    }}
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkerCentralEntryRoutingModule { }