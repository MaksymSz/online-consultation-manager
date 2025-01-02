import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { format } from 'date-fns';
import { Reservation } from '../models/reservation';
import { ReservationService } from './reservation-service';

export interface ApiResponse {
  consultants: any[];
  consultations: any[];
  reservations: Reservation[]; // Assuming you have a `Reservation` interface for the reservations
}

@Injectable({
  providedIn: 'root',
})
export class ReservationsLocalJson{
  private apiUrl = 'http://localhost:3000'; // JSON Server base URL

  constructor(private http: HttpClient) {}

  // Fetch all reservations
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations`);
  }

  // Fetch reservations for a specific patient on a specific day
  getPatientReservationsByDay(patientId: number, date: Date): Observable<Reservation[]> {
    const dateTime = format(date, 'yyyy-MM-dd');
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations`).pipe(
      map((reservations) =>
        reservations.filter((reservation) => {
          const reservationDate = format(new Date(reservation.date), 'yyyy-MM-dd'); // Extract just the date
          return reservation.patientId === patientId && reservationDate === dateTime;
        })
      )
    );
  }

  // Delete a reservation by ID
  deleteReservation(reservationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservations/${reservationId}`);
  }

  // Create a new reservation
  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/reservations`, reservation);
  }

  // Update an existing reservation
  updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/reservations/${reservation.id}`, reservation);
  }
}
