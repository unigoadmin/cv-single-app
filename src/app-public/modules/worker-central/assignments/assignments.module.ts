

import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignmentsRoutingModule } from './assignments-routing.module';
import { AssignmentsComponent } from './assignments.component';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { EditAssignmentComponent } from './edit-assignment/edit-assignment.component';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { PageLayoutModule } from 'src/@cv/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from 'src/@cv/components/breadcrumbs/breadcrumbs.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileUploadModule } from 'ng2-file-upload';
import { MatSelectSearchModule } from 'src/@cv/components/mat-select-search/mat-select-search.module';
import { ScrollbarModule } from 'src/@cv/components/scrollbar/scrollbar.module';
import { SecondaryToolbarModule } from 'src/@cv/components/secondary-toolbar/secondary-toolbar.module';
import { ContainerModule } from 'src/@cv/directives/container/container.module';
import { DateTokensModule } from 'src/@cv/pipes/date-tokens/date-tokens.module';
import { TitleCaseModule } from 'src/@cv/pipes/title-case/title-case.module';
import { MatSelectModule } from '@angular/material/select';
import { GooglePlaceModule }  from '../google-place/google-place.module';
import { ViewAssignmentComponent } from './view-assignment/view-assignment.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import {ShortenpipeModule } from 'src/@cv/pipes/shortenpipe/shortenpipe.module';

@NgModule({
  imports: [
    CommonModule,
    AssignmentsRoutingModule,
    
    PageLayoutModule,
    FlexLayoutModule,
    BreadcrumbsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatIconModule,
    MatMenuModule,
    IconModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ContainerModule,
    MatSortModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    MatDividerModule,
    DragDropModule,
    ScrollbarModule,
    DateTokensModule,
    MatInputModule,
    MatGridListModule,
    MatTabsModule,
    MatListModule,
    MatDialogModule,
    MatRadioModule,
    MatStepperModule,
    SecondaryToolbarModule,
    FileUploadModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectSearchModule,
    MatAutocompleteModule,
    MatChipsModule,
    TitleCaseModule,
    MatSelectModule,
    GooglePlaceModule,
    ShortenpipeModule,
    NgxPermissionsModule.forChild(),
  ],
  declarations: [AssignmentsComponent,AddAssignmentComponent,EditAssignmentComponent, ViewAssignmentComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA ]
})
export class AssignmentsModule { }