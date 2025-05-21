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
        loadChildren: () => import('./tc-entry-component/tc-entry.module')
          .then(m => m.TalentCentralEntryModule),
      },
      {
        path: 'bench-candidates',
        loadChildren: () => import('./bench-candidates/bench-candidates.module')
          .then(m => m.BenchCandidatesModule),
      },
      {
        path: 'submissions',
        loadChildren: () => import('./submissions/submissions.module')
          .then(m => m.SubmissionsModule),
      },
      {
        path: 'confirmations',
        loadChildren: () => import('./confirmations/confirmations.module')
          .then(m => m.ConfirmationsModule),
      },
      {
        path: 'interviews',
        loadChildren: () => import('./interviews/interviews.module')
          .then(m => m.InterviewsModule),
      },
      {
        path: 'candidates',
        loadChildren: () => import('./candidates/candidates.module')
          .then(m => m.CandidatesModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./tc-settings/tc-settings.module')
          .then(m => m.TCSettingsModule),
      },
      {
        path: 'accounts',
        loadChildren: () => import('./vendor-accounts/vendor-accounts.module')
          .then(m => m.VendorAccountsModule)
      },
      {
        path: 'ats-reports',
        loadChildren: () => import('./reports/reports.module')
          .then(m => m.ReportsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalentCentralRoutingModule { }
