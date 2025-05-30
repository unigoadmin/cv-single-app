import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { SecondaryToolbarModule } from 'src/@cv/components/secondary-toolbar/secondary-toolbar.module';
import { FileUploadModule } from 'ng2-file-upload';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectSearchModule } from 'src/@cv/components/mat-select-search/mat-select-search.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GooglePlacesModule } from '../google-places/google-places.module';
import { MatChipsModule } from '@angular/material/chips';
import { NgxPermissionsModule } from 'ngx-permissions';
import {VendorAccountsRoutingModule} from './vendor-accounts-routing.module';
import {VendorAccountsComponent} from './vendor-accounts.component';
import {ShortenpipeModule } from 'src/@cv/pipes/shortenpipe/shortenpipe.module';
import { AccountContactInfoComponent } from './account-contact-info/account-contact-info.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { MergeAccountsComponent } from './merge-accounts/merge-accounts.component';
import { AssociatedAccountsComponent } from './associated-accounts/associated-accounts.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { AccountNotesComponent } from './account-notes/account-notes.component';
import { AccountNotesDialogComponent } from './account-notes-dialog/account-notes-dialog.component';

@NgModule({
    declarations: [VendorAccountsComponent, AccountContactInfoComponent, AccountDetailComponent, ManageAccountComponent, MergeAccountsComponent, AssociatedAccountsComponent, EditAccountComponent, AccountNotesComponent,AccountNotesDialogComponent],
    imports: [
      CommonModule,
      VendorAccountsRoutingModule,
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
      GooglePlacesModule,
      MatChipsModule,
      ShortenpipeModule,
      NgxPermissionsModule
    ],
    exports:[],
    schemas:[CUSTOM_ELEMENTS_SCHEMA ],
  })

  export class VendorAccountsModule { }