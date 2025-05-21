import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyService }  from './http/company.service';
import { UserService }  from './http/user.service';
import { ModuleService }  from './http/module.service';
import { TreeviewDataService } from './treeview-data.service';


@NgModule({
  declarations: [],
  providers: [ 
    CompanyService,
    UserService,
    ModuleService,
    TreeviewDataService
   ],
  imports: [
    CommonModule,  
  ]
})
export class CoreModule { }