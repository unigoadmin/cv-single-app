import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TCSettingsRoutingModule } from './tc-settings-routing.module';
import { TcSettingsComponent } from './tc-settings.component';
import { BreadcrumbsModule } from 'src/@cv/components/breadcrumbs/breadcrumbs.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IconModule } from '@visurel/iconify-angular';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollbarModule } from 'src/@cv/components/scrollbar/scrollbar.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContainerModule } from 'src/@cv/directives/container/container.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PageLayoutModule } from 'src/@cv/components/page-layout/page-layout.module';
import { InterviewStatusComponent } from './interview-status/interview-status.component';
import {MatTabsModule} from '@angular/material/tabs';
import { AddAtsSettingsComponent } from './add-ats-settings/add-ats-settings.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DateTokensModule } from 'src/@cv/pipes/date-tokens/date-tokens.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { FileUploadModule } from 'ng2-file-upload';
import { MatSelectSearchModule } from 'src/@cv/components/mat-select-search/mat-select-search.module';
import { SecondaryToolbarModule } from 'src/@cv/components/secondary-toolbar/secondary-toolbar.module';
import { TitleCaseModule } from 'src/@cv/pipes/title-case/title-case.module';
import { MatSelectModule } from '@angular/material/select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AccountTypesComponent } from './account-types/account-types.component';
import { SubmissionsStatusComponent } from './submissions-status/submissions-status.component';
import {InterviewTypesComponent} from './interview-types/interview-types.component';
import {InterviewRoundsComponent} from './interview-rounds/interview-rounds.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';


@NgModule({
    declarations: [TcSettingsComponent, InterviewStatusComponent, AddAtsSettingsComponent, AccountTypesComponent, SubmissionsStatusComponent,InterviewTypesComponent,InterviewRoundsComponent, NotificationSettingsComponent],
    imports: [
      CommonModule,
      TCSettingsRoutingModule,
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
      MatSlideToggleModule,
      NgxPermissionsModule.forChild(),
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA ],
  })
  export class TCSettingsModule { }