import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignmentsComponent } from './assignments.component';
import { AddPlacementComponent } from '../placements/add-placement/add-placement.component';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';

const routes: Routes = [

    {
        path: '',
        component: AssignmentsComponent,
        data: { toolbarShadowEnabled: true,permissions:{role:['employer'],screens:['SCREEN_ASSIGNMENTS']} }, canActivate: [SecurityAuthGuard]
    },{
        path:'add-placement',
        component:AddPlacementComponent,data: { toolbarShadowEnabled: true,permissions:{role:['employer'],screens:['SCREEN_PLACEMENTS']} }, canActivate: [SecurityAuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssignmentsRoutingModule { }