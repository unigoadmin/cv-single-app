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
        loadChildren: () => import('./wc-entry-component/wc-entry.module')
          .then(m => m.WorkerCentralEntryModule),
      },
      {
        path: 'wc-dashboard',
        loadChildren: () => import('./workercentral-dashboard/workercentral-dashboard.module')
          .then(m => m.WorkerCentralDashboardModule)
      },
      {
        path: 'placements',
        loadChildren: () => import('./placements/placements.module')
          .then(m => m.PlacementsModule),
      }, 
      {
        path: 'workers',
        loadChildren: () => import('./employees/employees.module')
          .then(m => m.EmployeesModule),
      }, 
      {
        path: 'assignments',
        loadChildren: () => import('./assignments/assignments.module')
          .then(m => m.AssignmentsModule),
      },
      {
        path: 'timesheets',
        loadChildren: () => import('./timesheets/timesheets.module')
          .then(m => m.TimesheetsModule),
      },
      {
        path: 'wc-admin',
        loadChildren: () => import('./wc-admin/wc-admin.module')
          .then(m => m.WCAdminModule),
      },
      {
        path: 'wc-reports',
        loadChildren: () => import('./wc-reports/wc-reports.module')
          .then(m => m.WCReportModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkerCentralRoutingModule { }
