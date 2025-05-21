import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';


import { GooglePlaceComponent } from '../google-place/google-place.component';

@NgModule({
  declarations: [GooglePlaceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  exports:[
    GooglePlaceComponent
  ]
})
export class GooglePlaceModule { }