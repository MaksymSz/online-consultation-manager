import {Component, OnInit} from '@angular/core';
import {PatientsService} from '../../../services/patients.service';
import {AuthService} from '../../../services/auth.service';
import {Reservation} from '../../../models/reservation';

@Component({
  selector: 'home-patient',
  standalone: false,

  templateUrl: './home-patient.component.html',
  styleUrl: './home-patient.component.css'
})
export class HomePatientComponent implements OnInit {
  earliest: any;

  constructor(private authService: AuthService,
            private patientsService: PatientsService) {
}

  ngOnInit(): void {
      this.patientsService.getEarliestReservation().subscribe(
        (reservation: Reservation) => {
          this.earliest = reservation;
          console.log(this.earliest);
        }
      )
    }
}
