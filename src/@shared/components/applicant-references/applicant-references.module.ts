import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { PhoneFormatModule } from 'src/@cv/pipes/phone-format/phone-format.module';
import {JobApplicantReferencesComponent} from './job-applicant-references/job-applicant-references.component';


@NgModule({
    declarations: [JobApplicantReferencesComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    PhoneFormatModule
  ],
  exports:[JobApplicantReferencesComponent]
})
export class ApplicantReferencesModule {
}
