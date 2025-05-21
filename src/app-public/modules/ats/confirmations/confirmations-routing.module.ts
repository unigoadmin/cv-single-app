import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@shared/guards/auth.guard';
import { ConfirmationsComponent } from '../confirmations/confirmations.component';
import { AddConfirmationComponent } from '../confirmations/add-confirmation/add-confirmation.component';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';

const routes: Routes = [

    {
        path: '',
        component: ConfirmationsComponent,
        data: { toolbarShadowEnabled: true,permissions:{role:['employer'],screens:['SCREEN_CONFIRMATIONS']} }, canActivate: [SecurityAuthGuard]
    },{
        path:'add-Confirmation',
        component:AddConfirmationComponent,data: { toolbarShadowEnabled: true,permissions:{role:['employer'],screens:['SCREEN_CONFIRMATIONS']} }, canActivate: [SecurityAuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfirmationsRoutingModule { }