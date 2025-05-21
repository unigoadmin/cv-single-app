import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { JcEntryComponentComponent } from './jc-entry-component.component';

const routes: Routes = [
    {path:'',component:JcEntryComponentComponent,canActivate:[AuthGuard], data: {
      toolbarShadowEnabled: true
    }}
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobCentralEntryRoutingModule { }