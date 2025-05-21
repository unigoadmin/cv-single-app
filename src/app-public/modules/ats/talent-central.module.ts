import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentCentralRoutingModule } from './talent-central-routing.module';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TalentCentralRoutingModule,
    CustomLayoutModule
  ]
})
export class TalentCentralModule { }
