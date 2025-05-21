import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';


import { GooglePlacesComponent } from '../google-places/google-places.component';

@NgModule({
  declarations: [GooglePlacesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  exports:[
    GooglePlacesComponent
  ]
})
export class GooglePlacesModule { }
