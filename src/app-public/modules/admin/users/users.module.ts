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

import { PhoneFormatModule } from 'src/@cv/pipes/phone-format/phone-format.module';
import { UsersComponent } from './users.component';
import { UsersDataTableComponent } from './users-data-table/users-data-table.component';
import { UsersEditModule } from './users-edit/users-edit.module';
import { UsersViewModule } from './users-view/users-view.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersTableMenuComponent } from './users-table-menu/users-table-menu.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
//import { UsersEditComponent } from './users-edit/users-edit.component';


@NgModule({
  declarations: [UsersComponent, UsersDataTableComponent, UsersTableMenuComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    UsersEditModule,
    UsersViewModule,
    ResetPasswordModule,

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
    FormsModule,
    PhoneFormatModule
    
  ],
  // exports:[UsersEditComponent]
})
export class UsersModule {
}
