import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout/public-layout.component';

const routes: Routes = [
  // {
  //   path: 'auth-callback',
  //   loadChildren: () => import('./auth-callback/auth-callback.module')
  //     .then(m => m.AuthCallbackModule)
  // },
  {
    path: 'initial/auth-callback',
    loadChildren: () => import('./modules/initial/auth-callback/auth-callback.module')
      .then(m => m.AuthCallbackModule)
  },
  {
    path: 'ats/auth-callback',
    loadChildren: () => import('./modules/ats/auth-callback/auth-callback.module')
      .then(m => m.AuthCallbackModule)
  },
  {
    path: 'job-central/auth-callback',
    loadChildren: () => import('./modules/job-central/auth-callback/auth-callback.module')
      .then(m => m.AuthCallbackModule)
  },
  {
    path: 'worker-central/auth-callback',
    loadChildren: () => import('./modules/worker-central/auth-callback/auth-callback.module')
      .then(m => m.AuthCallbackModule)
  },
  {
    path: 'admin/auth-callback',
    loadChildren: () => import('./modules/admin/auth-callback/auth-callback.module')
      .then(m => m.AuthCallbackModule)
  },
  {
    path: 'docvault/auth-callback',
    loadChildren: () => import('./modules/docvault/auth-callback/auth-callback.module')
      .then(m => m.AuthCallbackModule)
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./modules/initial/unauthorized/unauthorized.module')
      .then(m => m.UnauthorizedModule),
  },
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('./authpages/home/home.module')
          .then(m => m.HomeModule)
      },
      {
        path: 'contact',
        loadChildren: () => import('./authpages/contact/contact.module')
          .then(m => m.ContactModule)
      },
      {
        path: 'register',
        loadChildren: () => import('./authpages/register/register.module')
          .then(m => m.RegisterModule)
      },
      {
        path: 'forgot-password',
        loadChildren: () => import('./forgot-password/forgot-password.module')
          .then(m => m.ForgotPasswordModule)
      },
      {
        path: 'verify',
        loadChildren: () => import('./verify/verify.module')
          .then(m => m.VerifyModule)
      },
      {
        path: 'reset-password',
        loadChildren: () => import('./reset-password/reset-password.module')
          .then(m => m.ResetPasswordModule)
      },
      {
        path: 'jobs',
        loadChildren: () => import('./public-jobs/public-jobs.module')
          .then(m=>m.PublicJobsModule)
      },
    ]
  },
  {
    path: '',
    loadChildren: () => import('./modules/initial/initial.module')
      .then(m => m.InitialModule)
  },
  {
    path: 'talent-central',
    loadChildren: () => import('./modules/ats/talent-central.module')
      .then(m => m.TalentCentralModule),
  },
  {
    path: 'job-central',
    loadChildren: () => import('./modules/job-central/job-central.module')
      .then(m => m.JobCentralModule),
  },
  {
    path: 'worker-central',
    loadChildren: () => import('./modules/worker-central/worker-central.module')
      .then(m => m.WorkerCentralModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module')
      .then(m => m.AdminModule),
  },
  {
    path: 'docvault',
    loadChildren: () => import('./modules/docvault/docvault.module')
      .then(m => m.DocVaultModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
