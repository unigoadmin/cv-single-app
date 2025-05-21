// src/app-public/modules/initial/initial-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';
import { AuthGuard } from 'src/@shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth-callback',
    loadChildren: () => import('./auth-callback/auth-callback.module')
      .then(m => m.AuthCallbackModule)
  },
  {
    path: '',
    component: CustomLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module')
          .then(m => m.DashboardModule)
      },
      {
        path: 'consultant-dashboard',
        loadChildren: () => import('./consultant-dashboard/consultant-dashboard.module')
          .then(m => m.ConsultantDashboardModule)
      },
      {
        path: 'superadmin-dashboard',
        loadChildren: () => import('./superadmin-dashboard/superadmin-dashboard.module')
          .then(m => m.SuperAdminDashboardModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitialRoutingModule { }