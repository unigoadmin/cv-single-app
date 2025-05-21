import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ApplicantNotesComponent } from './applicant-notes/applicant-notes.component';
import { AttachmentViewComponent } from './attachment-view/attachment-view.component';
import { CandidateNotesComponent } from './candidate-notes/candidate-notes.component';


@NgModule({
    declarations: [ApplicantNotesComponent, AttachmentViewComponent, CandidateNotesComponent],
  imports: [
    CommonModule,
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
    DateTokensModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressBarModule,
    NgxDocViewerModule
  ],
  exports:[ApplicantNotesComponent,CandidateNotesComponent]
})
export class CVNotesModules {
}
