import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';
import { VerifyComponent } from './verify.component';


const routes: Routes = [
  {
    path: ':Id',
    component: VerifyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class VerifyRoutingModule {
}
