import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdentityService }  from './http/identity.service';



@NgModule({
  declarations: [],
  providers: [ 
    IdentityService,
   
   ],
  imports: [
    CommonModule,  
  ]
})
export class CoreModule { }