import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CustomLayoutModule
  ]
})
export class AdminModule { }
