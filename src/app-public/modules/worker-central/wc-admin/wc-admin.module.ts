import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TitleCaseModule } from 'src/@cv/pipes/title-case/title-case.module'
import { PageLayoutModule } from 'src/@cv/components/page-layout/page-layout.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BreadcrumbsModule } from 'src/@cv/components/breadcrumbs/breadcrumbs.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@visurel/iconify-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContainerModule } from 'src/@cv/directives/container/container.module';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollbarModule } from 'src/@cv/components/scrollbar/scrollbar.module'; 
import { DateTokensModule } from 'src/@cv/pipes/date-tokens/date-tokens.module';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { SecondaryToolbarModule } from 'src/@cv/components/secondary-toolbar/secondary-toolbar.module';
import { FileUploadModule } from 'ng2-file-upload';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectSearchModule } from 'src/@cv/components/mat-select-search/mat-select-search.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { GooglePlaceModule }  from '../google-place/google-place.module';
import {WCAdminRoutingModule} from './wc-admin.routing.module';
import {WcAdminConsoleComponent} from './wc-admin-console/wc-admin-console.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {DeleteTimesheetsComponent} from './delete-timesheets/delete-timesheets.component';
import {ShortenpipeModule } from 'src/@cv/pipes/shortenpipe/shortenpipe.module';
import {DeleteConformDialogComponent} from './delete-conform-dialog/delete-conform-dialog.component';
import {GenerateTimesheetsComponent} from './generate-timesheets/generate-timesheets.component';
import { NgxPermissionsModule } from 'ngx-permissions';



@NgModule({
    declarations: [WcAdminConsoleComponent,DeleteTimesheetsComponent,DeleteConformDialogComponent,GenerateTimesheetsComponent],
    imports: [
      CommonModule,
      PageLayoutModule,
      FlexLayoutModule,
      BreadcrumbsModule,
      MatPaginatorModule,
      MatTableModule,
      MatSortModule,
      MatCheckboxModule,
      MatIconModule,
      MatButtonModule,
      MatMenuModule,
      IconModule,
      FormsModule,
      MatTooltipModule,
      ReactiveFormsModule,
      ContainerModule,
      MatSelectModule,
      MatButtonToggleModule,
      MatDialogModule,
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
      GooglePlaceModule,
      MatProgressBarModule,
      MatExpansionModule,
      WCAdminRoutingModule,
      ShortenpipeModule,
      NgxPermissionsModule.forChild(),
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA ],
  })

  export class WCAdminModule { }
