import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutModule } from 'src/@cv/components/page-layout/page-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from 'src/@cv/components/breadcrumbs/breadcrumbs.module';
import {WorkerCentralEntryRoutingModule} from './wc-entry.routing.module';
import {WcEntryComponentComponent} from './wc-entry-component.component';

@NgModule({
    declarations: [WcEntryComponentComponent],
    imports: [
        CommonModule,
        WorkerCentralEntryRoutingModule,
        PageLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        BreadcrumbsModule
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA ],
      providers:[]
})
export class WorkerCentralEntryModule { }