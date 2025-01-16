import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {CommonModule, NgIf} from '@angular/common';
import {addMinutes, format, subSeconds} from 'date-fns';
import {ConsultantsService} from '../../services/consultants.service';

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
      this.dialogRef.close({action: 'delete', reservationId: this.data.reservation.id});
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


}

