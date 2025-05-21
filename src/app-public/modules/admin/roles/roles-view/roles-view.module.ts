import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesViewComponent } from './roles-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { IconModule } from '@visurel/iconify-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [RolesViewComponent],
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
    MatListModule,
    MatTabsModule,
    MatChipsModule,
    MatTreeModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    FormsModule,
    MatRadioModule
  ],
  entryComponents: [RolesViewComponent]
})
export class RolesViewModule {
}
