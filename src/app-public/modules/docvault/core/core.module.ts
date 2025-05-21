import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentService }  from './http/document.service';



@NgModule({
  declarations: [],
  providers: [ 
    DocumentService,
   
   ],
  imports: [
    CommonModule,  
  ]
})
export class CoreModule { }