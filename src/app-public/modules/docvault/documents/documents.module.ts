import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageLayoutModule } from 'src/@cv/components/page-layout/page-layout.module'; 
import { BreadcrumbsModule } from 'src/@cv/components/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IconModule } from '@visurel/iconify-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollbarModule } from 'src/@cv/components/scrollbar/scrollbar.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ContainerModule } from 'src/@cv/directives/container/container.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

import { DocumentsComponent } from './documents.component';
import { DocumentsDataTableComponent } from './documents-data-table/documents-data-table.component';
import { DocumentsAddModule } from './documents-add/documents-add.module';
import { DocumentsRoutingModule } from './documents-routing.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DocumentsViewModule } from './documents-view/documents-view.module';
import { DocumentsSharingModule } from './documents-sharing/documents-sharing.module';
import { DocumentsDeleteModule } from './documents-delete/documents-delete.module';

@NgModule({
  declarations: [DocumentsComponent, DocumentsDataTableComponent],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    DocumentsAddModule,
    DocumentsViewModule,
    DocumentsSharingModule,
    DocumentsDeleteModule,
  
    PageLayoutModule,
    BreadcrumbsModule,
    FlexLayoutModule,
    IconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    MatDialogModule,
    ScrollbarModule,
    ReactiveFormsModule,
    ContainerModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    FormsModule
    
  ]
})
export class DocumentsModule {
}
