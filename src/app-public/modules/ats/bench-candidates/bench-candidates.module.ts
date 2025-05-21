import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BenchCandidatesRoutingModule } from './bench-candidates-routing.module';
import { BenchCandidatesComponent } from './bench-candidates.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import { SubmissionsListComponent } from './submissions-list/submissions-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollbarModule } from 'src/@cv/components/scrollbar/scrollbar.module';
import { DateTokensModule } from 'src/@cv/pipes/date-tokens/date-tokens.module';
import { MatInputModule } from '@angular/material/input';
import { QuickSubmitComponent } from './quick-submit/quick-submit.component';
import { EditSubmitComponent } from './edit-submit/edit-submit.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { SecondaryToolbarModule } from 'src/@cv/components/secondary-toolbar/secondary-toolbar.module';
import { FileUploadModule } from 'ng2-file-upload';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectSearchModule } from 'src/@cv/components/mat-select-search/mat-select-search.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import {SubmissionsModule} from '../submissions/submissions.module';
import { ValidationService } from 'src/@cv/services/validation.service';
import { TitleCaseModule } from 'src/@cv/pipes/title-case/title-case.module';
import { ViewResumeComponent } from './view-resume/view-resume.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import {ShortenpipeModule } from 'src/@cv/pipes/shortenpipe/shortenpipe.module';
import {CustomValidationModules} from 'src/@shared/components/custom-validations/custom-validation.module';
import {DirectivesModule} from 'src/@shared/directives/Directive.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { JobCentralCommonModule } from  '../../job-central/JC-Common/job-central-common.module' ; 
import { LowerCaseModule } from 'src/@cv/pipes/lower-case/lower-case.module';
import { PhoneFormatModule } from 'src/@cv/pipes/phone-format/phone-format.module';
import { GooglePlaceModule }  from 'src/@cv/components/google-place/google-place.module';
import {HalfStarRatingModules} from 'src/@shared/components/half-star-rating/half-star-rating.module';
 


@NgModule({
  declarations: [BenchCandidatesComponent,SubmissionsListComponent,QuickSubmitComponent, EditSubmitComponent, ViewResumeComponent],
  imports: [
    CommonModule,
    BenchCandidatesRoutingModule,
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
    NgxDocViewerModule,
    SubmissionsModule,
    TitleCaseModule,
    ShortenpipeModule,
    CustomValidationModules,
    DirectivesModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    JobCentralCommonModule,
    LowerCaseModule,
    PhoneFormatModule,
    GooglePlaceModule,
    HalfStarRatingModules,
    NgxPermissionsModule.forChild(),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA ],
  providers:[ValidationService],
  exports:[]
})
export class BenchCandidatesModule { }
