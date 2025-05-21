import { NgModule, Optional, SkipSelf } from '@angular/core'; 
import { InputRefDirective } from './TrimInput.directive';

@NgModule({
    declarations: [InputRefDirective],
    exports: [InputRefDirective],
    imports: [
    ],
    entryComponents: []
  })
  export class DirectivesModule {
  }