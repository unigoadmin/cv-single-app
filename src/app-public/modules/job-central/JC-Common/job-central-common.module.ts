import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { ShortenpipeModule } from 'src/@cv/pipes/shortenpipe/shortenpipe.module';
import { SecondaryToolbarModule } from 'src/@cv/components/secondary-toolbar/secondary-toolbar.module';
import { FileUploadModule } from 'ng2-file-upload';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectSearchModule } from 'src/@cv/components/mat-select-search/mat-select-search.module';
import { SafeHtmlModule } from 'src/@cv/pipes/safe-html/safe-html.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ValidationService } from 'src/@cv/services/validation.service';
import { TitleCaseModule } from 'src/@cv/pipes/title-case/title-case.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatSliderModule } from '@angular/material/slider';
import { GooglePlaceModule }  from 'src/@cv/components/google-place/google-place.module';
import { CandidateResumeViewComponent } from './candidate-resume-view/candidate-resume-view.component';
import { ApplicantCandidateComponent } from './applicant-candidate/applicant-candidate.component';
import { ApplicantAssignComponent } from './applicant-assign/applicant-assign.component';
import { ShareApplicantComponent } from './share-applicant/share-applicant.component';
import { AssignMyselfComponent } from './assign-myself/assign-myself.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import {VendorLayersModules} from 'src/@shared/components/vendor-layers/vendor-layers.module';
import { ApplicantNewComponent } from './applicant-new/applicant-new.component';
import { TextMaskModule } from 'angular2-text-mask';
import { HalfStarRatingModules} from 'src/@shared/components/half-star-rating/half-star-rating.module';
import { PhoneFormatModule } from 'src/@cv/pipes/phone-format/phone-format.module';
import { ApplicantIgnoreComponent } from './applicant-ignore/applicant-ignore.component';
import { LowerCaseModule } from 'src/@cv/pipes/lower-case/lower-case.module';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApplicantAttachmentViewComponent } from './applicant-attachment-view/applicant-attachment-view.component';
import { FilterComponentsModules} from 'src/@shared/components/filter-components/filter-component.module';
import {ApplicantReferencesModule} from 'src/@shared/components/applicant-references/applicant-references.module';


@NgModule({
    declarations: [CandidateResumeViewComponent,ApplicantCandidateComponent,ApplicantAssignComponent,ShareApplicantComponent,AssignMyselfComponent,ApplicantNewComponent,ApplicantIgnoreComponent, ApplicantAttachmentViewComponent],
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
        MatProgressBarModule,
        NgxDocViewerModule,
        TitleCaseModule,
        NgxPermissionsModule.forChild(),
        SafeHtmlModule,
        MatSliderModule,
        ShortenpipeModule,
        MatToolbarModule,
        GooglePlaceModule,
        VendorLayersModules,
        TextMaskModule,
        HalfStarRatingModules,
        PhoneFormatModule,
        LowerCaseModule,
        MatFormFieldModule,
        MatRippleModule,
        FilterComponentsModules,
        ApplicantReferencesModule
        
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA ],
      providers:[ValidationService],
      exports:[CandidateResumeViewComponent,ApplicantCandidateComponent,ApplicantAssignComponent,ShareApplicantComponent,AssignMyselfComponent]
})
export class JobCentralCommonModule { }