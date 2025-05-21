import { Component, OnInit,EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cv-comm-star-rating',
  templateUrl: './comm-star-rating.component.html',
  styleUrls: ['./comm-star-rating.component.scss']
})
export class CommStarRatingComponent  {
 
  @Input() RatingType:string;
  
  @Input() Commrating:number = 0;
  
  @Output() out_CommRating = new EventEmitter<string>();
  
  onCommRatingChange(event){
    this.out_CommRating.emit(event);
   }
  
}
