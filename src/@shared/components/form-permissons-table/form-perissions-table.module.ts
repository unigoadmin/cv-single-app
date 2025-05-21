import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormPermissonsTableComponent } from './form-permissons-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IconModule } from '@visurel/iconify-angular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [FormPermissonsTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    IconModule,
    MatSlideToggleModule
  ],
  exports: [FormPermissonsTableComponent]
})
export class FormPermissonsTableModule {
}
