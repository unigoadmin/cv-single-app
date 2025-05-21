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
import { CandidateAccountComponent } from './candidate-account/candidate-account.component';
import { CandidateSubVendorComponent } from './candidate-sub-vendor/candidate-sub-vendor.component';
import { EndClientInternalComponent } from './end-client-internal/end-client-internal.component';
import { EndClientC2cComponent } from './end-client-c2c/end-client-c2c.component';
import { PrimeVendorComponent } from './prime-vendor/prime-vendor.component';
import { MspVendorComponent } from './msp-vendor/msp-vendor.component';
import { IpVendorComponent } from './ip-vendor/ip-vendor.component';
import { SubPrimeVendorComponent } from './sub-prime-vendor/sub-prime-vendor.component';
import { ReferalVendorComponent } from './referal-vendor/referal-vendor.component';
import { BillingVendorComponent } from './billing-vendor/billing-vendor.component';


@NgModule({
    declarations: [CandidateAccountComponent, CandidateSubVendorComponent, EndClientInternalComponent, EndClientC2cComponent, PrimeVendorComponent, MspVendorComponent, IpVendorComponent, SubPrimeVendorComponent, ReferalVendorComponent, BillingVendorComponent],
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
    MatCheckboxModule
  ],
  exports:[CandidateAccountComponent,CandidateSubVendorComponent,EndClientInternalComponent,EndClientC2cComponent,
    PrimeVendorComponent,MspVendorComponent,IpVendorComponent,SubPrimeVendorComponent,ReferalVendorComponent,BillingVendorComponent]
})
export class VendorLayersModules {
}
