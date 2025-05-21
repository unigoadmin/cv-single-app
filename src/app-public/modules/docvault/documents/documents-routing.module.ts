import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuicklinkModule } from 'ngx-quicklink';
import { DocumentsComponent } from './documents.component';
import { VexRoutes } from 'src/@cv/interfaces/vex-route.interface';
import { AuthGuard } from 'src/@shared/guards/auth.guard';


const routes: VexRoutes = [
  {
    path: '',
    component: DocumentsComponent,
    data: {
      // scrollDisabled: true,
      toolbarShadowEnabled: true
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, QuicklinkModule]
})
export class DocumentsRoutingModule {
}
