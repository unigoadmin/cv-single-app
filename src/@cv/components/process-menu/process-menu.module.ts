import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessMenuComponent } from './process-menu.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '@visurel/iconify-angular';
import { RouterModule } from '@angular/router';
import { TerminateworkerComponent } from './terminateworker/terminateworker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DateTokensModule } from '../../../@cv/pipes/date-tokens/date-tokens.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { UpdateAssignmentComponent } from './update-assignment/update-assignment.component';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GooglePlaceModule } from '../google-place/google-place.module';
import { MatSelectModule } from '@angular/material/select';
import { TitleCaseModule } from 'src/@cv/pipes/title-case/title-case.module';
import { MatTableModule } from '@angular/material/table';
import { CreatePlacementComponent } from './create-placement/create-placement.component';
@NgModule({
  declarations: [ProcessMenuComponent, TerminateworkerComponent, UpdateAssignmentComponent, CreatePlacementComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    IconModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule, 
MatCheckboxModule,
MatIconModule,
MatInputModule,
DateTokensModule,
MatDatepickerModule,
MatNativeDateModule,
MatDialogModule,
MatSidenavModule,
MatCardModule,
MatDividerModule,
MatListModule,
MatTooltipModule,
GooglePlaceModule,
MatSelectModule,
TitleCaseModule,
MatTableModule
  ],
  exports: [ProcessMenuComponent],
  entryComponents: [ProcessMenuComponent]
})
export class ProcessMenuModule { }
