import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomLayoutComponent } from './custom-layout/custom-layout.component';

const routes: Routes = [
  {
    path: '',
    component: CustomLayoutComponent,
    children: [
        {
          path: '',
          redirectTo: 'admin-console',
          pathMatch:'full'
        },
        {
          path: 'admin-console',
          loadChildren: () => import('./admin-console/admin-console.module')
          .then(m => m.AdminConsoleModule),
        },
        {
          path: 'company',
          loadChildren: () => import('./company/company.module')
          .then(m => m.CompanyModule),
        },
        {
          path: 'modules',
          loadChildren: () => import('./modules/modules.module')
          .then(m => m.ModulesModule),
        },
        {
          path: 'users',
          loadChildren: () => import('./users/users.module')
          .then(m => m.UsersModule),
        },
        {
          path: 'roles',
          loadChildren: () => import('./roles/roles.module')
          .then(m => m.RolesModule),
        },
        {
          path: 'coming-soon',
          loadChildren: () => import('./coming-soon/coming-soon.module')
          .then(m => m.ComingSoonModule),
        },
        {
          path:'globalsettings',
          loadChildren:() => import('./global-settings/global-settings.module')
          .then(m=>m.GlobalSettingsModule),
        },
        {
           path:'superadmin-console',
           loadChildren:() => import('./superadmin/superadmin.module')
           .then(m=>m.SuperAdminModule)
        },
        {
          path:'tenants',
          loadChildren:() => import('./superadmin/tenants/tenants.module')
          .then(m=>m.TenantsModule)
         },
         {
          path:'recurring-jobs',
          loadChildren:() => import('./superadmin/recurring-jobs/recurring-jobs-routing.module')
          .then(m=>m.RecurringJobsRoutingModule)
         }
        // {
        //    path:'sproles',
        //    loadChildren:() => import('./superadmin-roles/superadmin-roles.module')
        //    .then(m=>m.SuperAdminRolesModule),
        // }
      ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
