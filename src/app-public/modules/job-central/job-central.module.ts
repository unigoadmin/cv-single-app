import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobCentralRoutingModule } from './job-central-routing.module';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    JobCentralRoutingModule,
    CustomLayoutModule
  ]
})
export class JobCentralModule { }
