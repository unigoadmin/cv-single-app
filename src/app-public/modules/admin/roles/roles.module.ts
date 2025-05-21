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
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTreeModule } from '@angular/material/tree';
import { MatRadioModule } from '@angular/material/radio';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { RolesDataTableComponent } from './roles-data-table/roles-data-table.component';
import { RolesTableMenuComponent } from './roles-table-menu/roles-table-menu.component';
import { RolesEditModule } from './roles-edit/roles-edit.module';
import { RolesPermissionsModule } from './roles-permissions/roles-permissions.module';
import { RolesViewModule } from './roles-view/roles-view.module';





@NgModule({
  declarations: [RolesComponent,RolesDataTableComponent,RolesTableMenuComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    RolesEditModule,
    RolesPermissionsModule,
    RolesViewModule,

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
    MatListModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatCardModule,
    MatExpansionModule,
    MatBadgeModule,
    MatTreeModule,
    MatRadioModule
  ],
  
})
export class RolesModule { }
