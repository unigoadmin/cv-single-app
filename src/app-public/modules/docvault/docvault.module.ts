import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocVaultRoutingModule } from './docvault.routing.module';
import { CustomLayoutModule } from './custom-layout/custom-layout.module';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    DocVaultRoutingModule,    
    CustomLayoutModule
  ]
})
export class DocVaultModule { }
