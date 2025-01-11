import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {format} from 'date-fns';
import {Reservation} from '../../models/old/reservation';
import {ReservationService} from './reservation-service';
import {Absence} from '../../models/old/absence';
import {Consultation} from '../../models/old/consultation';

export interface ApiResponse {
  consultants: any[];
  consultations: any[];
  reservations: Reservation[]; // Assuming you have a `Reservation` interface for the reservations
}

@Injectable({
  providedIn: 'root',
})
export class ReservationsLocalJson {
  private apiUrl = 'http://localhost:3000'; // JSON Server base URL

  constructor(private http: HttpClient) {
  }

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

  getReservationsByConsultant(consultantId: number, date: Date): Observable<Reservation[]> {
    const dateTime = format(date, 'yyyy-MM-dd');
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations`).pipe(
      map((reservations) =>
        reservations.filter((reservation) => {
          const reservationDate = format(new Date(reservation.date), 'yyyy-MM-dd'); // Extract just the date
          return reservation.consultantId === consultantId && reservationDate === dateTime;
        })
      )
    );
  }


  addAbsence(consultantId: number, date: Date) {
    date.setHours(date.getHours() + 1);
    const newAbsence = {
      "consultantId": consultantId,
      "date": date,
    }
    console.log(newAbsence);


    this.http.post<Absence>(`${this.apiUrl}/absences`, newAbsence).subscribe({
      next: (response) => {
        console.log('Absence added successfully', response);
        this.updateReservationsStatusAndPatch(consultantId, date).subscribe({
          next: (response) => {
            console.log('Reservations status updated successfully.');
          },
          error: (err) => {
            console.error('Error updating reservations status:', err);
          }
        })
      },
      error: (err) => {
        console.error('Error adding absence:', err);
      }
    });
  }

  // Your method to update the status field and send PATCH requests:
  updateReservationsStatusAndPatch(consultantId: number, date: Date): Observable<void> {
    console.log(`Updating reservations on day ${date}`);
    return this.getReservationsByConsultant(consultantId, date).pipe(
      map(reservations => {
        reservations.forEach(reservation => {
          reservation.canceled = true;
          console.log('Reservation updated:', reservation);
          this.updateReservationStatus(reservation);
        });
      })
    );
  }

// Method to send PATCH request to update the status of each consultation in the database
  updateReservationStatus(reservation: any): void {
    this.http.patch(`${this.apiUrl}/reservations/${reservation.id}`, {
      canceled: reservation.canceled
    }).subscribe(response => {
      console.log('Reservation status updated successfully', response);
    });
  }

  // Delete a reservation by ID
  deleteReservation(reservationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservations/${reservationId}`);
  }

  // Create a new reservation
  createReservation(reservation: any): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/reservations`, reservation);
  }

  // Update an existing reservation
  updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/reservations/${reservation.id}`, reservation);
  }
}
