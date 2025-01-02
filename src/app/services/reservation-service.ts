import {Observable} from 'rxjs';
import {Reservation} from '../models/reservation';


export interface ApiResponse {
  consultants: any[];
  consultations: any[];
  reservations: Reservation[]; // Assuming you have a `Reservation` interface for the reservations
}

export interface ReservationService {
  getReservations(): Observable<ApiResponse>;

  getPatientReservationsByDay(patientId: number, date: Date): Reservation[];

}
