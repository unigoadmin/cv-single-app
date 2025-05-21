// src/app-public/modules/initial/initial.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitialRoutingModule } from './initial.routing.module'
import { CustomLayoutModule } from './custom-layout/custom-layout.module';

@NgModule({
  imports: [
    CommonModule,
    InitialRoutingModule,
    CustomLayoutModule
  ]
})
export class InitialModule { }