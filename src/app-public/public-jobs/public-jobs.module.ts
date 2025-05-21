import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PublicJobsRoutingModule} from './public-jobs-routing.module';
import {JobViewComponent} from './job-view/job-view.component';
import {JobQuickApplyComponent} from './job-quick-apply/job-quick-apply.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IconModule } from '@visurel/iconify-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { PhoneFormatModule } from 'src/@cv/pipes/phone-format/phone-format.module';
import { GooglePlaceModule} from 'src/@cv/components/google-place/google-place.module';


@NgModule({
    declarations: [JobViewComponent,JobQuickApplyComponent],
    imports: [
      CommonModule,
      FlexLayoutModule,
      PublicJobsRoutingModule,
      ReactiveFormsModule,
      MatInputModule,
      MatButtonModule,
      IconModule,
      MatIconModule,
      MatCardModule,
      MatSelectModule,
      MatProgressSpinnerModule,
      PhoneFormatModule,
      GooglePlaceModule
    ]
  })
  export class PublicJobsModule {
  }