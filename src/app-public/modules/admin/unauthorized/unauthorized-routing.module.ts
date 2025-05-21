import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { UnauthorizedComponent } from './unauthorized.component';

const routes: Routes = [
  {
    path: '',
    component: UnauthorizedComponent,
    data: {
      toolbarShadowEnabled: true
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnauthorizedRoutingModule { }
