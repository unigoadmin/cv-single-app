import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacementsComponent } from '../placements/placements.component';
import { AddPlacementComponent } from '../placements/add-placement/add-placement.component';
import { SecurityAuthGuard } from 'src/@shared/guards/securityauth.guard';

const routes: Routes = [

    {
        path: '',
        component: PlacementsComponent,
        data: { toolbarShadowEnabled: true,permissions:{role:['employer'],screens:['SCREEN_PLACEMENTS']} }, canActivate: [SecurityAuthGuard]
    },{
        path:'add-placement',
        component:AddPlacementComponent,data: { toolbarShadowEnabled: true,permissions:{role:['employer'],screens:['SCREEN_PLACEMENTS']} }, canActivate: [SecurityAuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlacementsRoutingModule { }