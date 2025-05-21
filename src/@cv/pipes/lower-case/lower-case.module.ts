import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LowerCasePipe } from './lower-case.pipe';


@NgModule({
  declarations: [LowerCasePipe],
  imports: [
    CommonModule
  ],
  exports: [LowerCasePipe]
})
export class LowerCaseModule {
}
