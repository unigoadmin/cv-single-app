import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';
import { BenchCandidatesComponent } from './bench-candidates.component';


const routes: Routes = [
  {
    path: '',
    component: BenchCandidatesComponent,
    data: {
      toolbarShadowEnabled: true,
      permissions:{role:['employer'],
      screens:['SCREEN_BENCH_CANDIDATES']}
    },
    canActivate: [SecurityAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BenchCandidatesRoutingModule { }
