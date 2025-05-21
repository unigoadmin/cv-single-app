import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';
import { VendorAccountsComponent } from './vendor-accounts.component';

const routes: Routes = [
    {
      path:'',component:VendorAccountsComponent,
      data: { toolbarShadowEnabled: true,
        permissions:{role:['employer'],
        screens:['SCREEN_VENDOR_ACCOUNTS']} }, 
      canActivate: [SecurityAuthGuard]
    }
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class VendorAccountsRoutingModule { }