import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { TermsAndCondtionsComponent } from './terms-and-condtions.component';

const routes: Routes = [
  {
    path: '',
    component: TermsAndCondtionsComponent,
    data: {
      toolbarShadowEnabled: true
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsAndCondtionsRoutingModule { }
