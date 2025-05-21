
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {I94FormatModule} from 'src/@cv/pipes/i94-format/i94-format.module';  
import { TitleCaseModule } from 'src/@cv/pipes/title-case/title-case.module';
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
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
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
import {ShortenpipeModule } from 'src/@cv/pipes/shortenpipe/shortenpipe.module';
import {VendorLayersModules} from 'src/@shared/components/vendor-layers/vendor-layers.module';

import { PlacementsRoutingModule } from './placements-routing.module';
import { PlacementsComponent } from './placements.component';
import { AddPlacementComponent } from './add-placement/add-placement.component';
import { EditPlacementComponent } from './edit-placement/edit-placement.component';
import { PlacementService } from '../core/http/placement.service';
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';
import { GooglePlaceModule }  from '../google-place/google-place.module';
import { ViewOnboardingPlacementComponent } from './view-onboarding-placement/view-onboarding-placement.component';
import { PlacementOnboardingComponent } from './placement-onboarding/placement-onboarding.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PlcConfirmDialogComponent } from './plc-confirm-dialog/plc-confirm-dialog.component';
import { CandidateExistsComponent } from './candidate-exists/candidate-exists.component';
import { WorkerExistsComponent } from './worker-exists/worker-exists.component';

import {DirectivesModule} from 'src/@shared/directives/Directive.module';
import { SearchCandidateComponent } from './search-candidate/search-candidate.component';
import { PlcOnboardingConfirmationComponent } from './plc-onboarding-confirmation/plc-onboarding-confirmation.component';


@NgModule({
    declarations: [
      PlacementsComponent, 
      AddPlacementComponent, 
      EditPlacementComponent,
      DocViewerComponent,
      ViewOnboardingPlacementComponent,
      PlacementOnboardingComponent,
      PlcConfirmDialogComponent,
      CandidateExistsComponent,
      WorkerExistsComponent,
      SearchCandidateComponent,
      PlcOnboardingConfirmationComponent,
    ],
  imports: [
    GooglePlaceModule,
    CommonModule,
    PlacementsRoutingModule,
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
    MatProgressBarModule,
    SecondaryToolbarModule,
    FileUploadModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectSearchModule,
    MatAutocompleteModule,
    MatChipsModule,
    TitleCaseModule,
    I94FormatModule,
    ShortenpipeModule,
    NgxPermissionsModule.forChild(),
    VendorLayersModules,
    DirectivesModule
  ],
  providers:[PlacementService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA ],
})
export class PlacementsModule { }