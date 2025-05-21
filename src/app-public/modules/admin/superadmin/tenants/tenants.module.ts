import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageLayoutModule } from 'src/@cv/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from 'src/@cv/components/breadcrumbs/breadcrumbs.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@visurel/iconify-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContainerModule } from 'src/@cv/directives/container/container.module';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PhoneFormatModule } from 'src/@cv/pipes/phone-format/phone-format.module';
import { ScrollbarModule } from 'src/@cv/components/scrollbar/scrollbar.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { AdminGooglePlacesModule } from '../../admin-google-places/admin-google-places.module';
import { TenantsRoutingModule } from './tenants-routing.module';
import { TenantsComponent } from './tenants.component';
import { ViewTenantDetailsComponent} from './view-tenant-details/view-tenant-details.component';
import { ManageTenantDetailsComponent } from './manage-tenant-details/manage-tenant-details.component';
import {EditTenantDetailsComponent} from './edit-tenant-details/edit-tenant-details.component';
import {EditRootUserComponent } from './edit-root-user/edit-root-user.component';



@NgModule({
  declarations: [TenantsComponent,ViewTenantDetailsComponent, ManageTenantDetailsComponent,EditTenantDetailsComponent, EditRootUserComponent],
  imports: [
    CommonModule,
    TenantsRoutingModule,

    PageLayoutModule,
    FlexLayoutModule,
    BreadcrumbsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    IconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ContainerModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatExpansionModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    MatDividerModule,
    MatSlideToggleModule,
    PhoneFormatModule,
    MatRadioModule,
    MatAutocompleteModule,
    ScrollbarModule,
    AdminGooglePlacesModule,
    FormsModule

  ]
})
export class TenantsModule { }
