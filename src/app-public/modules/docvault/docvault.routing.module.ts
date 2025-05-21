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
            redirectTo: 'documents',
            pathMatch:'full'
          },
          {
            path: 'documents',
            loadChildren: () => import('./documents/documents.module')
            .then(m => m.DocumentsModule),
          },
         
        ]
    }
    
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DocVaultRoutingModule { }