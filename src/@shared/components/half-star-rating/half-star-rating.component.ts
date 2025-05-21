import { Component, OnInit,EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cv-half-star-rating',
  templateUrl: './half-star-rating.component.html',
  styleUrls: ['./half-star-rating.component.scss']
})
export class HalfStarRatingComponent  {
  
  @Input() RatingType:string;
  @Input() Techrating:number = 0;

  @Output() out_TechRating = new EventEmitter<string>();
 
  //selectedHalfStar:Number;
  // @Input() selectedHalfStar: number = 0;
  // @Output() ratingChange: EventEmitter<number> = new EventEmitter<number>();

  // halfStars = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

  onRatingChange(event){
   this.out_TechRating.emit(event);
  }



  // @Input() rating: number;
  // @Output() ratingChange = new EventEmitter<number>();
  // icons = [1, 2, 3, 4, 5];

  // rate(icon: number) {
  //   if (this.rating === icon) {
  //     this.rating = icon - 0.5;
  //   } else {
  //     this.rating = icon;
  //   }
  //   this.ratingChange.emit(this.rating);
  // }

  // @Input() rating: number = 1.5;
  // @Input() maxRating: number = 5;
  // @Input() disabled: boolean = false;
  // @Input() activeColor: string = '#fdd835';
  // @Input() inactiveColor: string = '#ccc';
  // @Output() ratingChanged: EventEmitter<number> = new EventEmitter<number>();

  // icons = [];

  // getColor(icon: number) {
  //   if (this.rating >= icon) {
  //     return '#fdd835';
  //   } else {
  //     return '#ccc';
  //   }
  // }

  // ngOnInit() {
  //   this.icons = Array.from({ length: this.maxRating }, (_, i) => {
  //     const filled = i < Math.floor(this.rating) || (i == Math.floor(this.rating) && this.rating % 1 >= 0.5);
  //     const name = filled ? 'star' : 'star_border';
  //     return { name, filled };
  //   });
  // }

  // onIconClicked(icon) {
  //   if (!this.disabled) {
  //     const index = this.icons.indexOf(icon);
  //     let rating = index + 1;

  //     if (icon.filled) {
  //       if (rating == this.rating) {
  //         rating -= 0.5;
  //       } else {
  //         rating = Math.floor(this.rating) + 0.5;
  //       }
  //     }

  //     this.rating = rating;
  //     this.ratingChanged.emit(rating);
  //     this.icons.forEach((icon, i) => {
  //       const filled = i < Math.floor(this.rating) || (i == Math.floor(this.rating) && this.rating % 1 >= 0.5);
  //       const name = filled ? 'star' : 'star_border';
  //       icon.filled = filled;
  //       icon.name = name;
  //     });
  //   }
  // }
  

}
