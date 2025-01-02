import {Consultation} from './consultation';
import {Reservation} from './reservation';

export interface ApiResponse {
  consultants: any[];
  consultations: Consultation[];
  reservations: Reservation[]; // Assuming you have a `Reservation` interface for the reservations
}
