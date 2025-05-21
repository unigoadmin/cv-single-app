import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WorkerCentralRoutingModule } from './worker-central-routing.module';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';


@NgModule({
  imports: [
    CommonModule,
    WorkerCentralRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CustomLayoutModule
  ],
  declarations: []
})
export class WorkerCentralModule { }
