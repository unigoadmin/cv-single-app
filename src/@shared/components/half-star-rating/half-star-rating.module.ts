import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import {HalfStarRatingComponent} from './half-star-rating.component';
import { CommStarRatingComponent } from './comm-star-rating/comm-star-rating.component';

@NgModule({
    declarations: [HalfStarRatingComponent, CommStarRatingComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSliderModule
    
  ],
  exports:[HalfStarRatingComponent,CommStarRatingComponent]
})
export class HalfStarRatingModules {
}
