import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatFormField, MatHint, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'app-star-rating',

  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css',
  imports: [
    MatHint,
    MatFormField,
    MatIcon,
    MatInput,
    MatButton,
    FormsModule,
    NgForOf,
    NgClass,
    MatLabel
  ]
})
export class StarRatingComponent {
  rating: number = 0; // Default rating value
  comment: string = '';
  maxCommentLength: number = 250; // Max characters allowed
  hoverIndex: number = -1; // For hover effect on stars
  stars = [1, 2, 3, 4, 5]; // Array to represent 5 stars

  constructor(
    public dialogRef: MatDialogRef<StarRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Set the rating when the user clicks a star
  setRating(rating: number): void {
    this.rating = rating;
  }

  // Set hover effect
  setHover(index: number): void {
    this.hoverIndex = index;
  }

  // Clear hover effect
  clearHover(): void {
    this.hoverIndex = -1;
  }

  // Submit the rating
  submitRating(): void {
    if (this.rating > 0 && this.comment.length > 0) {
      this.dialogRef.close({
        stars: this.rating,
        comment: this.comment
      });
    }
  }
}
