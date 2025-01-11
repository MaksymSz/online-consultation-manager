import {Component, OnInit} from '@angular/core';
import {PatientReservationsLocalJson} from '../../../services/old/patient-reservations-local-json';
import {Consultant} from '../../../models/old/consultant';
import {MatExpansionModule} from '@angular/material/expansion';
import {Consultation} from '../../../models/old/consultation';
import {ConsultationsLocalJson} from '../../../services/old/consultations-local-json';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ReservationDialogComponent} from '../reservation-dialog/reservation-dialog.component';
import {ReservationsLocalJson} from '../../../services/old/reservations-local-json';

@Component({
  selector: 'app-consultants-list',
  standalone: false,

  templateUrl: './consultants-list.component.html',
  styleUrl: './consultants-list.component.css'
})
export class ConsultantsListComponent implements OnInit {

  consultants: Consultant[] = [];
  consultations: Consultation[] = [];

  constructor(private consultantsService: PatientReservationsLocalJson,
              private consultationsService: ConsultationsLocalJson,
              private reservationsService: ReservationsLocalJson,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    // localStorage.setItem('basket', JSON.stringify([]));
    this.consultantsService.getConsultants().subscribe({
      next: data => {
        this.consultants = data;
        // console.log(this.consultants);
      },
    });
    this.consultationsService.getAllConsultations().subscribe({
      next: data => {
        this.consultations = data;
        // console.log(this.consultations);
      },
    });
  }

  filterConsultations(consultantId: number): Consultation[] {
    return this.consultations.filter(consultation => consultation.consultantId === Number(consultantId));
  }

  openDialog(consultation: Consultation): void {
    // console.log(consultation);
    console.log(consultation);
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      width: '1200px',
      data: {
        consultation: consultation,
        timeSlots: [
          {slot: '9:00 AM', maxValue: 1},
          {slot: '10:00 AM', maxValue: 2},
          {slot: '11:00 AM', maxValue: 3},
          {slot: '12:00 PM', maxValue: 4},
          {slot: '1:00 PM', maxValue: 5},
          {slot: '2:00 PM', maxValue: 6},
          {slot: '3:00 PM', maxValue: 7},
          {slot: '4:00 PM', maxValue: 8}
        ],
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log('Dialog data:', result);
        const retrievedBasket = JSON.parse(localStorage.getItem('basket') || '[]');
        retrievedBasket.push(result);
        localStorage.setItem('basket', JSON.stringify(retrievedBasket));
        //
        console.log(retrievedBasket);
      }
    });
  }

}
