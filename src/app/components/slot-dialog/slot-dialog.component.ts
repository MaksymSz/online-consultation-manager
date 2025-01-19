import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {CommonModule, NgIf} from '@angular/common';
import {addMinutes, format, subSeconds} from 'date-fns';
import {ConsultantsService} from '../../services/consultants.service';
import {StarRatingComponent} from '../patient/star-rating/star-rating.component';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AuthService} from '../../services/auth.service';
import {Rating} from '../../models/rating';
import {RatingService} from '../../services/rating.service';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './slot-dialog.component.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    NgIf
  ],
  styleUrl: './slot-dialog.component.css'
})
export class SlotDialogComponent {
  consultantName: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<SlotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { time: string; reservation: any },
    protected consultantsService: ConsultantsService,
    private dialog: MatDialog,
    private firestore: AngularFirestore,
    private authService: AuthService,
    private ratingService: RatingService,
  ) {

    this.consultantsService.getConsultant(data.reservation.consultantId).subscribe({
      next: value => {
        // @ts-ignore
        this.consultantName = value.name;
      }
    })
  }


  close(): void {
    this.dialogRef.close();
  }

  delete(): void {
    if (this.data.reservation) {
      this.dialogRef.close({action: 'delete', reservation: this.data.reservation, time: this.data.time});
      console.log("delete: ", this.data.reservation.id)
    }
  }

  isPast() {
    if (this.data.reservation) {
      const now = new Date();
      const yy = new Date(this.data.reservation.date);
      return yy < now;
    }
    return false;
  }


  openRatingDialog(data: any): void {
    // Check if the patient has already rated this consultant
    let reservation = this.data.reservation;
    console.log('openRating dialog: ', reservation);
    const patientId = this.authService.userId.value;
    this.ratingService.checkIfRated(patientId, reservation.consultantId).subscribe(ratings => {
      if (ratings.length > 0) {
        alert('You have already rated this appointment');
        return;
      }

      // Open the rating dialog if no rating exists
      const dialogRef = this.dialog.open(StarRatingComponent, {
        width: '500px',
        data: {reservationId: data.id, consultantId: reservation.consultantId}
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const patientId = this.authService.userId.value;
          const newRating: Rating = {
            stars: result.stars,
            comment: result.comment,
            patientId: patientId,
            consultantId: reservation.consultantId
          };

          this.addRating(newRating);
        }
      });
    });
  }

  addRating(rating: Rating): void {
    this.ratingService.addRating(rating).then(() => {
      console.log('Rating added');
      alert('Thank you for your rating!');
    }).catch((error) => {
      console.error('Error adding rating:', error);
    });
  }


}

