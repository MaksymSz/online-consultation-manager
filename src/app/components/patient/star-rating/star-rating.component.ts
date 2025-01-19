import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-star-rating',
  standalone: false,

  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
  stars: number = 0;
  comment: string = '';

  constructor(
    public dialogRef: MatDialogRef<StarRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  onRate(stars: number): void {
    this.stars = stars;
  }

  onSave(): void {
    this.dialogRef.close({stars: this.stars, comment: this.comment});
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
