import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PageLayoutModule } from '../../../@cv/components/page-layout/page-layout.module';
import { BreadcrumbsModule } from '../../../@cv/components/breadcrumbs/breadcrumbs.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateTokensModule } from '../../../@cv/pipes/date-tokens/date-tokens.module';
import { IconModule } from '@visurel/iconify-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollbarModule } from '../../../@cv/components/scrollbar/scrollbar.module';
import { ContainerModule } from '../../../@cv/directives/container/container.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatChipsModule } from '@angular/material/chips';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import {CandidateExistsComponent} from './candidate-exists/candidate-exists.component';


@NgModule({
    declarations: [CandidateExistsComponent],
  imports: [
    CommonModule,
    PageLayoutModule,
    BreadcrumbsModule,
    MatDialogModule,
    MatIconModule,
    FlexLayoutModule,
    MatInputModule,
    MatDividerModule,
    MatDatepickerModule,
    IconModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    FormsModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatTableModule,
    DateTokensModule,
    MatCardModule,
    MatListModule,
    MatPaginatorModule,
    DragDropModule,
    ScrollbarModule,
    ContainerModule,
    MatButtonToggleModule,
    NgxPermissionsModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    MatChipsModule,
    MatRadioModule,
    MatTabsModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA ],
  exports:[]
})
export class CustomValidationModules {
}
