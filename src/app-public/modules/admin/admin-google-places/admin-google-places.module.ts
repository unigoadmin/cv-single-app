import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';


import { AdminGooglePlacesComponent } from '../admin-google-places/admin-google-places.component';

@NgModule({
  declarations: [AdminGooglePlacesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA ],
  exports:[
    AdminGooglePlacesComponent
  ]
})
export class AdminGooglePlacesModule { }
