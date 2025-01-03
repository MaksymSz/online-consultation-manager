import {Component, OnInit} from '@angular/core';
import {PatientReservationsLocalJson} from '../../../services/patient-reservations-local-json';
import {Consultant} from '../../../models/consultant';
import {MatExpansionModule} from '@angular/material/expansion';
import {Consultation} from '../../../models/consultation';
import {ConsultationsLocalJson} from '../../../services/consultations-local-json';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ReservationDialogComponent} from '../reservation-dialog/reservation-dialog.component';

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
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.consultantsService.getConsultants().subscribe({
      next: data => {
        this.consultants = data;
      },
    });
    this.consultationsService.getAllConsultations().subscribe({
      next: data => {
        this.consultations = data;
      },
    });
  }

  filterConsultations(consultantId: number): Consultation[] {
    return this.consultations.filter(consultation => consultation.consultantId === consultantId);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      width: '1200px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog data:', result);
        // You can use the form data (result) here
      }
    });
  }

}
