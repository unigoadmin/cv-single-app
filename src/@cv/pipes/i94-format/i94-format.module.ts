import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {I94FormatPipe} from './i94-format.pipe';


@NgModule({
  declarations: [I94FormatPipe],
  imports: [
    CommonModule
  ],
  exports: [I94FormatPipe]
})
export class I94FormatModule {
}
