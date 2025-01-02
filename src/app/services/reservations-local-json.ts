import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Reservation} from '../models/reservation';
import {format} from 'date-fns';
import {ReservationService} from './reservation-service';

export interface ApiResponse {
  consultants: any[];
  consultations: any[];
  reservations: Reservation[]; // Assuming you have a `Reservation` interface for the reservations
}


@Injectable({
  providedIn: 'root'
})
export class ReservationsLocalJson implements ReservationService {

  private jsonDataUrl = 'db.json';  // Path to your mock JSON file
  private reservations: Reservation[] = [];

  constructor(private http: HttpClient) {
    this.getReservations().subscribe({
      next: (data) => {
        this.reservations = data.reservations;
      },
      error: (error) => {
        console.error('Error fetching reservations:', error);
      }
    });

  }


  getReservations(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.jsonDataUrl);
  }


  getPatientReservationsByDay(patientId: number, date: Date): Reservation[] {
    let dateTime = format(date, 'yyyy-MM-dd');
    return this.reservations.filter(reservation => {
      const reservationDate = format(reservation.date, 'yyyy-MM-dd');  // Extract just the date (YYYY-MM-DD)
      return reservation.patientId === patientId && reservationDate === dateTime;
    });
  }
}
