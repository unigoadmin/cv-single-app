import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectSearchComponent } from './mat-select-search.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { IconModule } from '@visurel/iconify-angular';

@NgModule({
  declarations: [MatSelectSearchComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    IconModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatSelectSearchComponent
  ]
})
export class MatSelectSearchModule { }
