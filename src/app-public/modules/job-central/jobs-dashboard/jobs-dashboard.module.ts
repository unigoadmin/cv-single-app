import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobsDashboardRoutingModule } from './jobs-dashboard-routing.module';
import { JobsDashboardComponent } from './jobs-dashboard.component';
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
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { SecondaryToolbarModule } from 'src/@cv/components/secondary-toolbar/secondary-toolbar.module';
import { FileUploadModule } from 'ng2-file-upload';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectSearchModule } from 'src/@cv/components/mat-select-search/mat-select-search.module';
import { SafeHtmlModule } from 'src/@cv/pipes/safe-html/safe-html.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ValidationService } from 'src/@cv/services/validation.service';
import { TitleCaseModule } from 'src/@cv/pipes/title-case/title-case.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { JobDetailsComponent } from './job-details/job-details.component';
import { JodDataTableComponent } from './jod-data-table/jod-data-table.component';
import { JobNotesComponent } from './job-notes/job-notes.component';
import { JodSummaryComponent } from './jod-summary/jod-summary.component';
import { CandidateDetailsComponent } from './candidate-details/candidate-details.component';
import { CandidateJobsComponent } from './candidate-jobs/candidate-jobs.component';
import { MatSliderModule } from '@angular/material/slider';
import { ShortenpipeModule } from 'src/@cv/pipes/shortenpipe/shortenpipe.module';
import {JobCentralCommonModule} from '../JC-Common/job-central-common.module';
import {JobBoardResponsesModule} from '../jobboard-responses/jobboard-responses.module';
import { AddCandidateToJobComponent } from './add-candidate-to-job/add-candidate-to-job.component';
import {AddJobComponent } from '../jobs-dashboard/add-job/add-job.component';
import { GooglePlaceModule }  from 'src/@cv/components/google-place/google-place.module';
import { QuillModule } from 'ngx-quill';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { JobNotesDialogComponent } from './job-notes-dialog/job-notes-dialog.component';
import { JobApplicantsComponent } from './job-applicants/job-applicants.component';
import {ExistingRequisitionsComponent} from './existing-requisitions/existing-requisitions.component';
import { VendorLayersModules} from 'src/@shared/components/vendor-layers/vendor-layers.module';
import { FilterComponentsModules} from 'src/@shared/components/filter-components/filter-component.module';
import {CVNotesModules} from 'src/@shared/components/notes-components/notes-components.module';


@NgModule({
  declarations: [JobsDashboardComponent,JobDetailsComponent, JodDataTableComponent,JobNotesComponent, JodSummaryComponent, CandidateDetailsComponent, CandidateJobsComponent,  AddCandidateToJobComponent,AddJobComponent, JobNotesDialogComponent, JobApplicantsComponent,ExistingRequisitionsComponent],
  imports: [
    CommonModule,
    JobsDashboardRoutingModule,
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
    CdkStepperModule,
    SecondaryToolbarModule,
    FileUploadModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectSearchModule,
    MatAutocompleteModule,
    MatChipsModule,
    NgxDocViewerModule,
    TitleCaseModule,
    NgxPermissionsModule.forChild(),
    SafeHtmlModule,
    MatSliderModule,
    ShortenpipeModule,
    JobCentralCommonModule,
    GooglePlaceModule,
    QuillModule.forRoot(),
    MatSlideToggleModule,
    JobBoardResponsesModule,
    VendorLayersModules,
    FilterComponentsModules,
    CVNotesModules
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA ],
  providers:[ValidationService],
  exports:[AddJobComponent]
})
export class JobsDashboardModule { }
